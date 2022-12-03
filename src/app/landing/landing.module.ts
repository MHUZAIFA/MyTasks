import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    LandingPageComponent
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    FontAwesomeModule
  ]
})
export class LandingModule { }
