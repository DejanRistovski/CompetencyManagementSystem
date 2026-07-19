import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Skill} from "../../_model/skill.model";
import {SkillService} from "../../_services/skill.service";
import {SkillLevel} from "../../_model/skill-level.model";
import {User} from "../../_model/user.model";
import {UserService} from "../../_services/user.service";

@Component({
  selector: 'app-user-skills-manage',
  templateUrl: './user-skills-manage.component.html',
  styleUrls: ['./user-skills-manage.component.scss']
})
export class UserSkillsManageComponent implements OnInit, OnChanges {

  @Input() user?: User;
  @Output() onSaveSkills = new EventEmitter();

  skills: Skill[] = [];
  selectedSkill?: Skill;
  selectedLevels: SkillLevel[] = [];

  constructor(private skillService: SkillService, private userService: UserService) { }

  ngOnInit(): void {
    this.skillService.fetchAll().subscribe(skills => this.skills = skills);
    let levels = this.user?.skills.filter(usk => usk.skill.levels.some(lvl => lvl.id === usk.skill.matchedLevelId))
      .map(usk => {
        let level = usk.skill.levels.find(lvl => lvl.id === usk.skill.matchedLevelId);
        level!.fromSkill = usk.skill;
        return level!;
      });
    this.selectedLevels = [...this.selectedLevels, ...levels ?? []];
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['user']) {
      this.selectedLevels = [...this.selectedLevels];
    }
  }

  onSelectLevel(level: SkillLevel) {
    this.selectedLevels = [...this.selectedLevels, {...level, fromSkill: this.selectedSkill!}];
    this.selectedSkill = undefined;
  }

  onRemoveLevel(level: SkillLevel) {
    this.selectedLevels = this.selectedLevels.filter(lvl => lvl.id !== level.id);
  }

  existsSkill(skill: Skill) {
    return this.selectedLevels.some(lvl => lvl.fromSkill?.id === skill.id);
  }

  saveSkills() {
    this.onSaveSkills.emit(this.selectedLevels);
  }
}
