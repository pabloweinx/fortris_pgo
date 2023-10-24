import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsListPageComponent } from './accounts-list-page.component';
import { ApiService } from 'src/app/services/api.service';
import { ExchangeRateService } from 'src/app/services/exchange-rate.service';
import { AccountsService } from 'src/app/services/accounts.service';
import { Account } from 'src/app/interfaces/account.interface';
import { of } from 'rxjs';

describe('AccountsListPageComponent', () => {
  let component: AccountsListPageComponent;
  let fixture: ComponentFixture<AccountsListPageComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let exchangeRateServiceSpy: jasmine.SpyObj<ExchangeRateService>;

  beforeEach(() => {
    apiServiceSpy = jasmine.createSpyObj('ApiService', ['getExchangeRate', 'getAccounts']);
    exchangeRateServiceSpy = jasmine.createSpyObj('ExchangeRateService', ['setInitialExchangeRate']);

    TestBed.configureTestingModule({
      declarations: [AccountsListPageComponent],
      providers: [
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: ExchangeRateService, useValue: exchangeRateServiceSpy },
      ]
    });
    fixture = TestBed.createComponent(AccountsListPageComponent);
    component = fixture.componentInstance;
  });

  it('should retrieve initial data', () => {
    // Mock data and observables
    const mockRate = 1.1;
    const mockAccounts: Account[] = [
      {
        _id: '1',
        account_name: `Personal account 1`,
        category: 'Personal',
        tags: 'Something',
        balance: 20,
        available_balance: 18,
        details: []
      },
      {
        _id: '2',
        account_name: `Personal account 2`,
        category: 'Personal',
        tags: 'Something',
        balance: 30,
        available_balance: 20,
        details: []
      },
    ];

    apiServiceSpy.getExchangeRate.and.returnValue(of(mockRate));
    apiServiceSpy.getAccounts.and.returnValue(of(mockAccounts));
    exchangeRateServiceSpy.setInitialExchangeRate.and.callFake(() => { });

    // Call the method
    component.setInitialData();

    // Expectations
    expect(apiServiceSpy.getExchangeRate).toHaveBeenCalled();
    expect(exchangeRateServiceSpy.setInitialExchangeRate).toHaveBeenCalledWith(mockRate);
    expect(apiServiceSpy.getAccounts).toHaveBeenCalled();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
