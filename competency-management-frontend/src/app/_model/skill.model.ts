import {SkillLevel} from "./skill-level.model";

export interface Skill {
  id?: number,
  name: string,
  description?: string,
  levels: SkillLevel[],
  basedLevel?: string,
  matchedLevelId?: number,

  previousLevelId?: number
}
