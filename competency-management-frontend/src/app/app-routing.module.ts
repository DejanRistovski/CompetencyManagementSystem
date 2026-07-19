import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginFormComponent} from "./login-form/login-form.component";
import {MyProfileComponent} from "./my-profile/my-profile.component";
import {RegisterFormComponent} from "./register-form/register-form.component";
import {ChatComponent} from "./chat/chat.component";
import {SkillDashboardComponent} from "./skill-dashboard/skill-dashboard.component";
import {SkillExtractComponent} from "./skill-dashboard/skill-extract/skill-extract.component";
import {UsersDashboardComponent} from "./users-dashboard/users-dashboard.component";
import {JobPostingsDashboardComponent} from "./job-postings-dashboard/job-postings-dashboard.component";
import {JobPostingDetailsComponent} from "./job-postings-dashboard/job-posting-details/job-posting-details.component";

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginFormComponent},
  {path: 'my-profile', component: MyProfileComponent},
  {path: 'profile/:id', component: MyProfileComponent},
  {path: 'register', component: RegisterFormComponent},
  {path: 'skill-dashboard', component: SkillDashboardComponent},
  {path: 'skill-extract', component: SkillExtractComponent},
  {path: 'users-dashboard', component: UsersDashboardComponent},
  {path: 'job-postings', component: JobPostingsDashboardComponent},
  {path: 'job-posting-details/:id', component: JobPostingDetailsComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
