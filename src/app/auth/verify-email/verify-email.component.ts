import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/task-wrapper/models/user';
import { AuthenticationService } from '../services/authentication.service';
import { SystemSettingsService } from '../services/system-settings.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.sass']
})
export class VerifyEmailComponent implements OnInit {

  public get canResendVerficationEmail(): boolean { return this.m_authService.canResendVerficationEmail; }
  public get user(): User { return this.m_authService.userData as User; }

  constructor(public systemSettingsService: SystemSettingsService, private m_authService: AuthenticationService, private _location: Location) { }

  ngOnInit(): void {
  }

  back() { this._location.back(); }

  resendVerificationEmail() {
    this.m_authService.SendVerificationMail();
  }

}
