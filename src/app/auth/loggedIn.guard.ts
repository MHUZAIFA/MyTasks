import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './services/authentication.service';
import { DeviceType, SystemSettingsService } from './services/system-settings.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard implements CanActivate {

  constructor(private authService: AuthenticationService, private systemSettingsService: SystemSettingsService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.systemSettingsService.isRegistrationMode) {
      return true;
    }

      if (this.authService.isLoggedIn) {
      if (this.systemSettingsService.deviceType === DeviceType.Desktop) {
        const id = route.paramMap.get('id');
        if (id) {
          this.router.navigate([this.systemSettingsService.basePath, { outlets: { sidepanel: id } }]);
        } else {
          this.router.navigate([this.systemSettingsService.basePath, { outlets: { sidepanel: 'default' } }]);
        }
        return false;
      }
      if (this.systemSettingsService.deviceType === DeviceType.Mobile) {
        this.router.navigate([this.systemSettingsService.basePath]);
        return false;
      }
    }
    return true;
  }

}
