import {Component, Input} from '@angular/core';
import {User} from "../_model/user.model";
import {UserService} from "../_services/user.service";
import {take} from "rxjs";
import {Skill} from "../_model/skill.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-users-dashboard',
  templateUrl: './users-dashboard.component.html',
  styleUrls: ['./users-dashboard.component.scss']
})
export class UsersDashboardComponent {

  @Input() users: User[] = [];

  constructor(private userService: UserService,
              private router: Router) {
    userService.fetchAll().pipe(take(1)).subscribe(users => this.users = users);
  }

  getMatchedLevel(skill: Skill) {
    return skill.levels.find(lvl => lvl.id === skill.matchedLevelId);
  }

  onEditUser(userId: number) {
    this.router.navigate(['/profile', userId]);
  }
}
