import {Skill} from "./skill.model";

export interface SkillLevel {
  id?: number,
  name: string,
  expectation: string,
  levelOrder: number,

  fromSkill?: Skill
}
