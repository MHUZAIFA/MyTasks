import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { SystemSettingsService } from '../services/system-settings.service';
import {Location} from '@angular/common';


@Component({
  selector: 'app-guest-registeration-form',
  templateUrl: './guest-registeration-form.component.html',
  styleUrls: ['./guest-registeration-form.component.sass']
})
export class GuestRegisterationFormComponent implements OnInit {

  showPassword: boolean = false;
  error: string = '';
  guestForm = new FormGroup({
    displayName: new FormControl('', [Validators.required, Validators.minLength(3)]),
  });

  constructor(private _location: Location, private _authenticationService: AuthenticationService, public systemSettingsService: SystemSettingsService) { }

  ngOnInit() {  }

  signInWithGoogle() { this._authenticationService.GoogleAuth(); }
  signInWithFacebook() { this._authenticationService.FacebookAuth(); }

  back() { this._location.back(); }

  login() {
    if (this.guestForm.valid) {
      const user: {displayName: string } = Object.assign({}, this.guestForm.getRawValue());
      if (user.displayName) {
        this._authenticationService.SignInAsGuest(user.displayName);
      }
    } else if (this.guestForm.invalid) {
      this._authenticationService.InvalidInput();
    }
  }

}
