import { Injectable } from '@angular/core';
import { DeviceDetectorService, DeviceInfo } from 'ngx-device-detector';
import { merge, fromEvent, map, Observable, Observer } from 'rxjs';
import { UTILITY } from 'src/app/task-wrapper/utilities/utility';

export class SystemConfig {
  DeviceInfo: DeviceInfo;
  DeviceType: DeviceType;
  Orientation: DeviceOrientation;
  Theme: Theme;
  BasePath: BasePath;

  constructor(
    DeviceInfo: DeviceInfo,
    DeviceType: DeviceType,
    Orientation: DeviceOrientation,
    Theme: Theme,
    BasePath: BasePath) {
    this.DeviceInfo = DeviceInfo;
    this.DeviceType = DeviceType;
    this.Orientation = Orientation;
    this.Theme = Theme;
    this.BasePath = BasePath;
  }
}

export enum Theme {
  System = 'System',
  Light = 'Light',
  Dark = 'Dark'
}

export enum BasePath {
  Desktop = 'tasks/dashboard',
  Mobile = 'tasks'
}

export enum DeviceType {
  Mobile,
  Tablet,
  Desktop,
  None
}

export enum DeviceOrientation {
  Portrait,
  Landscape
}

@Injectable({
  providedIn: 'root'
})
export class SystemSettingsService {

  private m_isSameDevice: boolean = false;
  public get isSameDevice(): boolean { return this.m_isSameDevice; }
  public set isSameDevice(isSameDevice: boolean) { this.m_isSameDevice = isSameDevice; }

  private m_isGuestMode: boolean = true;
  public get isGuestMode(): boolean { return this.m_isGuestMode; }
  public set isGuestMode(isGuestMode: boolean) { this.m_isGuestMode = isGuestMode; localStorage.setItem('isGuestMode', JSON.stringify(isGuestMode)); }

  private m_isVibrationOn: boolean = true;
  public get isVibrationOn(): boolean { return this.m_isVibrationOn; }
  public set isVibrationOn(isVibrationOn: boolean) { this.m_isVibrationOn = isVibrationOn; localStorage.setItem('isVibrationOn', JSON.stringify(isVibrationOn)); }

  private m_isOfflineMode: boolean = true;
  public get isOfflineMode(): boolean { return this.m_isOfflineMode; }
  public set isOfflineMode(isOfflineMode: boolean) { this.m_isOfflineMode = isOfflineMode; localStorage.setItem('isOfflineMode', JSON.stringify(isOfflineMode)); }

  m_systemConfig: SystemConfig;
  public get deviceinfo(): DeviceInfo { return this.m_systemConfig.DeviceInfo; }
  public get basePath(): string { return this.m_systemConfig.BasePath; }
  public get deviceType(): DeviceType { return this.m_systemConfig.DeviceType; }
  public get isMobileDevice(): boolean { return this.m_systemConfig.DeviceType === DeviceType.Mobile; }
  public get isLandscapeMode(): boolean { return this.m_systemConfig.Orientation === DeviceOrientation.Landscape; }
  public get deviceOrientation(): DeviceOrientation { return this.m_systemConfig.Orientation; }
  public get currentTheme(): Theme { return this.m_systemConfig.Theme; }

  private m_systemTheme: Theme.Light | Theme.Dark = Theme.Light;
  constructor(private deviceService: DeviceDetectorService) {
    // system config setup
    const isGuestModeLocalSetting = localStorage.getItem('isGuestMode')
    if (isGuestModeLocalSetting) {
      this.m_isGuestMode = JSON.parse(isGuestModeLocalSetting);
    }
    const isVibrationOnLocalSetting = localStorage.getItem('isVibrationOn')
    if (isVibrationOnLocalSetting === null) {
      localStorage.setItem('isVibrationOn', JSON.stringify(this.m_isVibrationOn));
    } else {
      this.m_isVibrationOn = JSON.parse(isVibrationOnLocalSetting) as boolean;
    }
    this.InitializeTheme();
    const deviceInfo = deviceService.getDeviceInfo();
    const deviceType: DeviceType = this.getDeviceType();
    const orientation: DeviceOrientation = this.getOrientation();
    const theme: Theme = this.getTheme();
    const basePath = deviceType === DeviceType.Desktop ? BasePath.Desktop : BasePath.Mobile;
    this.m_systemConfig = new SystemConfig(deviceInfo, deviceType, orientation, theme, basePath);
  }

  setTheme(theme: Theme) {
    this.m_systemConfig.Theme = theme;
    this.updateTheme(theme);
  }

  isOnline$(): Observable<boolean> {
    return merge(
      fromEvent(window, 'offline').pipe(map(() => false)),
      fromEvent(window, 'online').pipe(map(() => true)),
      new Observable((sub: Observer<boolean>) => {
        sub.next(navigator.onLine);
        sub.complete();
      }));
  }

  private updateTheme(theme: Theme) {
    theme = theme === Theme.System ? this.m_systemTheme : theme;
    const previousTheme = localStorage.getItem('theme') as Theme;
    const themeColor = theme === Theme.Dark ? '#000' : '#fff';
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", themeColor);
    document.body.classList.remove(previousTheme);
    document.body.classList.add(theme);
    localStorage.setItem('theme', theme);
  }

  private InitializeTheme() {
    this.m_systemTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? Theme.Dark : Theme.Light;
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
      const theme = event.matches ? Theme.Dark : Theme.Light;
      this.m_systemTheme = theme;
      this.setTheme(Theme.System);
    });

    const theme = localStorage.getItem('theme') as Theme;
    !theme ? this.updateTheme(Theme.System) : this.updateTheme(theme);
  }

  private getTheme(): Theme {
    return localStorage.getItem('theme') as Theme;
  }

  private getDeviceType(): DeviceType {
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    const isDesktopDevice = this.deviceService.isDesktop();
    return isMobile ? DeviceType.Mobile : (isDesktopDevice ? DeviceType.Desktop : (isTablet ? DeviceType.Tablet : DeviceType.None));
  }

  private getOrientation(): DeviceOrientation {

    window.matchMedia('(orientation: portrait)').addEventListener('change', (m) => {
      // this.m_systemConfig.Orientation = m.matches ? DeviceOrientation.Portrait : DeviceOrientation.Landscape;
      // console.log(this.m_systemConfig.Orientation);
      // if (this.getDeviceType() === DeviceType.Mobile) {
      //   const classToRemove = this.m_systemConfig.Orientation === DeviceOrientation.Portrait ? 'landscapeMode' : 'potraitMode';
      //   const classToAdd = this.m_systemConfig.Orientation === DeviceOrientation.Portrait ? 'potraitMode' : 'landscapeMode';
      //   document.body.classList.remove(classToRemove);
      //   document.body.classList.add(classToAdd);
      // }
    });
    const orientation = window.matchMedia('(orientation: portrait)').matches ? DeviceOrientation.Portrait : DeviceOrientation.Landscape;
    if (this.getDeviceType() === DeviceType.Mobile) {
      const classToRemove = orientation === DeviceOrientation.Portrait ? 'landscapeMode' : 'potraitMode';
      const classToAdd = orientation === DeviceOrientation.Portrait ? 'potraitMode' : 'landscapeMode';
      document.body.classList.remove(classToRemove);
      document.body.classList.add(classToAdd);
    }

    return orientation;
  }

}
