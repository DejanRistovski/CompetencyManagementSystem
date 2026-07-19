import {UserSkill} from "./user-skill.model";
import {UserRoleEnum} from "./enum/user-role.enum";

export interface User {
  id: number,
  token: string,
  firstName: string,
  lastName: string,
  email: string,
  jobTitle: string,
  location: string,
  phoneNumber: string,
  description: string,
  photoUrl: string,
  userRole: UserRoleEnum,
  skills: UserSkill[]
}
