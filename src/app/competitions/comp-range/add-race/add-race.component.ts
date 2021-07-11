import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Race } from 'src/app/models/competion.model';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-add-race',
  templateUrl: './add-race.component.html',
  styleUrls: ['./add-race.component.scss']
})
export class AddRaceComponent implements OnInit {
  date!: Date;

  constructor(
    public dialogRef: MatDialogRef<AddRaceComponent>,
    private db: FirestoreService,
    private snack: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public competitionId: string
  ) { }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
    const newRace: Race = {
      title: form.value.title,
      date: this.date,
      order: form.value.order,
      gender: form.value.gender,
      distance: form.value.distance,
      type: form.value.type
    };
    this.db.add('competitions/'+this.competitionId+'/range', newRace).then(() => {
      this.snack.open('Нэмэгдлээ!', '', {
        duration: 2000
      });
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
