import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeedVolunteerComponent } from './need-volunteer.component';

describe('NeedVolunteerComponent', () => {
  let component: NeedVolunteerComponent;
  let fixture: ComponentFixture<NeedVolunteerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NeedVolunteerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NeedVolunteerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
