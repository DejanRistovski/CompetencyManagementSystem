import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {UserService} from "../_services/user.service";
import {User} from "../_model/user.model";
import {SkillCardStyle} from "../_model/enum/skill-card-style.enum";
import {Skill} from "../_model/skill.model";
import {DrawerService} from "../_services/drawer.service";
import {SkillLevel} from "../_model/skill-level.model";
import {take} from "rxjs";
import {SkillService} from "../_services/skill.service";
import {SkillButtonData} from "../_model/skill-card/skill-button-data.model";
import {SkillBadgeData} from "../_model/skill-card/skill-badge-data.model";
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "../_services/auth.service";

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss'],
  standalone: false
})
export class MyProfileComponent implements OnInit {

  isLoading: boolean = false;
  user?: User;
  uploadedCV: File | null = null;
  generatedSkills: Skill[] = [];
  isExtracting: boolean = false;
  title: string = '';

  @ViewChild('skillDetailsDrawer') skillDetailsDrawer!: TemplateRef<any>;
  @ViewChild('assignSkillsDrawer') assignSkillsDrawer!: TemplateRef<any>;

  constructor(private userService: UserService,
              private skillService: SkillService,
              private drawerService: DrawerService,
              protected authService: AuthService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId !== null){
      this.title = 'User Profile';
      this.userService.fetchById(Number(userId)).subscribe(user => this.user = user);
    }
    else {
      this.title = 'My Profile';
      this.userService.fetchLoggedInUser().subscribe(user => this.user = user);
    }
  }

  onSkillCardButtonClick(buttonData: SkillButtonData, skill: Skill) {
    if (buttonData.action === 'delete') {
      const userSkill = this.user?.skills.find(us => us.skill.id === skill.id);
      if (userSkill)
        this.userService.deleteUserSkill(userSkill.id).pipe(take(1)).subscribe(userSkillId => {
          if (this.user && this.user.skills)
            this.user.skills = this.user?.skills.filter(us => us.id !== userSkillId);
        });
    } else if (buttonData.action === 'save') {
      if (this.user)
        this.userService.saveAndAssignUserSkill(this.user?.id, skill).pipe(take(1))
          .subscribe(user => {
            this.user = user
            this.generatedSkills = this.generatedSkills.filter(s => s.name !== skill.name);
          });
    }
  }

  onSkillDetails(skill: Skill) {
    this.drawerService.open(this.skillDetailsDrawer, "400px", {skill});
  }

  onAssignSkills() {
    this.drawerService.open(this.assignSkillsDrawer, "400px");
  }

  onExtractFromPDF() {
    if (this.uploadedCV != null) {
      this.isExtracting = true;
      this.isLoading = true;
      this.skillService.extractSkillsPDF(this.uploadedCV).subscribe(skill => {
        this.isLoading = false;
        this.generatedSkills = [...this.generatedSkills, skill];
      });
    }
  }

  onSaveSkills(skills: SkillLevel[]) {
    this.userService.updateUserSkills(this.user?.id!, skills.map(lvl => lvl.id!)).pipe(take(1)).subscribe(user => {
      this.user = user;
    });
    this.drawerService.close();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.uploadedCV = input.files[0];
    }
  }

  getCardStyle(skill: Skill): SkillCardStyle {
    if (this.isDeskilled(skill))
      return SkillCardStyle.RED;
    if (this.isUpskilled(skill))
      return SkillCardStyle.ORANGE;
    if (skill.id)
      return SkillCardStyle.GREEN;
    return SkillCardStyle.PRIMARY;
  }

  getButtonData(skill: Skill): SkillButtonData | undefined {
    if (!this.isExtracting)
      return undefined;

    if (this.isUpskilled(skill) || this.isDeskilled(skill))
      return {label: 'Assign', style: 'normal', action: 'save'};
    if (this.userContainsSkill(skill))
      return {label: 'Unassign', style: 'warn', action: 'delete'};
    if (!skill.id)
      return {label: 'Save and Assign', style: 'normal', action: 'save'};
    return {label: 'Assign', style: 'normal', action: 'save'};
  }

  getBadgeData(skill: Skill): SkillBadgeData | undefined {
    if (!this.isExtracting)
      return undefined;

    if (this.isDeskilled(skill))
      return {label: 'DESKILL', style: SkillCardStyle.RED};
    if (this.isUpskilled(skill))
      return {label: 'UPSKILL', style: SkillCardStyle.ORANGE};
    if (!skill.id)
      return {label: 'NEW', style: SkillCardStyle.PRIMARY};
    else
      return {label: 'EXISTING', style: SkillCardStyle.GREEN};
  }

  get userSkillsFiltered() {
    let skills: Skill[] = [];
    this.user?.skills.forEach(us => {
      let skill = this.generatedSkills
        .find(s => s.id === us.skill.id && s.matchedLevelId !== us.skill.matchedLevelId);
      if (skill) {
        skill = {...skill, previousLevelId: us.skill.matchedLevelId};
        skills = [...skills, skill];
      } else
        skills = [...skills, us.skill];
    });
    return [...skills, ...this.generatedSkills
      .filter(s => s.id && !skills
        .some(skill => s.id === skill.id && s.matchedLevelId === skill.matchedLevelId))];
  }

  get additionalSkillsFiltered() {
    return this.generatedSkills.filter(skill => skill.id === undefined || skill.id === null);
  }

  private isUpskilled(skill: Skill) {
    return this.user?.skills!.some(s => s.skill.id === skill.id
      && skill.previousLevelId !== undefined && skill.matchedLevelId! > s.skill.matchedLevelId!)!;
  }

  private isDeskilled(skill: Skill) {
    return this.user?.skills!.some(s => s.skill.id === skill.id
      && skill.previousLevelId !== undefined && skill.matchedLevelId! < s.skill.matchedLevelId!)!;
  }

  private userContainsSkill(skill: Skill) {
    return this.user?.skills!.some(s => s.skill.id === skill.id);
  }

  protected readonly document = document;
}
