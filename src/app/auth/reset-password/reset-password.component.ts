import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { SystemSettingsService } from '../services/system-settings.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.sass']
})
export class ResetPasswordComponent implements OnInit {

  public get canReset(): boolean { return this.m_authService.canReset; }

  resetForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  constructor(public systemSettingsService: SystemSettingsService, private _location: Location, private m_authService: AuthenticationService) { }

  ngOnInit(): void {
  }

  back() { this._location.back(); }

  resetPassword() {
    const email = this.resetForm.get('email');
    if (email) {
      this.m_authService.ForgotPassword(email.value)
    }
  }

}
