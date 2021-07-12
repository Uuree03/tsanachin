import { Component, OnInit, ViewChild, AfterViewInit, HostListener, ElementRef } from '@angular/core';
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
import { EditApplicationMemberComponent } from './edit-application-member/edit-application-member.component';
import { AddApplicationMemberComponent } from './add-application-member/add-application-member.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UploadPortraitComponent } from './upload-portrait/upload-portrait.component';
import {jsPDF} from 'jspdf';

@Component({
  selector: 'app-comp-application',
  templateUrl: './comp-application.component.html',
  styleUrls: ['./comp-application.component.scss']
})
export class CompApplicationComponent implements OnInit, AfterViewInit {
  competitionId: string;
  competition!: Competition;
  screenHeight!: number;
  screenWidth!: number;
  isMobile = false;
  columns!: string[];
  showFilter = false;
  columnDefinitions!: ColumnDef[];
  dataSource = new MatTableDataSource<CompetitionApplication>();
  user!: User;
  isAdmin = false;
  userId!: string;
  rangeFound = false;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private route: ActivatedRoute,
    public matDialog: MatDialog,
    private db: FirestoreService,
    public auth: AuthService,
    private router: Router,
    private snack: MatSnackBar
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
      { def: 'photo', hide: false},
      { def: 'registry', hide: this.screenWidth < 550},
      { def: 'lastName', hide: false},
      { def: 'firstName', hide: false},
      { def: 'age', hide: this.screenWidth < 500},
      { def: 'gender',hide: this.screenWidth < 600},
      { def: 'rank', hide: this.screenWidth < 700},
      { def: 'range', hide: this.screenWidth < 800},
      { def: 'health', hide: this.screenWidth < 900},
      { def: 'action', hide: false}
    ];
    this.getDisplayedColumns()
  }

  getDisplayedColumns() {
    this.columns = this.columnDefinitions.filter(cd=>!cd.hide).map(cd=>cd.def);
  }


  ngOnInit(): void {
    this.db.colWithId$<CompetitionApplication>('competitions/'+this.competitionId+'/application',
    ref => ref.orderBy('gender').orderBy('age')).subscribe(
      (items: CompetitionApplication[]) => {
        this.dataSource.data = items;
      }
    );
    this.db.colWithId$<Race>('competitions/'+this.competitionId+'/range').subscribe(
      (items: Race[]) => {
        if (items.length > 0) {
          this.rangeFound = true;
        }
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

  showEditDialog(doc: CompetitionApplication) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = doc;
    dialogConfig.disableClose = false;
    dialogConfig.width = (this.screenWidth > 800 ? 500 : this.screenWidth - 12) + 'px';
    this.matDialog.open(EditApplicationMemberComponent, dialogConfig);
  }

  showPortraitDialog(doc: CompetitionApplication) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = doc;
    dialogConfig.disableClose = false;
    dialogConfig.width = (this.screenWidth > 600 ? 560 : this.screenWidth - 20) + 'px';
    this.matDialog.open(UploadPortraitComponent, dialogConfig);
  }

  showAddDialog() {
    if (this.rangeFound) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = this.competitionId;
      dialogConfig.disableClose = false;
      dialogConfig.width = (this.screenWidth > 800 ? 500 : this.screenWidth - 12) + 'px';
      this.matDialog.open(AddApplicationMemberComponent, dialogConfig);
    } else {
      this.snack.open('Уралдааны ангилал оруулаагүй байна', '', {
        duration: 3000
      });
    }
  }

  public downloadAsPDF() {
    const doc = new jsPDF();

    let exportHTML = `<h1>Sample Data</h1>

    <table>
    <tr>
      <th>Company</th>
      <th>Contact</th>
      <th>Country</th>
    </tr>
    <tr>
      <td>dfadfasdfsdf</td>
      <td>Maria Anders</td>
      <td>Germany</td>
    </tr>
    <tr>
      <td>Centro comercial Moctezuma</td>
      <td>Francisco Chang</td>
      <td>Mexico</td>
    </tr>
    <tr>
      <td>Ernst Handel</td>
      <td>Roland Mendel</td>
      <td>Austria</td>
    </tr>
    <tr>
      <td>Island Trading</td>
      <td>Helen Bennett</td>
      <td>UK</td>
    </tr>
    <tr>
      <td>Laughing Bacchus Winecellars</td>
      <td>Yoshi Tannamuri</td>
      <td>Canada</td>
    </tr>
    <tr>
      <td>Magazzini Alimentari Riuniti</td>
      <td>Giovanni Rovelli</td>
      <td>Italy</td>
    </tr>`

    doc.html(exportHTML, {
      callback: function (doc) {
        doc.save();
      },
      x: 10,
      y: 10
   });

    doc.save('tableToPdf.pdf');
  }


}

