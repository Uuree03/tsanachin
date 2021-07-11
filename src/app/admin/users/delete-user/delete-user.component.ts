import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { FirestoreService } from 'src/app/services/firestore.service';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.scss']
})
export class DeleteUserComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DeleteUserComponent>,
    @Inject(MAT_DIALOG_DATA) public user: User,
    private db: FirestoreService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  deleteUser() {
    this.db.delete('users/'+this.user.id).then(userRes => {
      this.openSnackBar('Хэрэглэгч устгагдлаа!');
      window.location.reload();
    });
    this.dialogRef.close();
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'OK', {
      duration: 3000,
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
