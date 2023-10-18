import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsListPageComponent } from './accounts-list-page.component';

describe('AccountsListPageComponent', () => {
  let component: AccountsListPageComponent;
  let fixture: ComponentFixture<AccountsListPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccountsListPageComponent]
    });
    fixture = TestBed.createComponent(AccountsListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
