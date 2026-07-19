import {Component, Input} from '@angular/core';
import {Skill} from "../../_model/skill.model";
import {SkillCardStyle} from "../../_model/enum/skill-card-style.enum";
import {SkillBadgeData} from "../../_model/skill-card/skill-badge-data.model";
import {SkillLevel} from "../../_model/skill-level.model";

@Component({
  selector: 'app-skill-drawer',
  templateUrl: './skill-drawer.component.html',
  styleUrls: ['./skill-drawer.component.scss']
})
export class SkillDrawerComponent {

  @Input() badgeData?: SkillBadgeData;
  @Input() style: SkillCardStyle = SkillCardStyle.PRIMARY_FULL;
  @Input() skill?: Skill;

  get badgeClasses() {
    if (this.badgeData?.style === SkillCardStyle.RED)
      return 'red-font red-faded-background';
    if (this.badgeData?.style === SkillCardStyle.ORANGE)
      return 'orange-font orange-faded-background';
    if (this.badgeData?.style === SkillCardStyle.GREEN)
      return 'green-font green-faded-background';
    return 'primary-font primary-faded-background';
  }

  getTrackLine(level: SkillLevel | undefined) {
    if (!level)
      return undefined;

    const matchedLevel = this.getMatchedLevel();
    if (this.style === SkillCardStyle.PRIMARY_FULL || level.levelOrder < matchedLevel?.levelOrder!)
      return 'primary-track';
    if (level.levelOrder === matchedLevel?.levelOrder) {
      if (this.style === SkillCardStyle.RED)
        return 'red-gradient-track';
      if (this.style === SkillCardStyle.ORANGE)
        return 'orange-gradient-track';
      if (this.style === SkillCardStyle.GREEN)
        return 'green-gradient-track';
      if (this.style === SkillCardStyle.PRIMARY)
        return 'primary-gradient-track';
    }
    return 'normal-track';
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
}
