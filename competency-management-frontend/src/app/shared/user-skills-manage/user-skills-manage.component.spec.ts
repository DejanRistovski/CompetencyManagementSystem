import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSkillsManageComponent } from './user-skills-manage.component';

describe('UserSkillsManageComponent', () => {
  let component: UserSkillsManageComponent;
  let fixture: ComponentFixture<UserSkillsManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserSkillsManageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserSkillsManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
