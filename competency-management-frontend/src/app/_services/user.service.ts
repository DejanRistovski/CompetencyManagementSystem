import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {User} from "../_model/user.model";
import {Skill} from "../_model/skill.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private static USERS_ENDPOINT = "http://localhost:8080/users";

  constructor(private http: HttpClient) {}

  fetchAll() {
    return this.http.get<User[]>(UserService.USERS_ENDPOINT + '/all');
  }

  fetchById(userId: number) {
    return this.http.get<User>(`${UserService.USERS_ENDPOINT}/${userId}`);
  }

  fetchLoggedInUser() {
    return this.http.get<User>(UserService.USERS_ENDPOINT);
  }

  updateUserSkills(userId: number, skillLevelIds: number[]) {
    return this.http.post<User>(`${UserService.USERS_ENDPOINT}/${userId}/update-skills`, skillLevelIds);
  }

  saveAndAssignUserSkill(userId: number, skill: Skill) {
    return this.http.post<User>(`${UserService.USERS_ENDPOINT}/${userId}/assign-skill`, skill);
  }

  deleteUserSkill(userSkillId: number) {
    return this.http.delete<number>(`${UserService.USERS_ENDPOINT}/${userSkillId}`);
  }
}
