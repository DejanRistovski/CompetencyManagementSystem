import {Message} from "./message.model";
import {Skill} from "./skill.model";

export interface Topic {
  id?: string,
  title?: string,
  messages?: Message[],
  skills?: Skill[]
}
