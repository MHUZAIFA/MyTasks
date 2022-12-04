import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SystemSettingsService } from '../auth/services/system-settings.service';

@Component({
  selector: 'app-offline',
  templateUrl: './offline.component.html',
  styleUrls: ['./offline.component.sass']
})
export class OfflineComponent implements OnInit {

  constructor(public systemSettingsService: SystemSettingsService, private router: Router) { }

  ngOnInit(): void {
    this.systemSettingsService.isOnline$().subscribe(isOnline => {
      if (isOnline) {
        if (this.systemSettingsService.isMobileDevice) {
          this.router.navigateByUrl(this.systemSettingsService.basePath);
        } else {
          this.router.navigate([this.systemSettingsService.basePath, { outlets: { sidepanel: 'default' } }]);
        }
      } else {
        this.router.navigate(['offline']);
      }
    });
  }

}
