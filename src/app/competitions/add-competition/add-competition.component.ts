import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Competition } from 'src/app/models/competion.model';
import { SportType } from 'src/app/models/sport.model';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-add-competition',
  templateUrl: './add-competition.component.html',
  styleUrls: ['./add-competition.component.scss']
})
export class AddCompetitionComponent implements OnInit {
  sports!: SportType[];
  startDate!: Date;
  endDate!: Date;
  dateRange!: string;

  constructor(
    public dialogRef: MatDialogRef<AddCompetitionComponent>,
    private db: FirestoreService,
    private snack: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.db.colWithId$<SportType>('sports', ref => ref.orderBy('type')).subscribe((types: SportType[]) => {
      this.sports = types;
    });
  }

  onDateSelected() {

  }

  onSubmit(form: NgForm) {
    const newCompetition: Competition = {
      name: form.value.name,
      shortName: form.value.shortName,
      typeId: form.value.typeId,
      type: this.sports.find(s => s.id == form.value.typeId)!.type,
      startDate: this.startDate,
      endDate: this.endDate,
      dateRange: this.dateRange,
      place: form.value.place,
      organizer: form.value.organizer,
      isJunior: form.value.isJunior ? true : false,
      status: form.value.status
    };
    this.db.add('competitions', newCompetition).then(() => {
      this.snack.open('Нэмэгдлээ!', '', {
        duration: 2000
      });
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
