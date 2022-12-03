import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { SystemSettingsService } from '../services/system-settings.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})
export class RegisterComponent implements OnInit {

  showPassword: boolean = false;
  error: string = '';

  registerFormGroup: FormGroup = this._formBuilder.group({
    displayName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  constructor(public systemSettingsService: SystemSettingsService, private _formBuilder: FormBuilder, private _location: Location, private _authService: AuthenticationService) {}

  ngOnInit() { this._authService.RedirectIfUserIsLoggedIn(); }
  back() { this._location.back(); }
  signInWithGoogle() { this._authService.GoogleAuth(); }
  signInWithFacebook() { this._authService.FacebookAuth(); }
  register() {
    if (this.registerFormGroup.valid) {
      const user: {email: string, password: string, displayName: string} = Object.assign({}, this.registerFormGroup.getRawValue());
      if (user.email && user.password && user.displayName) {
        this._authService.SignUp(user.email, user.password, user.displayName);
      }
    } else if (this.registerFormGroup.invalid) {
      this._authService.InvalidInput();
    }
  }

}
