import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WelcomeComponent } from './welcome/welcome.component';
import { RegisterComponent } from './auth/register/register.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { WorkoutsComponent } from './workouts/workouts.component';
import { LessonsComponent } from './lessons/lessons.component';
import { ContactComponent } from './contact/contact.component';
import { UsComponent } from './club/us/us.component';
import { MembersComponent } from './club/members/members.component';
import { RulesComponent } from './club/rules/rules.component';
import { CollaborationComponent } from './club/collaboration/collaboration.component';
import { CompetitionsComponent } from './competitions/competitions.component';
import { AdminComponent } from './admin/admin.component';
import { AdminGuard } from './auth/admin.guard';
import { ViewCompetitionComponent } from './competitions/view-competition/view-competition.component';
import { CompApplicationComponent } from './competitions/comp-application/comp-application.component';
import { CompRangeComponent } from './competitions/comp-range/comp-range.component';

const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AdminGuard]},
  { path: 'register', component: RegisterComponent},
  { path: 'signup/:invitationId', component: SignupComponent},
  { path: 'login', component: LoginComponent},
  { path: 'workouts', component: WorkoutsComponent},
  { path: 'lessons', component: LessonsComponent},
  { path: 'competitions', component: CompetitionsComponent},
  { path: 'competitions/:competitionId', component: ViewCompetitionComponent},
  { path: 'competitions/:competitionId/application', component: CompApplicationComponent},
  { path: 'competitions/:competitionId/range', component: CompRangeComponent},
  { path: 'contact', component: ContactComponent},
  { path: 'us', component: UsComponent},
  { path: 'members', component: MembersComponent},
  { path: 'rules', component: RulesComponent},
  { path: 'collaboration', component: CollaborationComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
