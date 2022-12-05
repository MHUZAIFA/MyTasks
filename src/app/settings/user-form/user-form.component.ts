import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { finalize, Observable, of } from 'rxjs';
import { AuthenticationService } from 'src/app/auth/services/authentication.service';
import { SystemSettingsService } from 'src/app/auth/services/system-settings.service';
import { User } from 'src/app/task-wrapper/models/user';
import { AngularFireStorage } from "@angular/fire/storage";
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.sass']
})
export class UserFormComponent implements OnInit {

  private m_canChangeImage: boolean = true;
  private m_isProfileImageUpdate: boolean = false;
  defaultPhotoURL: string = 'assets/imgs/no_user_profile.png';

  user: User;
  displayName: string;
  photoURL: string;
  downloadURL: Observable<string> = of('');

  get isDefaultPhotoURL(): boolean { return this.photoURL === this.defaultPhotoURL; }
  get canChangeImage(): boolean { return this.m_canChangeImage; }
  get canSave(): boolean { return (this.displayName.trim() !== this.user.displayName && this.displayName.trim().length !== 0) || this.m_isProfileImageUpdate }

  constructor(
    private m_authService: AuthenticationService,
    private m_storage: AngularFireStorage,
    private m_snackbarService: SnackbarService,
    public systemSettingsService: SystemSettingsService,
    public dialogRef: MatDialogRef<UserFormComponent>) {
    this.user = m_authService.loggedInUser;
    this.displayName = this.user.displayName.toString();
    this.photoURL = this.user.photoURL;
  }

  ngOnInit(): void {
    this.m_isProfileImageUpdate = false;
  }

  update() {
    this.m_authService.SetUserData(this.user).then(() => {
      this.m_snackbarService.openSnackBar('Profile details updated successfully!');
      this.dialogRef.close()
    });
  }

  remove() {
    this.user.photoURL = this.defaultPhotoURL;
  }

  onFileChanged(event: any) {
    const files = event.target.files;
    if (files.length === 0) return;

    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      alert('Only images are supported.');
      return;
    }

    const file = event.target.files[0];
    const filePath = `/images/${this.user.uid}`;
    const fileRef = this.m_storage.ref(filePath);
    const task = fileRef.put(file);
    task.snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe(url => {
            this.user.photoURL = url;
            this.m_isProfileImageUpdate = true;
            console.log(this.user)
          });
        })
      ).subscribe();
  }

}
