import { HttpClient } from '@angular/common/http';
import {Injectable, NgZone} from '@angular/core';
import {Observable, Subscriber} from 'rxjs';
import {Skill} from "../_model/skill.model";

@Injectable({
  providedIn: 'root'
})
export class SkillService {

  private static SKILLS_ENDPOINT = "http://localhost:8080/skills";

  constructor(private http: HttpClient, private ngZone: NgZone) {}

  fetchAll() {
    return this.http.get<Skill[]>(SkillService.SKILLS_ENDPOINT);
  }

  extractSkills(input: string): Observable<Skill> {
    return new Observable(observer => {
      this.ngZone.runOutsideAngular(() => {
        let buffer = '';

        fetch(`${SkillService.SKILLS_ENDPOINT}/extract-skills`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream'
          },
          body: JSON.stringify(input)
        }).then(response => {
          this.processSkillExtractResponse(observer, response, buffer);
        });
      });
    });
  }

  extractSkillsPDF(file: File): Observable<Skill> {
    return new Observable(observer => {
      this.ngZone.runOutsideAngular(() => {
        let buffer = '';
        const formData = new FormData();
        formData.append('file', file);

        fetch(`${SkillService.SKILLS_ENDPOINT}/extract-skills-pdf`, {
          method: 'POST',
          headers: {
            'Accept': 'text/event-stream'
          },
          body: formData
        }).then(response => {
          this.processSkillExtractResponse(observer, response, buffer);
        });
      });
    });
  }

  createSkill(skill: Skill): Observable<Skill> {
    return this.http.post<Skill>(SkillService.SKILLS_ENDPOINT, skill);
  }

  deleteSkill(skillId: number): Observable<number> {
    return this.http.delete<number>(`${SkillService.SKILLS_ENDPOINT}/${skillId}`);
  }

  private processSkillExtractResponse(observer: Subscriber<Skill>, response: Response, buffer: string) {
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    const read = (): void => {
      reader?.read().then(({ done, value }) => {
        if (done) {
          this.ngZone.run(() => observer.complete());
          return;
        }

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        lines.forEach(line => {
          if (line.startsWith('data:')) {
            const data = line.substring(5).trim();
            if (data) {
              try {
                const skill: Skill = JSON.parse(data);
                this.ngZone.run(() => observer.next(skill));
              } catch (e) {
                console.error('Parse error:', e);
              }
            }
          }
        });

        read();
      }).catch(error => {
        this.ngZone.run(() => observer.error(error));
      });
    };

    read();
  }
}
