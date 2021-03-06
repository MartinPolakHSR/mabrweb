import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { User } from '../user';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  usersCollection: AngularFirestoreCollection<User>;
  users: Observable<User[]>;
  userDoc: AngularFirestoreDocument<User>;

  constructor(public  afs: AngularFirestore,
              private afAuth: AngularFireAuth,
  ) {
    // this.users = this.afs.collection('users').valueChanges();
    this.usersCollection = this.afs.collection('users', ref => ref.orderBy('email', 'asc'));

    this.users = this.usersCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as User;
        const id = a.payload.doc.id;
        return {id, ...data};
      }))
    );

  }

  getUsers() {
    return this.users;
  }

  getUser(id) {
    this.userDoc = this.afs.doc(`users/${id}`);
    return this.userDoc.valueChanges();
  }

  getCurrentUser() {
    // https://firebase.google.com/docs/auth/web/manage-users

    // return firebase.auth().currentUser;

    const user = firebase.auth().currentUser;
    if (user) {  // User signed in
      return user;
    } else { // no user is signed in
      return 0;
    }

    /*
    const user = firebase.auth().currentUser;
    if (user) {  // User signed in
      this.userService.getUser(firebase.auth().currentUser.uid).subscribe( currentUser => {
        console.log('cur: ', currentUser);
        return currentUser;
      });
    } else { // no user is signed in
      return 0;
    }
    */

  }

  get authenticated(): boolean {
    return this.afAuth.authState !== null;
  }

  getCurrentUserId(): string {
    return firebase.auth().currentUser.uid;
    // this.myForm.patchValue({'userId': this.userId});
  }

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get
  get currentUserId(): any {
    return this.authenticated ? this.afAuth.auth.currentUser.uid : null;
  }

  addUser(user: User) {
    return this.usersCollection.add(user);  // need return for async logout call in register process!
  }

  setUser(user: User) {
    this.userDoc = this.afs.doc(`users/${user.id}`);
    return this.userDoc.set(user, {merge: true});
  }

  updateUser(user: User) {
    this.userDoc = this.afs.doc(`users/${user.id}`);
    this.userDoc.update(user);

  }

  deleteUser(user: User) {
    this.userDoc = this.afs.doc(`users/${user.id}`);
    this.userDoc.delete();
  }


  /*
  setUserMerge(user: User) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.id}`);
    const data: User = {
      downloadUrl: 'xxx',
      area: 'luzernXXX'
    };
    return userRef.set(data, {merge: true});
  }
  */

  /*
  // Test, geht irgendwie noch nicht sauber!
  loginStatus(): any {
    // return 123;
    return this.authenticated ? true : 0;
  }
  */


  // LocalStorage Functions start
  setUserToLocalStorage(userFromDatabase) {
    localStorage.setItem('user', JSON.stringify(userFromDatabase));
  }

  getProfileFromLocalStorage() {
    return JSON.parse(localStorage.getItem('user')) || [];
  }

  destroyUserLocalStorage() {
    localStorage.removeItem('user');
  }

  // LocalStorage Function end

}
