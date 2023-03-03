import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionItemLookupComponent } from './transaction-item-lookup.component';

describe('TransactionItemLookupComponent', () => {
  let component: TransactionItemLookupComponent;
  let fixture: ComponentFixture<TransactionItemLookupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionItemLookupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionItemLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
