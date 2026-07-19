import { HttpClient } from '@angular/common/http';
import {Injectable} from '@angular/core';
import {SkillLevel} from "../_model/skill-level.model";
import {JobPosting} from "../_model/job-posting.model";
import {Observable} from "rxjs";
import {SignUpInfo} from "../_model/signUpInfo.model";

@Injectable({
  providedIn: 'root'
})
export class JobPostingService {

  private static JOB_POSTING_ENDPOINT = "http://localhost:8080/job-postings";

  constructor(private http: HttpClient) {}

  fetchById(jobPostingId: number) {
    return this.http.get<JobPosting>(`${JobPostingService.JOB_POSTING_ENDPOINT}/${jobPostingId}`);
  }

  fetchAll() {
    return this.http.get<JobPosting[]>(JobPostingService.JOB_POSTING_ENDPOINT);
  }

  createJobPosting(levels: SkillLevel[]) {
    return this.http.post<JobPosting>(`${JobPostingService.JOB_POSTING_ENDPOINT}`, levels);
  }

  applyToJobPosting(jobPostingId: number, file: File, userInfo: SignUpInfo): Observable<void> {
    const formData = new FormData();

    formData.append('file', file);
    formData.append('userInfo', new Blob([JSON.stringify(userInfo)], { type: 'application/json' }));

    return this.http.post<void>(`${JobPostingService.JOB_POSTING_ENDPOINT}/${jobPostingId}/apply`, formData);
  }
}
