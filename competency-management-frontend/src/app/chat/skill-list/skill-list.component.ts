import {Component, Input, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {Skill} from "../../_model/skill.model";
import {MatDrawer} from "@angular/material/sidenav";

@Component({
  selector: 'app-skill-list',
  templateUrl: './skill-list.component.html',
  styleUrls: ['./skill-list.component.scss']
})
export class SkillListComponent implements OnChanges {
  @Input() skills: Skill[] = [];

  @ViewChild('drawer') drawer!: MatDrawer;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['skills'] && changes['skills'].previousValue.length === 0 && changes['skills'].currentValue.length > 0) {
      this.drawer.opened = true;
    } else if (changes['skills'] && changes['skills'].currentValue.length === 0) {
      this.drawer.opened = false;
    }
  }
}
