import { Injectable } from '@angular/core';
import { Account } from '../interfaces/account.interface';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private _accountsSubject = new BehaviorSubject<Account[]>([]);
  public accounts$ = this._accountsSubject.asObservable();

  private _accountBalanceUpdateSubject = new BehaviorSubject<Account | null>(null);
  public accountBalanceUpdate$ = this._accountBalanceUpdateSubject.asObservable();

  private _selectedAccountSubject = new BehaviorSubject<Account | null>(null);
  public selectedAccount$ = this._selectedAccountSubject.asObservable();

  constructor(private apiService: ApiService) { }

  setSelectedAccount(account: Account): void {
    this._selectedAccountSubject.next(account);
  }

  updateAccounts(newData: Account[]): void {
    this._accountsSubject.next(newData);
  }

  transformAccount(account: Account, rate: number): Account {
    return {
      ...account,
      // We don't need to store in the db the values calculated in dollars
      balance_dollar: account.balance * rate,
      available_balance_dollar: account.available_balance * rate
    };
  }

  onAccountBalanceUpdate(updatedAccount: Account) {
    this._accountBalanceUpdateSubject.next(updatedAccount);
  }

  getCurrentSelectedAccount(): Account | null {
    return this._selectedAccountSubject.getValue();
  }

  resetState() {
    const currentBalanceUpdateAccount = this._accountBalanceUpdateSubject.getValue();
    delete currentBalanceUpdateAccount?.state;
    this._accountBalanceUpdateSubject.next(currentBalanceUpdateAccount);
  }

  getAccountDetail(accountId: string): Observable<Account> {
    const existingAccount = this._accountsSubject.getValue().find(account => account._id === accountId);

    // Regardless of whether the Account already exists in the Behaviorsubject, we need to obtain the most recent details.
    return this.apiService.getAccount(accountId).pipe(
      tap(account => {
        if (existingAccount) {
          // Update the account at the Behaviorsubject if it already exists.
          const index = this._accountsSubject.getValue().indexOf(existingAccount);
          const updatedAccounts = [...this._accountsSubject.getValue()];
          updatedAccounts[index] = account;
          this._accountsSubject.next(updatedAccounts);
        } else {
          // or add the new account to the Behaviorsubject if it did not exist.
          this._accountsSubject.next([...this._accountsSubject.getValue(), account]);
        }
        // In both cases, we update the Behaviorsubject that stores the selected account.
        this._selectedAccountSubject.next(account);
      })
    );
  }
}
