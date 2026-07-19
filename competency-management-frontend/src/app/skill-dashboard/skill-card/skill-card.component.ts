import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Skill} from "../../_model/skill.model";
import {SkillLevel} from "../../_model/skill-level.model";
import {SkillButtonData} from "../../_model/skill-card/skill-button-data.model";
import {SkillBadgeData} from "../../_model/skill-card/skill-badge-data.model";
import {SkillCardStyle} from "../../_model/enum/skill-card-style.enum";

@Component({
  selector: 'app-skill-card',
  templateUrl: './skill-card.component.html',
  styleUrls: ['./skill-card.component.scss']
})
export class SkillCardComponent {
  @Input() skill?: Skill;
  @Input() style: SkillCardStyle = SkillCardStyle.PRIMARY_FULL;
  @Input() badgeData?: SkillBadgeData;
  @Input() buttonData?: SkillButtonData;
  @Output() buttonClicked = new EventEmitter<SkillButtonData>();
  @Output() skillSelected = new EventEmitter<SkillLevel>();

  getBubbleFont(level: SkillLevel) {
    const matchedLevel = this.getMatchedLevel();

    if (this.style === SkillCardStyle.PRIMARY_FULL)
      return 'primary-font';

    if (matchedLevel?.levelOrder === level.levelOrder)
      if (this.style === SkillCardStyle.PRIMARY)
        return this.style + '-hg-font';
      else
        return this.style + '-font'
    if (level.levelOrder < matchedLevel?.levelOrder!)
      return 'primary-font';
    return 'normal-font';
  }

  getBubbleStyle(level: SkillLevel) {
    const matchedLevel = this.getMatchedLevel();

    if (this.style === SkillCardStyle.PRIMARY_FULL)
      return 'primary-level-bubble';

    if (matchedLevel?.levelOrder === level.levelOrder)
      return this.style + '-hg-level-bubble';
    if (level.levelOrder < matchedLevel?.levelOrder!)
      return 'primary-level-bubble'
    return 'normal-level-bubble'
  }

  getMatchedLevel() {
    let matchedLevel: SkillLevel | undefined;
    if (this.skill?.matchedLevelId !== undefined && this.skill.matchedLevelId !== null)
      matchedLevel = this.skill.levels.find(lvl => lvl.id === this.skill?.matchedLevelId)
    else if (this.skill?.basedLevel !== undefined && this.skill.basedLevel !== null)
      matchedLevel = this.skill.levels.find(lvl => lvl.name === this.skill?.basedLevel)
    return matchedLevel;
  }

  getProgressWidth(): number {
    if (this.style === SkillCardStyle.PRIMARY_FULL)
      return 100;
    let matchedIdx = this.skill?.matchedLevelId;
    if (this.skill?.matchedLevelId !== undefined && this.skill?.matchedLevelId !== null)
      matchedIdx = this.skill?.levels.findIndex(lvl => lvl.id === this.skill?.matchedLevelId)
    else if (this.skill?.basedLevel !== undefined && this.skill?.basedLevel !== null)
      matchedIdx = this.skill?.levels.findIndex(lvl => lvl.name === this.skill?.basedLevel)
    if (!matchedIdx) return 0;
    return (matchedIdx / (this.skill?.levels?.length ?? 0 - 1)) * 150;
  }

  onSelectLevel(level: SkillLevel) {
    level = {...level, fromSkill: this.skill};
    this.skillSelected.emit(level);
  }

  onButtonClick() {
    this.buttonClicked.emit(this.buttonData);
  }

  get badgeClasses() {
    if (this.badgeData?.style === SkillCardStyle.RED)
      return 'red-font red-faded-background';
    if (this.badgeData?.style === SkillCardStyle.ORANGE)
      return 'orange-font orange-faded-background';
    if (this.badgeData?.style === SkillCardStyle.GREEN)
      return 'green-font green-faded-background';
    return 'primary-font primary-faded-background';
  }

  get trackLine() {
    if (this.style === SkillCardStyle.PRIMARY_FULL)
      return 'primary-track';
    if (this.style === SkillCardStyle.RED)
      return 'red-gradient-track';
    if (this.style === SkillCardStyle.ORANGE)
      return 'orange-gradient-track';
    if (this.style === SkillCardStyle.GREEN)
      return 'green-gradient-track';
    if (this.style === SkillCardStyle.PRIMARY)
      return 'primary-gradient-track';
    return 'normal-track';
  }
}
