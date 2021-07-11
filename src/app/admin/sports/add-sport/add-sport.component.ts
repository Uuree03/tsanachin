import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SportType } from 'src/app/models/sport.model';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-add-sport',
  templateUrl: './add-sport.component.html',
  styleUrls: ['./add-sport.component.scss']
})
export class AddSportComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AddSportComponent>,
    private db: FirestoreService,
    private snack: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
    const newType: SportType = {
      type: form.value.type,
      english: form.value.english
    };
    this.db.add('sports', newType).then(() => {
      this.snack.open('Нэмэгдлээ!', '', {
        duration: 2000
      });
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
