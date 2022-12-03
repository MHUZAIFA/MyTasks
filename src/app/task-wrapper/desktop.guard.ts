import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { DeviceType, SystemSettingsService } from '../auth/services/system-settings.service';

@Injectable({
  providedIn: 'root'
})
export class DesktopGuard implements CanActivate {

  constructor(private systemSettingsService: SystemSettingsService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.systemSettingsService.deviceType === DeviceType.Desktop) {
      return true;
    }

    if (this.systemSettingsService.deviceType === DeviceType.Mobile) {
      this.router.navigate([this.systemSettingsService.basePath]);
      return false;
    }

    return false;
  }

}
