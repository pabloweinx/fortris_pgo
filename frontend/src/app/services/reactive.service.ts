import { Injectable } from '@angular/core';
import { Observable, combineLatest, map, shareReplay } from 'rxjs';
import * as io from 'socket.io-client';
import { Account } from '../interfaces/account.interface';
import { AccountService } from './account.service';
import { ExchangeRateService } from './exchange-rate.service';

@Injectable({
  providedIn: 'root'
})
export class ReactiveService {
  private socket!: io.Socket;

  private combinedData$!: Observable<Account[]>;
  private combinedSelectedAccountData$!: Observable<Account>;

  constructor(
    private accountService: AccountService,
    private exchangeRateService: ExchangeRateService
  ) { }

  initReactivity() {
    this.socket = io.connect('http://localhost:3000');
    this.socket.on("connect", () => console.log('connected to ws!'));
    this.socket.on('newExchangeRate', newExchangeRate => this.exchangeRateService.onExchangeRateUpdate(newExchangeRate));
    this.socket.on('accountBalanceUpdate', updatedAccount => this.accountService.onAccountBalanceUpdate(updatedAccount));
    this.socket.on("disconnect", () => console.log('disconnected from ws.'));

    // The reactive process for the accounts list page
    this.combinedData$ = combineLatest([this.accountService.accountsData$, this.accountService.accountBalanceUpdate$, this.exchangeRateService.exchangeRateUpdate$]).pipe(
      map(([accountsData, accountBalanceUpdate, exchangeRateUpdate]) => {
        // First, we apply the Exchange Rate to the accounts
        const accountsWithUpdatedExchangeRate = accountsData.map((account: Account) => {
          const updatedBalance = account.balance * exchangeRateUpdate;
          return { ...account, balance: updatedBalance };
        });

        // Then, we apply balance update and recalculate everything
        return accountsWithUpdatedExchangeRate.map((account: Account) => {
          const update = accountBalanceUpdate.find(updatedAccount => updatedAccount._id === account._id);
          return update ? this.accountService.transformAccount({ ...account, ...update }, exchangeRateUpdate) : account;
        });
      }),
      shareReplay(1)
    );

    this.combinedData$.subscribe(data => {
      this.accountService.updateAccounts(data);
    });

    // The reactive process for the account detils page
    this.combinedSelectedAccountData$ = combineLatest([
      this.accountService.selectedAccount$,
      this.accountService.accountBalanceUpdate$,
      this.exchangeRateService.exchangeRateUpdate$
    ]).pipe(
      map(([selectedAccount, accountBalanceUpdate, exchangeRateUpdate]) => {
        const update = accountBalanceUpdate.find(update => update._id === (selectedAccount as Account)._id);
        if (update) {
          selectedAccount = this.accountService.transformAccount({
            ...(selectedAccount as Account),
            balance: update.balance ? update.balance : (selectedAccount as Account).balance,
            available_balance: update.available_balance ? update.available_balance : (selectedAccount as Account).available_balance,
          }, exchangeRateUpdate);
        } else {
          selectedAccount = this.accountService.transformAccount((selectedAccount as Account), exchangeRateUpdate);
        }

        return selectedAccount;
      })
    );
  }

  disconnect() {
    this.socket.disconnect();
  }
}