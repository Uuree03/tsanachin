import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CompetitionApplication, Race } from 'src/app/models/competion.model';
import { SportType } from 'src/app/models/sport.model';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-add-application-member',
  templateUrl: './add-application-member.component.html',
  styleUrls: ['./add-application-member.component.scss']
})
export class AddApplicationMemberComponent implements OnInit {
  sports!: SportType[];
  startDate!: Date;
  endDate!: Date;
  range!: Race[];
  gender!: string;
  rangeTitles!: string[];

  constructor(
    public dialogRef: MatDialogRef<AddApplicationMemberComponent>,
    private db: FirestoreService,
    private snack: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public competitionId: string
  ) { }

  ngOnInit(): void {
    this.db.colWithId$<SportType>('sports', ref => ref.orderBy('gender')).subscribe((types: SportType[]) => {
      this.sports = types;
    });

  }

  onGenderSelected() {
    this.db.colWithId$<Race>('competitions/'+this.competitionId+'/range', ref => ref
    .where('gender', 'array-contains', this.gender).orderBy('date').orderBy('order')).subscribe(
      (range: Race[]) => {
        this.range = range;
      }
    );
  }

  onRangeSelected(event: MatSelectChange) {
    this.rangeTitles = event.source.triggerValue.split(', ')
    console.log(this.rangeTitles);
  }

  onSubmit(form: NgForm) {
    const newMember: CompetitionApplication = {
      competitionId: this.competitionId,
      registry: form.value.registry,
      lastName: form.value.lastName,
      firstName: form.value.firstName,
      age: form.value.age,
      gender: form.value.gender,
      rank: form.value.rank,
      range: form.value.range,
      rangeTitles: this.rangeTitles,
      health: form.value.health
    };
    this.db.add('competitions/'+this.competitionId+'/application', newMember).then(() => {
      this.snack.open('Нэмэгдлээ!', '', {
        duration: 2000
      });
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
