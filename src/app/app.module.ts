import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireFunctionsModule } from '@angular/fire/functions';
import { MaterialModule } from './material.module';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AuthService } from './auth/auth.service';
import { AdminGuard } from './auth/admin.guard';
import { EditorGuard } from './auth/editor.guard';

import { WelcomeComponent } from './welcome/welcome.component';
import { HeaderComponent } from './navigation/header/header.component';
import { SidenavListComponent } from './navigation/sidenav-list/sidenav-list.component';
import { RegisterComponent } from './auth/register/register.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { WorkoutsComponent } from './workouts/workouts.component';
import { LessonsComponent } from './lessons/lessons.component';
import { ContactComponent } from './contact/contact.component';
import { ClubComponent } from './club/club.component';
import { UsComponent } from './club/us/us.component';
import { MembersComponent } from './club/members/members.component';
import { RulesComponent } from './club/rules/rules.component';
import { CollaborationComponent } from './club/collaboration/collaboration.component';
import { UserComponent } from './user/user.component';
import { UserInfoComponent } from './user/user-info/user-info.component';
import { UserWorkoutsComponent } from './user/user-workouts/user-workouts.component';
import { UserMeasuresComponent } from './user/user-measures/user-measures.component';
import { UserProgressComponent } from './user/user-progress/user-progress.component';



@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    HeaderComponent,
    SidenavListComponent,
    RegisterComponent,
    SignupComponent,
    LoginComponent,
    WorkoutsComponent,
    LessonsComponent,
    ContactComponent,
    ClubComponent,
    UsComponent,
    MembersComponent,
    RulesComponent,
    CollaborationComponent,
    UserComponent,
    UserInfoComponent,
    UserWorkoutsComponent,
    UserMeasuresComponent,
    UserProgressComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireFunctionsModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    AuthService, 
    AdminGuard, 
    EditorGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
