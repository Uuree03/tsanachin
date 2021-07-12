import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { CompetitionApplication, Race } from 'src/app/models/competion.model';
import { SportType } from 'src/app/models/sport.model';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-edit-application-member',
  templateUrl: './edit-application-member.component.html',
  styleUrls: ['./edit-application-member.component.scss']
})
export class EditApplicationMemberComponent implements OnInit {
  doc: CompetitionApplication;
  sports!: SportType[];
  startDate!: Date;
  endDate!: Date;
  range!: Race[];
  gender!: string;
  rangeTitles!: string[];
  private rangeSubs!: Subscription;

  constructor(
    public dialogRef: MatDialogRef<EditApplicationMemberComponent>,
    private db: FirestoreService,
    private snack: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public docInput: CompetitionApplication
  ) {
    this.doc = {...this.docInput};
    this.rangeSubs = this.db.colWithId$<Race>('competitions/'+this.doc.competitionId+'/range', ref => ref
    .where('gender', 'array-contains', this.doc.gender).orderBy('date').orderBy('order')).subscribe(
      (range: Race[]) => {
        this.range = range;
      }
    );
   }

  ngOnInit(): void {

  }

  onGenderSelected() {
    if (this.rangeSubs) {
      this.rangeSubs.unsubscribe();
    }
    this.rangeSubs = this.db.colWithId$<Race>('competitions/'+this.doc.competitionId+'/range', ref => ref
    .where('gender', 'array-contains', this.doc.gender).orderBy('date').orderBy('order')).subscribe(
      (range: Race[]) => {
        this.range = range;
      }
    );
  }

  onRangeSelected(event: MatSelectChange) {
    this.doc['rangeTitles'] = event.source.triggerValue.split(', ');
  }

  onSubmit(form: NgForm) {
    this.db.update('competitions/'+this.doc.competitionId+'/application/'+this.doc.id, this.doc).then(() => {
      this.snack.open('Нэмэгдлээ!', '', {
        duration: 2000
      });
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
