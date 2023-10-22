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

  private _accountsDataSubject = new BehaviorSubject<Account[]>([]);
  public accountsData$ = this._accountsDataSubject.asObservable();

  private _accountBalanceUpdateSubject = new BehaviorSubject<Account[]>([]);
  public accountBalanceUpdate$ = this._accountBalanceUpdateSubject.asObservable();

  private _selectedAccountSubject = new BehaviorSubject<Account | null>(null);
  public selectedAccount$ = this._selectedAccountSubject.asObservable();

  constructor(private apiService: ApiService) { }

  /**
   * This method is needed to feed the behaviour subject of the accounts to work with them more efficiently
   * @param accounts the array of accounts
   */
  setInitialAccounts(accounts: Account[]): void {
    this._accountsDataSubject.next(accounts);
  }

  setSelectedAccount(account: Account): void {
    this._selectedAccountSubject.next(account);
  }

  updateAccounts(newData: Account[]): void {
    this._accountsSubject.next(newData);
  }

  transformAccount(account: Account, rate: number) {
    return {
      ...account,
      balance_btc: account.balance,
      available_balance_btc: account.available_balance,
      // We don't need to store in the db the values calculated in dollars
      balance_dollar: account.balance * rate,
      available_balance_dollar: account.available_balance * rate
    };
  }

  onAccountBalanceUpdate(updatedAccount: Account) {
    // Obtienes el valor actual del Subject
    const currentUpdates = this._accountBalanceUpdateSubject.getValue();

    // 1. Eliminas el atributo 'state' de todas las cuentas en currentUpdates
    currentUpdates.forEach(account => {
      delete account.state;
    });

    // 2. Buscas si la cuenta actualizada ya existe en currentUpdates
    const indexToUpdate = currentUpdates.findIndex(account => account._id === updatedAccount._id);

    if (indexToUpdate !== -1) {
      // Si ya existe, actualizas la cuenta con la nueva información
      currentUpdates[indexToUpdate] = updatedAccount;
    } else {
      // Si no existe, la añades al final de currentUpdates
      currentUpdates.push(updatedAccount);
    }

    // Emite el array actualizado a través del Subject
    this._accountBalanceUpdateSubject.next(currentUpdates);
  }

  resetStates() {
    const removeStateAttribute = (accounts: Account[]): Account[] => {
      return accounts.map(account => {
        const { state, ...rest } = account;
        return rest;
      });
    };

    const currentAccounts = this._accountsSubject.getValue();
    const processedAccounts = removeStateAttribute(currentAccounts);
    this._accountsSubject.next(processedAccounts);

    const currentAccountsData = this._accountsDataSubject.getValue();
    const processedAccountsData = removeStateAttribute(currentAccountsData);
    this._accountsDataSubject.next(processedAccountsData);

    console.log(this._accountsSubject.getValue());
    console.log(this._accountsDataSubject.getValue());
  }

  getAccountDetail(accountId: string): Observable<Account> {
    const existingAccount = this._accountsDataSubject.getValue().find(account => account._id === accountId);

    // Regardless of whether the Account already exists in the Behaviorsubject, we need to obtain the most recent details.
    return this.apiService.getAccount(accountId).pipe(
      tap(account => {
        if (existingAccount) {
          // Update the account at the Behaviorsubject if it already exists.
          const index = this._accountsDataSubject.getValue().indexOf(existingAccount);
          const updatedAccounts = [...this._accountsDataSubject.getValue()];
          updatedAccounts[index] = account;
          this._accountsDataSubject.next(updatedAccounts);
        } else {
          // or add the new account to the Behaviorsubject if it did not exist.
          this._accountsDataSubject.next([...this._accountsDataSubject.getValue(), account]);
        }
        // In both cases, we update the Behaviorsubject that stores the selected account.
        this._selectedAccountSubject.next(account);
      })
    );
  }
}
