import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';

import { AuthData } from './auth-data.model';
import { Roles, User } from './user.model';

export interface NewUser {
    roles: Roles;
    name: string;
    email: string;
    code: string;
    date?: Date;
    html: string;
    departmentId?: string;
    departmentName?: string;
    departmentAcronym?: string;
}

export interface RegData {
    lastName: string;
    firstName: string;
    nickname: string;
    phone: number;
    position?: string;
    email: string;
    password: string;
    roles: Roles;
    hint?: string;
    registered?: Date;
}

@Injectable()
export class AuthService {
    user$: Observable<User>;
    authChange = new Subject<boolean>();
    private isAuthenticated = false;
    public userId = '';
    public user: User | undefined;

    constructor(
        private afAuth: AngularFireAuth, 
        private afs: AngularFirestore, 
        private fns: AngularFireFunctions,
        private router: Router) {
        this.user$ = this.afAuth.authState.pipe(
            switchMap(user => {
                if(user) { 
                    this.userId = user.uid;
                    return afs.doc<User | any>(`users/${user.uid}`).snapshotChanges().pipe(map(doc => {
                        this.isAuthenticated = true;
                        this.user = {id: user.uid,
                            ...doc.payload.data()}
                        return {
                            id: user.uid,
                            ...doc.payload.data()
                        }
                    }));
                } else {
                    return of(null);
                }
            })
        )
        
    }



    
  ///// Role-based Authorization //////

  canRead(user: User): boolean {
    const allowed = ['admin', 'editor', 'subscriber']
    return this.checkAuthorization(user, allowed)
  }

  canEdit(user: User): boolean {
    const allowed = ['admin', 'editor']
    return this.checkAuthorization(user, allowed)
  }

  canDelete(user: User): boolean {
    const allowed = ['admin']
    return this.checkAuthorization(user, allowed)
  }

  canAdminister(user: User): boolean {
    const allowed = ['admin']
    return this.checkAuthorization(user, allowed)
  }

  canAssist(user: User): boolean {
    const allowed = ['assistant']
    return this.checkAuthorization(user, allowed)
  }

  canManageSupport(user: User): boolean {
    const allowed = ['supporter', 'admin']
    return this.checkAuthorization(user, allowed)
  }

  // determines if user has matching role
  private checkAuthorization(user: User, allowedRoles: string[]): boolean {
    if (!user) return false
    for (const role of allowedRoles) {
        if ( user.roles[role] ) {
            return true
        }
    }
    return false
  }

    inviteUser(newUser: NewUser) {
        const userRef = this.afs.collection('invitedUsers').doc(newUser.email);
        userRef.get()
            .subscribe(docSnapshot => {
                // console.log(docSnapshot.data());
                if (!docSnapshot.exists) {
                    this.afs.collection('invitedUsers').doc(newUser.email).set(newUser);
                } else {
                    alert('Хэрэглэгч уригдсан байна');
                }
        });
        
    }


    createUser(regData: RegData) {
        
        this.afAuth.createUserWithEmailAndPassword(regData.email, regData.password)
        .then((credential: any) => {
            if(credential){
                this.postUserProfile(credential.user.uid, regData).subscribe((result: any) => {
                    if(result) {
                        console.log('User created');
                        this.router.navigate(['']);
                    }
                });
              }
        })
        .catch(error => {
            console.log(error);
        });
    }

    postUserProfile(uid: string, profile: RegData){
        const callable = this.fns.httpsCallable('createUserProfile');
        return callable({
            uid: uid,
            ...profile
        });
    }

    login(authData: AuthData) {
        this.afAuth
        .signInWithEmailAndPassword(authData.email, authData.password)
        .then( result => {
            this.router.navigate(['']);
        })
        .catch(error => {
            console.log(error);
        });
    }

    logout() {
        this.router.navigate(['']);
        this.afAuth.signOut();
    }

    isAuth() {
        return this.isAuthenticated;
    }

    getUserId() {
        return this.userId;
    }
}