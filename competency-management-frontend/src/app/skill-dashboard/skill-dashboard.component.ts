import {Component, TemplateRef, ViewChild} from '@angular/core';
import {take} from "rxjs";
import {Skill} from "../_model/skill.model";
import {SkillService} from "../_services/skill.service";
import {Router} from "@angular/router";
import {DrawerService} from "../_services/drawer.service";
import {SkillLevel} from "../_model/skill-level.model";
import {JobPostingService} from "../_services/job-posting.service";

@Component({
  selector: 'app-skill-dashboard',
  templateUrl: './skill-dashboard.component.html',
  styleUrls: ['./skill-dashboard.component.scss']
})
export class SkillDashboardComponent {

  isLoading: boolean = false;
  isGeneratingJobPosting: boolean = false;
  selectedLevels: SkillLevel[] = [];
  skills: Skill[] = [];
  @ViewChild('skillDetailsDrawer') skillDetailsDrawer!: TemplateRef<any>;

  constructor(private skillService: SkillService,
              private jobPostingService: JobPostingService,
              private router: Router,
              private drawerService: DrawerService) {
    skillService.fetchAll().pipe(take(1)).subscribe(skills => this.skills = skills);
  }

  onExtractSkills() {
    this.router.navigate(['/skill-extract']);
  }

  onSkillDetails(skill: Skill) {
    this.drawerService.open(this.skillDetailsDrawer, "400px", {skill});
  }

  onGenerateJobPosting() {
    this.isGeneratingJobPosting = !this.isGeneratingJobPosting;
  }

  onAddLevel(level: SkillLevel) {
    this.selectedLevels = [...this.selectedLevels.filter(lvl => lvl.fromSkill !== level.fromSkill), level];
  }

  onGenerateConfirm() {
    this.isLoading = true;
    this.jobPostingService.createJobPosting(this.selectedLevels).pipe(take(1))
      .subscribe(() => {
        this.isLoading = false;
        this.router.navigate(['/job-postings']);
      });
  }

  onGenerateDiscard() {
    this.selectedLevels = [];
    this.isLoading = false;
    this.isGeneratingJobPosting = false;
  }
}
