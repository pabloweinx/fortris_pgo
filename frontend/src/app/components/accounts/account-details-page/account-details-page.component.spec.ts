import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountDetailsPageComponent } from './account-details-page.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('AccountDetailsPageComponent', () => {
  let component: AccountDetailsPageComponent;
  let fixture: ComponentFixture<AccountDetailsPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [AccountDetailsPageComponent]
    });
    fixture = TestBed.createComponent(AccountDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getTransactionType', () => {
    it('should return the correct transaction type for a given number', () => {
      const type1Result = component.getTransactionType(1);
      const type2Result = component.getTransactionType(2);
      expect(type1Result).toEqual('Payment received');
      expect(type2Result).toEqual('Payment sent');
    });

    it('should handle unknown transaction types', () => {
      const unknownTypeResult = component.getTransactionType(3);
      expect(unknownTypeResult).toBe('Unknown');
    });
  });
});
