import { TestBed } from '@angular/core/testing';

import { AccountsService } from './accounts.service';
import { Account } from '../interfaces/account.interface';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AccountsService', () => {
  let service: AccountsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AccountsService]
    });
    service = TestBed.inject(AccountsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should transform account balances to dollar correctly', () => {
    const testAccount: Account = {
      _id: '1',
      account_name: `Personal account 1`,
      category: 'Personal',
      tags: 'Something',
      balance: 20,
      available_balance: 18,
      details: []
    };
    const rate = 0.8;  // example conversion rate to dollar

    const transformedAccount = service.transformAccount(testAccount, rate);
    expect(transformedAccount.balance_dollar).toBe(testAccount.balance * rate);
    expect(transformedAccount.available_balance_dollar).toBe(testAccount.available_balance * rate);
  });
});
