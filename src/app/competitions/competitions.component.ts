import { Component, OnInit, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.model';
import { FirestoreService } from 'src/app/services/firestore.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ColumnDef } from 'src/app/models/table.model';
import { Competition } from '../models/competion.model';
import { AddCompetitionComponent } from './add-competition/add-competition.component';
import { EditCompetitionComponent } from './edit-competition/edit-competition.component';
import { Router } from '@angular/router';
import { SportType } from '../models/sport.model';

@Component({
  selector: 'app-competitions',
  templateUrl: './competitions.component.html',
  styleUrls: ['./competitions.component.scss']
})
export class CompetitionsComponent implements OnInit, AfterViewInit {
  screenHeight!: number;
  screenWidth!: number;
  isMobile = false;
  columns!: string[];
  showFilter = false;
  columnDefinitions!: ColumnDef[];
  dataSource = new MatTableDataSource<Competition>();
  user!: User;
  isAdmin = false;
  userId!: string;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    public matDialog: MatDialog,
    private db: FirestoreService,
    public auth: AuthService,
    private router: Router
    ) {
    this.auth.user$.subscribe(user => {
      if(user) {
        this.user = user;
        if (user.id) {
          this.userId = user.id;
        }
        this.isAdmin = this.auth.canAdminister(user);
      } else {
        this.isAdmin = false;
      }
    });
    this.getScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    // console.log(this.screenHeight, this.screenWidth);

    this.columnDefinitions = [
      { def: 'name', hide: false},
      { def: 'type', hide: this.screenWidth < 500},
      { def: 'date',hide: this.screenWidth < 600},
      { def: 'place', hide: this.screenWidth < 700},
      { def: 'organizer', hide: this.screenWidth < 800},
      { def: 'medals', hide: this.screenWidth < 900},
      { def: 'action', hide: false}
    ];
    this.getDisplayedColumns()
  }

  getDisplayedColumns() {
    this.columns = this.columnDefinitions.filter(cd=>!cd.hide).map(cd=>cd.def);
  }


  ngOnInit(): void {
    this.db.colWithId$<Competition>('competitions', ref => ref.orderBy('startDate', 'desc')).subscribe(
      (items: Competition[]) => {
        this.dataSource.data = items;
      }
    );

  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  viewCompetition(doc: Competition) {
    this.router.navigate(['competitions/'+doc.id]);
  }

  viewRange(doc: Competition) {
    this.router.navigate(['competitions/'+doc.id+'/range']);
  }

  viewApplication(doc: Competition) {
    this.router.navigate(['competitions/'+doc.id+'/application']);
  }

  showEditDialog(doc: Competition) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = doc;
    dialogConfig.disableClose = false;
    dialogConfig.width = (this.screenWidth > 800 ? 700 : this.screenWidth - 20) + 'px';
    this.matDialog.open(EditCompetitionComponent, dialogConfig);
  }

  showAddDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.width = (this.screenWidth > 800 ? 500 : this.screenWidth - 12) + 'px';
    this.matDialog.open(AddCompetitionComponent, dialogConfig);
  }

}

