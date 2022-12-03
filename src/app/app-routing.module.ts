import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { GuestRegisterationFormComponent } from './auth/guest-registeration-form/guest-registeration-form.component';
import { LoggedInGuard } from './auth/loggedIn.guard';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { VerifyEmailComponent } from './auth/verify-email/verify-email.component';
import { LandingPageComponent } from './landing/landing-page/landing-page.component';
import { OfflineComponent } from './offline/offline.component';
import { SettingsComponent } from './settings/settings.component';
import { DashboardComponent } from './task-wrapper/dashboard/dashboard.component';
import { DesktopGuard } from './task-wrapper/desktop.guard';
import { MobileGuard } from './task-wrapper/mobile.guard';
import { SidepanelDeactivateGuard } from './task-wrapper/task-details/sidepanel-deactivate.guard';
import { TaskDetailsDefaultComponent } from './task-wrapper/task-details/task-details-default/task-details-default.component';
import { TaskDetailsComponent } from './task-wrapper/task-details/task-details.component';
import { TaskSearchComponent } from './task-wrapper/task-search/task-search.component';
import { TaskWrapperComponent } from './task-wrapper/task-wrapper.component';

const routes: Routes = [
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  { path: 'welcome', component: LandingPageComponent, canActivate: [LoggedInGuard] },
  { path: 'guest-signup', component: GuestRegisterationFormComponent, canActivate: [LoggedInGuard] },
  { path: 'login', component: LoginComponent, canActivate: [LoggedInGuard] },
  { path: 'reset-password', component: ResetPasswordComponent, canActivate: [LoggedInGuard] },
  { path: 'verify-email-address', component: VerifyEmailComponent, canActivate: [LoggedInGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [LoggedInGuard] },
  {
    path: 'tasks', component: TaskWrapperComponent, children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard', component: DashboardComponent, children: [
          { path: 'settings', component: SettingsComponent, outlet: 'sidepanel', canActivate: [AuthGuard, DesktopGuard] },
          { path: 'default', component: TaskDetailsDefaultComponent, outlet: 'sidepanel', canDeactivate: [SidepanelDeactivateGuard], canActivate: [AuthGuard, DesktopGuard] },
          { path: ':id', component: TaskDetailsComponent, outlet: 'sidepanel', canDeactivate: [SidepanelDeactivateGuard], canActivate: [AuthGuard, DesktopGuard] }
        ]
      },
      { path: 'search', component: TaskSearchComponent, canActivate: [AuthGuard, MobileGuard] },
      { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard, MobileGuard] },
      { path: ':id', component: TaskDetailsComponent, canActivate: [AuthGuard, MobileGuard] }
    ]
  },
  { path: 'offline', component: OfflineComponent },
  { path: '**', redirectTo: 'welcome', pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
