import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {JobPostingService} from "../../_services/job-posting.service";
import {JobPosting} from "../../_model/job-posting.model";
import {take} from "rxjs";
import {Editor} from "ngx-editor";
import {Skill} from "../../_model/skill.model";
import {SignUpInfo} from "../../_model/signUpInfo.model";
import {AuthService} from "../../_services/auth.service";
import {UserRoleEnum} from "../../_model/enum/user-role.enum";
import {JobPostingApplicant} from "../../_model/job-posting-applicant.model";

@Component({
  selector: 'app-job-posting-details',
  templateUrl: './job-posting-details.component.html',
  styleUrls: ['./job-posting-details.component.scss']
})
export class JobPostingDetailsComponent implements OnInit {

  hasSubmitted: boolean = false;
  hasEditPermission: boolean = false;
  uploadedCV: File | null = null;
  editor: Editor;
  jobPosting?: JobPosting;
  userInfo: SignUpInfo = {};

  constructor(private route: ActivatedRoute,
              private jobPostingService: JobPostingService,
              private authService: AuthService) {
    this.editor = new Editor();
    if (this.authService.userRole === UserRoleEnum.SKILL_MANAGEMENT)
      this.hasEditPermission = true;
  }

  ngOnInit(): void {
    const jobPostingId = this.route.snapshot.paramMap.get('id');
    if (jobPostingId !== null) {
      this.jobPostingService.fetchById(Number(jobPostingId))
        .pipe(take(1))
        .subscribe(jobPosting => {
          this.jobPosting = jobPosting;
        });
    }
  }

  getMatchedLevel(skill: Skill) {
    return skill.levels.find(lvl => lvl.id === skill.matchedLevelId);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.uploadedCV = input.files[0];
    }
  }

  onSubmit() {
    this.hasSubmitted = true;
    this.jobPostingService
      .applyToJobPosting(this.jobPosting?.id!, this.uploadedCV!, this.userInfo)
      .pipe(take(1))
      .subscribe();
  }

  getScorePercentage(applicant: JobPostingApplicant): number {
    const levelsMaxScore = this.jobPosting?.skills.map(s => {
      const level = s.levels.find(lvl => s.matchedLevelId === lvl.id)!;
      return level?.levelOrder;
    }).reduce((x, y) => x+y)!;
    return Math.floor((applicant.score / levelsMaxScore) * 100);
  }

  protected readonly document = document;
}
