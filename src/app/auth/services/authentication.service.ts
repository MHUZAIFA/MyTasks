import { Injectable, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { User } from 'src/app/task-wrapper/models/user';
import { SystemSettingsService, Theme } from './system-settings.service';
import { UTILITY } from 'src/app/task-wrapper/utilities/utility';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  public get loggedInUser(): User { return JSON.parse(localStorage.getItem('user') as string) as User; }

  userData: User | null = null;
  canReset: boolean = true;
  canResendVerficationEmail: boolean = false;

  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore,
    private route: ActivatedRoute,
    private router: Router, private ngZone: NgZone, private _snackbarService: SnackbarService,
    private systemSettingsService: SystemSettingsService,
  ) {
    const isGuestMode = localStorage.getItem('isGuestMode') as string;
    if (isGuestMode === null) {
      this.router.navigate(['login']);
    }

    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userData = new User(user.uid, user.emailVerified, user.email, user.displayName, user.photoURL, false, true, Theme.System);
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user') as string);
      } else {
        const user: User = JSON.parse(localStorage.getItem('user') as string) as User
        if (user) {
          this.userData = new User(user.uid, user.emailVerified, user.email, user.displayName, user.photoURL, false, user.isVibrationEnabled, user.selectedTheme);
        } else {
          localStorage.setItem('user', JSON.stringify(null));
          JSON.parse(localStorage.getItem('user') as string);
        }
      }
    });
  }

  SignInAsGuest(displayName: string) {
    let photoURL = 'assets/imgs/no_user_profile.png';
    this.userData = new User(UTILITY.GenerateUUID(), false, null, displayName.trim(), photoURL, true, true, Theme.System);
    localStorage.setItem('user', JSON.stringify(this.userData));
    this.systemSettingsService.isGuestMode = true;
    this.redirectToDashboard();
  }

  // Sign in with email/password
  SignIn(email: string, password: string) {
    // const pwd = sha512.sha512(password);
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.ngZone.run(() => {
          this._snackbarService.openSnackBar('Welcome back' + result.user?.displayName);
          this.redirectToDashboard();
        });
        if (result.user) {
          const userData = new User(result.user.uid, result.user.emailVerified, result.user.email, result.user.displayName, result.user.photoURL, false, true, Theme.System);
          this.SetUserData(userData);
        }
      }).catch((error) => {
        this._snackbarService.openSnackBar('Incorrect username or password');
      })
  }

  // Sign up with email/password
  SignUp(email: string, password: string, displayName?: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign
        up and returns promise */
        const photoURL = 'assets/imgs/no_user_profile.png';
        if (result.user) {
          result.user.updateProfile({ displayName: displayName, photoURL: photoURL }).then(_ => {
            if (result.user) {
              const userData = new User(result.user.uid, result.user.emailVerified, result.user.email, result.user.displayName, result.user.photoURL, false, true, Theme.System);
              this.SetUserData(userData);
            }
          });
        }
        this.SendVerificationMail();
      }).catch((error) => {
        this._snackbarService.openSnackBar(error.message);
        // window.alert(error.message)
      })
  }

  // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    const currentUser = this.afAuth.auth.currentUser;
    if (currentUser && this.canResendVerficationEmail) {
      return currentUser.sendEmailVerification()
        .then(() => {
          this.canResendVerficationEmail = false;
          setTimeout(() => {
            this.canResendVerficationEmail = true;
          }, 2000);
          this.router.navigate(['verify-email-address']);
        })
    }
    return null;
  }

  // Reset Forggot password
  ForgotPassword(passwordResetEmail: string) {
    if (this.canReset) {
      return this.afAuth.auth.sendPasswordResetEmail(passwordResetEmail)
        .then(() => {
          this.canReset = false;
          setTimeout(() => {
            this.canReset = true;
          }, 2000);
          // window.alert('Password reset email sent, check your inbox.');
          this._snackbarService.openSnackBar('Password reset email sent');
          this.router.navigate(['login']);
        }).catch((error) => {
          window.alert(error)
        });
    }
    return null;
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user') as string) as User;
    return (user !== null && user.emailVerified !== false) || (user !== null && user.isGuest) ? true : false;
  }

  // Sign in with Google
  GoogleAuth() {
    return this.AuthLogin(new firebase.auth.GoogleAuthProvider()).then(_ => console.log('logged in using google')).catch(error => console.error(error));
  }

  FacebookAuth() {
    return this.AuthLogin(new firebase.auth.FacebookAuthProvider());
  }

  // Auth logic to run auth providers
  AuthLogin(provider: any) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((result) => {
        if (result.user) {
          const userData = new User(result.user.uid, result.user.emailVerified, result.user.email, result.user.displayName, result.user.photoURL, false, true, Theme.System);
          this.SetUserData(userData);
        }
        this.ngZone.run(() => {
          this.redirectToDashboard();
        });
      }).catch((error) => {
        console.error(error);
      })
  }

  /* Setting up user data when sign in with username/password,
  sign up with username/password and sign in with social auth
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user: User) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      isGuest: false,
      isVibrationEnabled: user.isVibrationEnabled,
      selectedTheme: user.selectedTheme

    }
    this.systemSettingsService.isGuestMode = userData.isGuest;
    return userRef.set(userData, {
      merge: true
    })
  }

  // Sign out
  SignOut() {
    return this.afAuth.auth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['login']);
    })
  }

  guestLogout() {
    localStorage.removeItem('user');
    this.router.navigate(['login']);
  }

  RedirectIfUserIsLoggedIn() {
    if (this.isLoggedIn) {
      this.redirectToDashboard();
    }
  }

  InvalidInput() {
    this._snackbarService.openSnackBar('Enter correct details');
  }

  private redirectToDashboard() {
    if (this.systemSettingsService.isMobileDevice) {
      this.router.navigateByUrl(this.systemSettingsService.basePath);
    } else {
      const id = this.route.snapshot.params['id'];
      if (id) {
        this.router.navigate([this.systemSettingsService.basePath, { outlets: { sidepanel: id } }]);
      } else {
        this.router.navigate([this.systemSettingsService.basePath, { outlets: { sidepanel: 'default' } }]);
      }
    }
  }

}
