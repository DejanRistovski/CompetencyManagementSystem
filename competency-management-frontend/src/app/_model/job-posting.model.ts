import {Skill} from "./skill.model";
import {JobPostingApplicant} from "./job-posting-applicant.model";

export interface JobPosting {
  id: number,
  postingTitle: string,
  postingDescription: string,
  skills: Skill[],
  jobPostingApplicants: JobPostingApplicant[]
}
