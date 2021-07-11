import { Component, OnInit, HostListener } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';

import { FirestoreService } from 'src/app/services/firestore.service';
import { AuthService } from 'src/app/services/auth.service';
import { ColumnDef } from 'src/app/models/table.model';
import { AddSportComponent } from './add-sport/add-sport.component';
import { SportType } from 'src/app/models/sport.model';

@Component({
  selector: 'app-sports',
  templateUrl: './sports.component.html',
  styleUrls: ['./sports.component.scss']
})
export class SportsComponent implements OnInit {
  screenHeight!: number;
  screenWidth!: number;
  columns!: string[];
  columnDefinitions!: ColumnDef[];
  dataSource = new MatTableDataSource<SportType>();


  constructor(
    public matDialog: MatDialog,
    public db: FirestoreService,
    public auth: AuthService
    ) {
      this.getScreenSize();
    }

    @HostListener('window:resize', ['$event'])
    getScreenSize() {
      this.screenHeight = window.innerHeight;
      this.screenWidth = window.innerWidth;
      // console.log(this.screenHeight, this.screenWidth);

      this.columnDefinitions = [
        { def: 'icon', hide: this.screenWidth < 300},
        { def: 'type', hide: false},
        { def: 'english', hide: this.screenWidth < 500},
        { def: 'image',hide: this.screenWidth < 600},
        { def: 'action', hide: false}
      ];
      this.getDisplayedColumns()
    }

    getDisplayedColumns() {
      this.columns = this.columnDefinitions.filter(cd=>!cd.hide).map(cd=>cd.def);
    }

  ngOnInit(): void {
    this.db.colWithId$<SportType>('sports', ref => ref.orderBy('type')).subscribe((types: SportType[]) => {
      this.dataSource.data = types;
    });

  }

  showAddDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.maxWidth = "600px";
    this.matDialog.open(AddSportComponent, dialogConfig);
  }
}
