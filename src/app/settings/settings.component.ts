import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../auth/services/authentication.service';
import { SystemSettingsService, Theme } from '../auth/services/system-settings.service';
import { TaskListService } from '../services/task-list.service';
import { User } from '../task-wrapper/models/user';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.sass']
})
export class SettingsComponent {

  public get user(): User | null { return this.authService.loggedInUser; }
  themes: Theme[] = [Theme.System, Theme.Light, Theme.Dark];
  theme: Theme = Theme.System;
  color: ThemePalette = 'primary';
  get isDisabled(): boolean { return this.systemSettingsService.isOfflineMode; }
  get disclaimerText(): string {
    let text: string = '';
    if (this.systemSettingsService.isGuestMode) {
      text = 'Sign in to sync data to cloud. Logging out will delete your data.'
    } else if (this.systemSettingsService.isOfflineMode) {
      text = 'Connect to the internet to sync your data or to logout.'
    }
    return text;
  }

  constructor(public systemSettingsService: SystemSettingsService, private router: Router, private authService: AuthenticationService, private m_taskListService: TaskListService) { }

  logout() {
    if (!this.systemSettingsService.isOfflineMode) {
      this.authService.SignOut();
    }
  }

  sync() {
    this.m_taskListService.reload();
  }

  close() {
    if (this.systemSettingsService.isMobileDevice) {
      this.router.navigate([this.systemSettingsService.basePath]);
    } else {
      this.router.navigateByUrl(this.systemSettingsService.basePath + '/(sidepanel:default)');
    }
  }

  registerGuest() {
    console.log('Register guest workflow is under construction');
  }

  guestLogout() {
    this.authService.guestLogout();
  }

}
