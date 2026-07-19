import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {MyProfileComponent} from "./my-profile/my-profile.component";
import {AuthInterceptor} from "./_config/auth.interceptor";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {LoginFormComponent} from './login-form/login-form.component';
import {MatInputModule} from "@angular/material/input";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatButtonModule} from "@angular/material/button";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {NavbarComponent} from './navbar/navbar.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {LoaderComponent} from "./shared/spinner-loader/spinner-loader.component";
import {SpinnerLoaderService} from "./_services/spinner-loader.service";
import {RegisterFormComponent} from "./register-form/register-form.component";
import {ErrorSnackbarService} from "./_services/error-snackbar.service";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatListModule} from "@angular/material/list";
import {ChatComponent} from './chat/chat.component';
import {MessageComponent} from './chat/message/message.component';
import {InputBarComponent} from './chat/input-bar/input-bar.component';
import {TopicsHeaderComponent} from './chat/topics-header/topics-header.component';
import {MatSelectModule} from "@angular/material/select";
import {SkillListComponent} from './chat/skill-list/skill-list.component';
import {MatExpansionModule} from "@angular/material/expansion";
import {MatSidenavModule} from "@angular/material/sidenav";
import { SkillDashboardComponent } from './skill-dashboard/skill-dashboard.component';
import {MatChipsModule} from "@angular/material/chips";
import { SkillExtractComponent } from './skill-dashboard/skill-extract/skill-extract.component';
import { SkillDrawerComponent } from './skill-dashboard/skill-drawer/skill-drawer.component';
import { SkillCardComponent } from './skill-dashboard/skill-card/skill-card.component';
import { UserInfoComponent } from './my-profile/user-info/user-info.component';
import { UserSkillsManageComponent } from './shared/user-skills-manage/user-skills-manage.component';
import { UsersDashboardComponent } from './users-dashboard/users-dashboard.component';
import { JobPostingsDashboardComponent } from './job-postings-dashboard/job-postings-dashboard.component';
import { JobPostingDetailsComponent } from './job-postings-dashboard/job-posting-details/job-posting-details.component';
import {NgxEditorModule} from "ngx-editor";

@NgModule({
  declarations: [
    AppComponent,
    MyProfileComponent,
    LoginFormComponent,
    NavbarComponent,
    LoginFormComponent,
    RegisterFormComponent,
    LoaderComponent,
    NavbarComponent,
    ChatComponent,
    MessageComponent,
    InputBarComponent,
    TopicsHeaderComponent,
    SkillListComponent,
    SkillDashboardComponent,
    SkillExtractComponent,
    SkillDrawerComponent,
    SkillCardComponent,
    UserInfoComponent,
    UserSkillsManageComponent,
    UsersDashboardComponent,
    JobPostingsDashboardComponent,
    JobPostingDetailsComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatToolbarModule,
        MatIconModule,
        MatInputModule,
        MatCardModule,
        MatSnackBarModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatProgressSpinnerModule,
        MatListModule,
        MatSelectModule,
        MatExpansionModule,
        MatSidenavModule,
        FormsModule,
        MatChipsModule,
        NgxEditorModule,
    ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    SpinnerLoaderService, ErrorSnackbarService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
