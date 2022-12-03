import { Injectable } from '@angular/core';
import { SystemSettingsService } from '../auth/services/system-settings.service';

@Injectable({
  providedIn: 'root'
})
export class VibrationService {

  constructor(private _systemsettingService: SystemSettingsService) { }

  vibrateOnce(duration: VibratePattern = 500) {
    if (this._systemsettingService.isVibrationOn) {
      navigator.vibrate(duration);
    }
  }

  vibrateinPattern(pattern: VibratePattern = [200, 100, 200, 100, 500]) {
    if (this._systemsettingService.isVibrationOn) {
      navigator.vibrate(pattern);
    }
  }
}
