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
import { BinaryFontsService } from 'src/app/services/binary-fonts.service';

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
    private snack: MatSnackBar,
    private fonts: BinaryFontsService
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
    var gap = 5;
    var cardX = 20;
    var cardY = 23+gap, x, y, s = 4.5, row = 0;
    var cardH = 40;

    const myFont = this.fonts.arial;

    doc.addFileToVFS("Arial.ttf", myFont);
    doc.addFont("Arial.ttf", "Arial", "normal");
    doc.setFont("Arial");

    doc.setFontSize(12);
    doc.text('Цаначин клубын тамирчдын мэдүүлэг', 105, 15, { align: 'center'});
    doc.setFontSize(10);
    const title = this.competition.dateRange + ' | ' + this.competition.place + ' | ' + this.competition.shortName
    doc.text(title, 105, 20, { align: 'center'});
    doc.line(20, 23, 190, 23);


    this.dataSource.data.forEach( (profile, index) => {
      let n = index+1;
      let isOdd = n % 2 == 1 ? true : false;
      if (isOdd) {
        cardX = 20;
        cardY = 23+gap+(cardH+gap)*row;
        row ++;
      } else {
        cardX = 115;
      }
      // console.log(row, cardX, cardY, profile.firstName);
      let photoURL = profile.photoURL ? profile.lastName.substring(0, 1)+'.'+profile.firstName : 'portrait_holder';
      // console.log(photoURL);
      doc.addImage('assets/'+photoURL+'.jpg', 'JPEG', cardX, cardY, cardH/4*3, cardH);
      doc.setFontSize(9);
      doc.setTextColor(100);
      x = cardX+56;
      y = cardY+3;
      doc.text('Регистр:', x, y, { align: 'right'});
      doc.text('Овог:', x, y+s, { align: 'right'});
      doc.text('Нэр:', x, y+s*2, { align: 'right'});
      doc.text('Нас:', x, y+s*3, { align: 'right'});
      doc.text('Хүйс:', x, y+s*4, { align: 'right'});
      doc.text('Цол, зэрэг:', x, y+s*5, { align: 'right'});
      doc.text('Ангилал:', x, y+s*6, { align: 'right'});
      doc.text('Эрүүл мэнд:', x, y+s*8, { align: 'right'});

      doc.setFontSize(10);
      doc.setTextColor(0);
      x = cardX+58;
      doc.text(profile.registry, x, y);
      doc.text(profile.lastName, x, y+s);
      doc.text(profile.firstName, x, y+s*2);
      doc.text(profile.age.toString(), x, y+s*3);
      doc.text(profile.gender == 'Эм' ? 'Эмэгтэй' : 'Эрэгтэй', x, y+s*4);
      doc.text(profile.rank, x, y+s*5);
      doc.text(profile.rangeTitles.join(', '), x, y+s*6, { maxWidth: 25});
      doc.text(profile.health, x, y+s*8);
    });

    doc.save('application.pdf');
  }


}

