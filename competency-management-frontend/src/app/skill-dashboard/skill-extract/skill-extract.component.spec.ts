import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillExtractComponent } from './skill-extract.component';

describe('ExtractSkillsComponent', () => {
  let component: SkillExtractComponent;
  let fixture: ComponentFixture<SkillExtractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkillExtractComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkillExtractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
