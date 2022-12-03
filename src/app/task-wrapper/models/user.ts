export class User {
  uid: string;
  emailVerified: boolean;
  email: string | null;
  displayName: string;
  photoURL: string;
  isGuest: boolean

  constructor(uid: string, emailVerified: boolean, email: string | null, displayName: string | null, photoURL: string | null, isGuest: boolean) {
    this.uid = uid;
    this.emailVerified = emailVerified;
    this.email = email;
    this.displayName = !displayName ? 'Guest' : displayName;
    this. photoURL = !photoURL ? 'assets/imgs/no_user_profile.png' : photoURL;
    this.isGuest = isGuest;
  }
}
