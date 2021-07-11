import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { take } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

import { FirestoreService } from 'src/app/services/firestore.service';
import { NewUser } from 'src/app/models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  admin = false;
  editor = false;
  subscriber = true;


  constructor(private db: FirestoreService,
    private snack: MatSnackBar) { }

  ngOnInit(): void {

  }

  onSubmit(form: NgForm) {

    // Check if email is not already invited and user created

    this.db.colWithId$('invitedUsers', ref => ref.where('email', '==', form.value.email)).pipe(
      take(1)).subscribe((doc: any[]) => {
      if(!doc.length) {
        // Not invited yet
        this.db.colWithId$('users', ref => ref.where('email', '==', form.value.email)).pipe(
          take(1)).subscribe((users: any[]) => {
          if(!users.length){
            // No user exist with same
            let newInvitation: NewUser = {
              name: form.value.name,
              email: form.value.email,
              roles: {
                admin: this.admin,
                editor: this.editor,
                subscriber: this.subscriber
              }
            };
            this.db.add('invitedUsers', newInvitation).then(() => {
              form.resetForm({
                adminCheck: false,
                editorCheck: false,
                subscriberCheck: true});
            });
          } else {
            // Notify that user already exists
        this.showMessage('Уг хэрэглэгч бүртгэгдсэн байна');
          }
        })
      } else {
        // Notify that user already invited
        this.showMessage('Уг хэрэглэгчид урилга илгээсэн байна');
      }
    })

  }

  showMessage(message: string) {
    this.snack.open(message, 'OK', {
      duration: 3000,
    });
  }

}
