import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';

import { AuthData } from '../models/auth-data.model';
import { NewUser, RegData, Roles, User } from '../models/user.model';
import { CloudService } from './cloud.service';

@Injectable()
export class AuthService {
    user$: Observable<User>;
    authChange = new Subject<boolean>();
    public isAuth = false;
    public userId = '';
    public username = '';
    public user: User | undefined;
    public isAdmin = false;
    public isLocalUser = false;

    constructor(
        private afAuth: AngularFireAuth,
        private afs: AngularFirestore,
        private fns: AngularFireFunctions,
        private router: Router,
        private cloud: CloudService,
        private ngZone: NgZone
        ) {
        this.user$ = this.afAuth.authState.pipe(
            switchMap(user => {
                if(user) {
                    this.userId = user.uid;
                    return afs.doc<User | any>(`users/${user.uid}`).snapshotChanges().pipe(map(doc => {
                      this.isAuth = true;
                      // console.log(doc.payload.data());
                      if(doc.payload.exists) {
                        var profile: User = doc.payload.data();
                        this.username = profile.nickname;
                        if (profile.roles) {
                          this.isAdmin = profile.roles.admin ? true : false;
                          this.isLocalUser = profile.roles.localUser ? true : false;
                        }
                          this.user = {id: user.uid,
                              ...doc.payload.data()}
                          return {
                              id: user.uid,
                              ...doc.payload.data()
                          }
                      } else {
                        return of(null);
                      }
                    }));
                } else {
                  this.disableAllRoles();
                    return of(null);
                }
            })
        )

    }

    disableAllRoles(){
      this.isAuth = false;
      this.isAdmin = false;
      this.isLocalUser = false;
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


  createUser(regData: RegData) {
    this.afAuth.setPersistence('session').then(_ => {
      this.afAuth.createUserWithEmailAndPassword(regData.email, regData.password)
      .then((credential) => {
        if(credential && credential.user){
          regData['id'] = credential.user.uid;
          this.cloud.createUserProfile(regData).subscribe( res => this.ngZone.run(() => {
            console.log(res);
            window.location.reload();
          }));
        }
      })
      .catch(error => {
          console.log(error);
      });
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

    getUserId() {
        return this.userId;
    }
}
