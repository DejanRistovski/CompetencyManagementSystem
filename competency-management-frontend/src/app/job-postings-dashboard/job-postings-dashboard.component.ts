import {Component} from '@angular/core';
import {JobPosting} from "../_model/job-posting.model";
import {JobPostingService} from "../_services/job-posting.service";
import {Router} from "@angular/router";
import {take} from "rxjs";
import {Skill} from "../_model/skill.model";

@Component({
  selector: 'app-job-postings-dashboard',
  templateUrl: './job-postings-dashboard.component.html',
  styleUrls: ['./job-postings-dashboard.component.scss']
})
export class JobPostingsDashboardComponent {

  jobPostings: JobPosting[] = [];

  constructor(private jobPostingService: JobPostingService, private router: Router) {
    jobPostingService.fetchAll()
      .pipe(take(1))
      .subscribe(jobPostings => this.jobPostings = jobPostings);
  }

  onPostingDetails(jobPosting: JobPosting) {
    this.router.navigate(['/job-posting-details', jobPosting.id]);
  }

  getMatchedLevel(skill: Skill) {
    return skill.levels.find(lvl => lvl.id === skill.matchedLevelId);
  }
}
