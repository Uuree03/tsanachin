import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService, NewUser } from '../auth.service';
import { FirestoreService } from 'src/app/shared/firestore.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  newUser!: NewUser;
  isAuth = false;

  constructor(
    public auth: AuthService,
    private db: FirestoreService
  ) {
    this.auth.user$.subscribe(user => {
      if(user && user.roles){
        this.isAuth = true;
      } else {
        this.isAuth = false;
      }
    });
   }

  ngOnInit(): void {

  }

  onSubmit(form: NgForm) {
    const dt = new Date();

    this.auth.createUser({
      lastName: form.value.lastName,
      firstName: form.value.firstName,
      nickname: form.value.nickname,
      phone: form.value.phone,
      position: form.value.position,
      email: form.value.email,
      roles: this.newUser.roles,
      password: form.value.password,
      hint: form.value.hint,
      registered: dt
    });

    form.resetForm();
  }

}
