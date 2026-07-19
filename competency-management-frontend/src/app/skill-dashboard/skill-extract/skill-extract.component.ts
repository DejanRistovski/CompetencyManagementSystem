import {Component, TemplateRef, ViewChild} from '@angular/core';
import {Skill} from "../../_model/skill.model";
import {MatDrawer} from "@angular/material/sidenav";
import {SkillService} from "../../_services/skill.service";
import {DrawerService} from "../../_services/drawer.service";
import {take} from "rxjs";
import {SkillCardStyle} from "../../_model/enum/skill-card-style.enum";
import {SkillButtonData} from "../../_model/skill-card/skill-button-data.model";
import {SkillBadgeData} from "../../_model/skill-card/skill-badge-data.model";

@Component({
  selector: 'app-extract-skills',
  templateUrl: './skill-extract.component.html',
  styleUrls: ['./skill-extract.component.scss']
})
export class SkillExtractComponent {

  isLoading: boolean = false;
  inputText: string = "";
  skills: Skill[] = [];

  @ViewChild('drawer') drawer!: MatDrawer;
  @ViewChild('skillLevelDrawer') skillLevelDrawer!: TemplateRef<any>;

  constructor(private skillService: SkillService,
              private drawerService: DrawerService) {
  }

  selectSkill(skill: Skill) {
    this.drawerService.open(this.skillLevelDrawer, "400px", {skill});
  }

  onExtractSkills() {
    this.isLoading = true;
    this.skillService.extractSkills(this.inputText).subscribe(value => {
      this.isLoading = false;
      this.skills = [...this.skills, value];
    });
  }

  getCardStyle(skill: Skill): SkillCardStyle {
    if (skill.id)
      return SkillCardStyle.GREEN;
    return SkillCardStyle.PRIMARY;
  }

  getButtonData(skill: Skill): SkillButtonData | undefined {
    if (!skill.id)
      return {label: 'Save', style: 'normal', action: 'save'};
    return {label: 'Delete', style: 'warn', action: 'delete'};
  }

  getBadgeData(skill: Skill): SkillBadgeData | undefined {
    if (!skill.id)
      return {label: 'NEW', style: SkillCardStyle.PRIMARY};
    else
      return {label: 'EXISTING', style: SkillCardStyle.GREEN};
  }

  onSkillCardButtonClick(buttonData: SkillButtonData, skill: Skill) {
    if (buttonData.action === 'delete') {
      this.deleteSkill(skill.id!);
    } else if (buttonData.action === 'save') {
      this.addSkill(skill);
    }
  }

  addSkill(skill: Skill) {
    this.skillService.createSkill(skill).pipe(take(1)).subscribe(addedSkill => this.replaceSkill(addedSkill));
  }

  deleteSkill(skillId: number) {
    this.skillService.deleteSkill(skillId).pipe(take(1)).subscribe(deletedSkillId => this.removeSkill(deletedSkillId));
  }

  private replaceSkill(skill: Skill) {
    this.skills = this.skills.map(s => s.name === skill.name ? skill : s);
  }

  private removeSkill(skillId: number) {
    this.skills.forEach(s => {
      if (s.id === skillId)
        s.id = undefined;
    });
  }
}
