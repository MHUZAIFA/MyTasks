import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/auth/services/authentication.service';
import { SystemSettingsService } from 'src/app/auth/services/system-settings.service';
import { User } from '../models/user';

@Component({
  selector: 'app-greeting',
  templateUrl: './greeting.component.html',
  styleUrls: ['./greeting.component.sass']
})
export class GreetingComponent implements OnInit {

  get user(): User | null { return this.m_authService.loggedInUser; }

  get greeting(): string {
    var today = new Date()
    var curHr = today.getHours()
    if (curHr < 12) {
      return 'Good morning';
    } else if (curHr < 18) {
      return 'Good afternoon';
    } else {
      return 'Good evening';
    }
  }

  constructor(private systemSettingsService: SystemSettingsService, private m_authService: AuthenticationService, private router: Router) { }

  ngOnInit(): void { }

  settings() {
    if (this.systemSettingsService.isMobileDevice) {
      this.router.navigate([this.systemSettingsService.basePath + '/settings']);
    } else {
      this.router.navigate([this.systemSettingsService.basePath, {outlets: { sidepanel: 'settings' } } ]);
    }
  }

}
