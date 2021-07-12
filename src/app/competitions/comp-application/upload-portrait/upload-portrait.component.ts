import { Component, Inject, OnInit, ElementRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { finalize, map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as firebase from 'firebase/app';

import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { CompetitionApplication } from 'src/app/models/competion.model';

@Component({
  selector: 'app-upload-portrait',
  templateUrl: './upload-portrait.component.html',
  styleUrls: ['./upload-portrait.component.scss']
})
export class UploadPortraitComponent implements OnInit {
  @ViewChild('fileInput') inputFile!: ElementRef;
  user!: User;
  imageURL!: string;
  ref!: AngularFireStorageReference;
  task!: AngularFireUploadTask;
  uploadProgress!: Observable<any>;
  downloadURL!: Observable<string> | string;
  uploadState!: Observable<string>;
  fb!: string;
  fileName!: string;

  constructor(
    public dialogRef: MatDialogRef<UploadPortraitComponent>,
    private auth: AuthService,
    private db: FirestoreService,
    private afStorage: AngularFireStorage,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public doc: CompetitionApplication
  ) {
    this.auth.user$.subscribe(user => {
      if(user) {
        this.user = user;
      }
    });
  }

  ngOnInit(): void {
  }

  onFileChange(event: any) {
    var fileTypes = ['jpg', 'jpeg', 'png'];
    const file = event.target.files[0];
    this.fileName = file.name;
    var extension = file.name.split('.').pop().toLowerCase(),  //file extension from input file
        isSuccess = fileTypes.indexOf(extension) > -1;

    if (isSuccess) {
      const fileSize  = Math.round(event.target.files[0].size/1024 * 100) / 100;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          const height = img.naturalHeight;
          const width = img.naturalWidth;
          // console.log('Width and Height', width, height);
          if (width > height) {
            this.openSnackBar('Зураг босоо байх ёстой', '');
            this.cleanFileInput();
          } else {
            if (fileSize > 512) {
              this.openSnackBar('Файлын хэмжээ 512 килобайтаас том байна', '');
              this.cleanFileInput();
            } else if (fileSize < 50) {
              this.openSnackBar('Файлын хэмжээ 50 килобайтаас бага байна', '');
              this.cleanFileInput();
            } else {
              // create a reference to the storage bucket location
              this.ref = this.afStorage.ref('/portraits/' + this.doc.id);
              // the put method creates an AngularFireUploadTask
              // and kicks off the upload
              this.task = this.ref.put(event.target.files[0]);

              // AngularFireUploadTask provides observable
              // to get uploadProgress value
              this.uploadProgress = this.task.snapshotChanges()
              .pipe(map((s: any) => (s.bytesTransferred / s.totalBytes) * 100));

              // observe upload progress
              this.uploadProgress = this.task.percentageChanges();
              // get notified when the download URL is available
              this.task.snapshotChanges().pipe(
                finalize(() => {
                  this.downloadURL = this.ref.getDownloadURL();
                  this.downloadURL.subscribe(url => {
                    if (url) {
                      this.fb = url;
                    }
                    // console.log(this.fb);
                    this.imageURL = url;
                  });
                })
              )
              .subscribe(url => {
                if(url) {
                  // console.log(url);
                }
              });
              this.uploadState = this.task.snapshotChanges().pipe(map((s: any) => s.state));
            }
          }
        }
      }
    } else {
      this.openSnackBar('Зургийн файл биш байна', '');
      this.cleanFileInput();
    }

  }

  cleanFileInput() {
    this.imageURL = '';
    this.inputFile.nativeElement.value = "";
    this.fileName = '';
  }

  onSubmit(form: NgForm) {
    var updateObj: any = {
      uploadedBy: this.user.nickname,
      uploadedId: this.user.id,
      uploadedAt: new Date(),
      photoURL: this.imageURL
    };
    this.db.update('competitions/'+this.doc.competitionId+'/application/'+this.doc.id, updateObj).then(res => {
      this.dialogRef.close();
      this.openSnackBar('Зураг хадгалагдлаа!', '');
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
