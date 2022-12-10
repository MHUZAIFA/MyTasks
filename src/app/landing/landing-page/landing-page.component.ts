import { Component, OnInit } from '@angular/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faFacebookF, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { SystemSettingsService } from 'src/app/auth/services/system-settings.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.sass']
})
export class LandingPageComponent implements OnInit {

  facebook = faFacebookF as IconProp;
  instagram = faInstagram as IconProp;
  twitter = faTwitter as IconProp;

  constructor(public systemSettingsService: SystemSettingsService) { }

  ngOnInit(): void {
    localStorage.clear();
  }

}
