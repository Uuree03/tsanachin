import { Component, OnInit, OnDestroy } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { NgForm } from '@angular/forms';


import { AuthService, NewUser } from '../auth.service';
import { Subscription } from 'rxjs';
import { FirestoreService } from 'src/app/shared/firestore.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  newUser!: NewUser;
  userEmail = '';
  invitedUsersSubscription!: Subscription;
  invitationId: string;
  linkFound = false;
  public userAuth: Subscription;
  isAuth = false;

  constructor(
    route: ActivatedRoute,
    public auth: AuthService, 
    private db: FirestoreService
  ) { 
    this.invitationId = route.snapshot.params['invitationId'];
    this.userAuth = this.auth.user$.subscribe(user => {
      if(user && user.roles){
        this.isAuth = true;
      } else {
        this.isAuth = false;
      }
    });
   }

  ngOnInit(): void {
    this.invitedUsersSubscription = this.db.doc$('invitedUsers/'+this.invitationId)
    .subscribe((doc: NewUser | any) => {
      this.newUser = doc;
      if(doc) {
        console.log('invitation found!');
        this.linkFound = true
        this.userEmail = doc.email;
      } else {
        this.linkFound = false;
        this.userEmail = '';
      }
    });
  }

  onSubmit(form: NgForm) {
    const dt = new Date();

    this.auth.createUser({
      lastName: form.value.lastName,
      firstName: form.value.firstName,
      nickname: form.value.nickname,
      phone: form.value.phone,
      position: form.value.position,
      email: this.userEmail,
      roles: this.newUser.roles,
      password: form.value.password,
      hint: form.value.hint,
      registered: dt
    });

    form.resetForm();
  }

  ngOnDestroy() {
    this.invitedUsersSubscription.unsubscribe();
  }

}
