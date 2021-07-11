import { Component, OnInit, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';

import { User } from 'src/app/models/user.model';
import { FirestoreService } from 'src/app/services/firestore.service';

import { EditUserComponent } from './edit-user/edit-user.component';
import { ViewUserComponent } from './view-user/view-user.component';
import { AuthService } from 'src/app/services/auth.service';
import { DeleteUserComponent } from './delete-user/delete-user.component';
import { ChangeUserPasswordComponent } from './change-user-password/change-user-password.component';
import { ColumnDef } from 'src/app/models/table.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, AfterViewInit {
  screenHeight!: number;
  screenWidth!: number;
  columns!: string[];
  columnDefinitions!: ColumnDef[];
  dataSource = new MatTableDataSource<User>();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

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
        { def: 'nickname', hide: false},
        { def: 'lastName', hide: this.screenWidth < 500},
        { def: 'firstName',hide: this.screenWidth < 600},
        { def: 'phone', hide: this.screenWidth < 700},
        { def: 'email', hide: this.screenWidth < 800},
        { def: 'roles', hide: this.screenWidth < 300},
        { def: 'action', hide: false}
      ];
      this.getDisplayedColumns()
    }

    getDisplayedColumns() {
      this.columns = this.columnDefinitions.filter(cd=>!cd.hide).map(cd=>cd.def);
    }

  ngOnInit(): void {
    this.db.colWithId$<User>('users', ref => ref.orderBy('nickname')).subscribe((users: User[]) => {
      this.dataSource.data = users;
    });

  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  doFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  showViewDialog(id: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = id;
    dialogConfig.disableClose = false;
    dialogConfig.width = "350px";
    const modalDialog = this.matDialog.open(ViewUserComponent, dialogConfig);
  }

  showEditDialog(doc: User) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = doc;
    dialogConfig.disableClose = false;
    dialogConfig.width = "550px";
    const modalDialog = this.matDialog.open(EditUserComponent, dialogConfig);
  }

  showPasswordUpdateDialog(doc: User) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = doc;
    dialogConfig.disableClose = false;
    dialogConfig.maxWidth = "550px";
    const modalDialog = this.matDialog.open(ChangeUserPasswordComponent, dialogConfig);
  }

  showDeleteDialog(doc: User) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = doc;
    dialogConfig.disableClose = false;
    dialogConfig.id = "delete-user";
    dialogConfig.width = "350px";

    const modalDialog = this.matDialog.open(DeleteUserComponent, dialogConfig);
  }
}
