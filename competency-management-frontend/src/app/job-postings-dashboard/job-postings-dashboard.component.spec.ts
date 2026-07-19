import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobPostingsDashboardComponent } from './job-postings-dashboard.component';

describe('JobPostingsDashboardComponent', () => {
  let component: JobPostingsDashboardComponent;
  let fixture: ComponentFixture<JobPostingsDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobPostingsDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobPostingsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
