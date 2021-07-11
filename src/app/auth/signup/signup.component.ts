import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { NewUser, RegData } from 'src/app/models/user.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  invitationId: string;
  newUser!: NewUser;
  userEmail = '';
  linkFound = false;
  isAuth = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public auth: AuthService,
    private db: FirestoreService
  ) {
    this.invitationId = route.snapshot.params['invitationId'];
    this.auth.user$.subscribe(user => {
      if(user && user.roles){
        this.isAuth = true;
      } else {
        this.isAuth = false;
      }
    });
   }

  ngOnInit(): void {
    this.db.doc$<NewUser>('invitedUsers/'+this.invitationId)
    .subscribe((doc: NewUser) => {
      this.newUser = doc;
      if(doc) {
        // console.log('invitation found!');
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

    const newReg: RegData = {
      invitationId: this.invitationId,
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
    };
    this.auth.createUser(newReg);
    setTimeout(()=>{
      this.router.navigate(['']);
    }, 1000);
  }

}
