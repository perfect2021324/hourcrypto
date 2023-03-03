import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobTodoItemComponent } from './job-todo-item.component';

describe('JobTodoItemComponent', () => {
  let component: JobTodoItemComponent;
  let fixture: ComponentFixture<JobTodoItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobTodoItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobTodoItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
