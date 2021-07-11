import { Component, OnInit, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user.model';
import { FirestoreService } from 'src/app/services/firestore.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ColumnDef } from 'src/app/models/table.model';
import { Competition, CompetitionApplication, Race } from 'src/app/models/competion.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AddRaceComponent } from './add-race/add-race.component';
import { EditRaceComponent } from './edit-race/edit-race.component';

@Component({
  selector: 'app-comp-range',
  templateUrl: './comp-range.component.html',
  styleUrls: ['./comp-range.component.scss']
})
export class CompRangeComponent implements OnInit, AfterViewInit {
  competitionId: string;
  competition!: Competition;
  screenHeight!: number;
  screenWidth!: number;
  isMobile = false;
  columns!: string[];
  showFilter = false;
  columnDefinitions!: ColumnDef[];
  dataSource = new MatTableDataSource<Race>();
  user!: User;
  isAdmin = false;
  userId!: string;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private route: ActivatedRoute,
    public matDialog: MatDialog,
    private db: FirestoreService,
    public auth: AuthService,
    private router: Router
    ) {
      this.competitionId = this.route.snapshot.params['competitionId'];
      this.db.doc$<Competition>('competitions/'+this.competitionId).subscribe((doc: Competition) => {
        this.competition = doc;
      });
      this.getScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    // console.log(this.screenHeight, this.screenWidth);

    this.columnDefinitions = [
      { def: 'date', hide: false},
      { def: 'title', hide: false},
      { def: 'gender', hide: this.screenWidth < 600},
      { def: 'distance', hide: this.screenWidth < 500},
      { def: 'type', hide: false},
      { def: 'action', hide: false}
    ];
    this.getDisplayedColumns()
  }

  getDisplayedColumns() {
    this.columns = this.columnDefinitions.filter(cd=>!cd.hide).map(cd=>cd.def);
  }


  ngOnInit(): void {
    this.db.colWithId$<Race>('competitions/'+this.competitionId+'/range', ref => ref
    .orderBy('date').orderBy('order')).subscribe(
      (items: Race[]) => {
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

  viewApplication(doc: Competition) {
    this.router.navigate(['competitions/'+doc.id+'/application']);
  }

  showEditDialog(doc: Competition) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = doc;
    dialogConfig.disableClose = false;
    dialogConfig.width = (this.screenWidth > 800 ? 700 : this.screenWidth - 20) + 'px';
    this.matDialog.open(EditRaceComponent, dialogConfig);
  }

  showAddDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = this.competitionId;
    dialogConfig.disableClose = false;
    dialogConfig.width = (this.screenWidth > 800 ? 500 : this.screenWidth - 12) + 'px';
    this.matDialog.open(AddRaceComponent, dialogConfig);
  }

}

