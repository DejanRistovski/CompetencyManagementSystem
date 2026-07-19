import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillDrawerComponent } from './skill-drawer.component';

describe('SkillDrawerComponent', () => {
  let component: SkillDrawerComponent;
  let fixture: ComponentFixture<SkillDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkillDrawerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkillDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
