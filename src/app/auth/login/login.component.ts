import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { AuthenticationService } from '../services/authentication.service';
import { SystemSettingsService } from '../services/system-settings.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  showPassword: boolean = false;
  error: string = '';
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  constructor(public systemSettingsService: SystemSettingsService, private _location: Location, private _authenticationService: AuthenticationService, public _systemSettingsService: SystemSettingsService) { }

  ngOnInit() {  }

  signInWithGoogle() { this._authenticationService.GoogleAuth(); }
  signInWithFacebook() { this._authenticationService.FacebookAuth(); }

  back() { this._location.back(); }

  login() {
    if (this.loginForm.valid) {
      const user: { email: string, password: string } = Object.assign({}, this.loginForm.getRawValue());
      if (user.email && user.password) {
        this._authenticationService.SignIn(user.email, user.password);
      }
    } else if (this.loginForm.invalid) {
      this._authenticationService.InvalidInput();
    }
  }

}
