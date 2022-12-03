import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { GuestRegisterationFormComponent } from './guest-registeration-form/guest-registeration-form.component';

const firebaseConfig = {
  apiKey: "AIzaSyBSsgZJwuXxyuZKoD_ClvenCMSUiCa-ETE",
  authDomain: "ha-todo.firebaseapp.com",
  projectId: "ha-todo",
  storageBucket: "ha-todo.appspot.com",
  messagingSenderId: "367605711980",
  appId: "1:367605711980:web:7962a44fc9c8ce438c4449",
  measurementId: "G-2C8Z8N114F"
};



@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    VerifyEmailComponent,
    ResetPasswordComponent,
    GuestRegisterationFormComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule
  ]
})
export class AuthModule { }
