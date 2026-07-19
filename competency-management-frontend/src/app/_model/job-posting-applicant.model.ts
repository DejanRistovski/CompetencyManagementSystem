import {User} from "./user.model";

export interface JobPostingApplicant {
  id: number,
  user: User,
  score: number
}
