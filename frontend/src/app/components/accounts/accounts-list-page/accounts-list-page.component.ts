import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, combineLatest, combineLatestWith, filter, forkJoin, map, switchMap, tap } from 'rxjs';
import { Account } from 'src/app/interfaces/account';
import { ApiService } from 'src/app/services/api.service';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-accounts-list-page',
  templateUrl: './accounts-list-page.component.html',
  styleUrls: ['./accounts-list-page.component.scss']
})
export class AccountsListPageComponent implements OnInit, OnDestroy {

  accounts$!: Observable<Account[]>;
  accountsData$: Observable<Account[]> = this.socketService.accountsData$;
  accountBalanceUpdate$: Observable<Account[]> = this.socketService.accountBalanceUpdate$;
  exchangeRateUpdate$: Observable<number> = this.socketService.exchangeRateUpdate$;

  constructor(
    private apiService: ApiService,
    private socketService: SocketService
  ) {

  }
  ngOnInit(): void {

    // We'll store the db accounts to work with them when receiving socket updates
    this.setInitialData();

    // Preventing this observable to participate in the combineLatest op till it has a valid value (e. g, the one obtained in the setInitialData())
    this.exchangeRateUpdate$.pipe(
      filter(rate => rate !== 0)
    )

    this.accounts$ = combineLatest([this.accountsData$, this.accountBalanceUpdate$, this.exchangeRateUpdate$]).pipe(
      map(([accountsData, accountBalanceUpdate, exchangeRateUpdate]) => {
        // First, we apply the Exchange Rate to the accounts
        const accountsWithUpdatedExchangeRate = accountsData.map((account: Account) => {
          const updatedBalance = account.balance * exchangeRateUpdate;
          return { ...account, balance: updatedBalance };
        });

        // Then, we apply balance update and recalculate everything
        return accountsWithUpdatedExchangeRate.map((account: Account) => {
          const update = accountBalanceUpdate.find(updatedAccount => updatedAccount._id === account._id);
          return update ? this.transformAccount({ ...account, ...update }, exchangeRateUpdate) : account;
        });        
      })
    );
  }

  /**
   * This method makes a first request for getting the value of the current exchange rate so then
   * we can get the accounts with all its fields calculated. It adds more stability and freshness
   * since the beginning of the app execution.
   */
  setInitialData() {
    this.apiService.getExchangeRate().pipe(
      tap(rate => this.socketService.setInitialExchangeRate(rate)),
      switchMap(
        rate => this.apiService.getAccounts().pipe(
          map((accounts: any) =>
            accounts.map((account: Account) => this.transformAccount(account, rate)
            )
          )
        )
      )
    ).subscribe(accounts => {
      this.socketService.setInitialAccounts(accounts);
    });
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

  ngOnDestroy(): void {
    this.socketService.disconnect();
  }
}
