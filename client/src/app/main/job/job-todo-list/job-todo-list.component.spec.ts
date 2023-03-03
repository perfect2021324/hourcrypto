import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobTodoListComponent } from './job-todo-list.component';

describe('JobTodoListComponent', () => {
  let component: JobTodoListComponent;
  let fixture: ComponentFixture<JobTodoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobTodoListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobTodoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
