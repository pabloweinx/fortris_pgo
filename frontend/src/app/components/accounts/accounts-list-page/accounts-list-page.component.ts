import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable, combineLatest, debounceTime, filter, map, merge, shareReplay, startWith, switchMap, tap, withLatestFrom } from 'rxjs';
import { Account } from 'src/app/interfaces/account.interface';
import { AccountService } from 'src/app/services/account.service';
import { ApiService } from 'src/app/services/api.service';
import { ExchangeRateService } from 'src/app/services/exchange-rate.service';
import { ReactiveService } from 'src/app/services/reactive.service';

@Component({
  selector: 'app-accounts-list-page',
  templateUrl: './accounts-list-page.component.html',
  styleUrls: ['./accounts-list-page.component.scss']
})
export class AccountsListPageComponent implements OnInit {

  accounts$: Observable<Account[]> = this.accountService.accounts$;
  exchangeRateUpdate$: Observable<number> = this.exchangeRateService.exchangeRateUpdate$;
  displayedColumns: string[] = ['account_name', 'category', 'tags', 'balance', 'available_balance'];
  isAnimating!: boolean;

  constructor(
    private apiService: ApiService,
    private accountService: AccountService,
    private exchangeRateService: ExchangeRateService,
    private reactiveService: ReactiveService,
    private router: Router
  ) {

  }
  ngOnInit(): void {
    // We'll store the db accounts to work with them when receiving socket updates
    this.setInitialData();

    // Observable for initial accounts.
    const initialAccounts$ = this.accountService.accounts$.pipe(
      withLatestFrom(this.exchangeRateService.exchangeRateUpdate$),
      map(([accountsData, exchangeRateUpdate]) => {
        return accountsData.map((account: Account) => {
          const updatedBalance = account.balance * exchangeRateUpdate;
          return { ...account, balance: updatedBalance };
        });
      }),
    );

    const accountUpdates$ = this.accountService.accountBalanceUpdate$.pipe(
      withLatestFrom(this.accountService.accounts$, this.exchangeRateService.exchangeRateUpdate$),
      map(([accountBalanceUpdate, accountsData, exchangeRateUpdate]) => {
        return accountsData.map((account: Account) => {
          if (accountBalanceUpdate && accountBalanceUpdate._id === account._id) {
            return this.accountService.transformAccount({ ...account, ...accountBalanceUpdate }, exchangeRateUpdate);
          }
          return account;
        });
      }),
    );

    // exchange rate update
    const exchangeRateUpdates$ = this.exchangeRateService.exchangeRateUpdate$.pipe(
      withLatestFrom(this.accountService.accounts$),
      map(([exchangeRateUpdate, accountsData]) => {
        return accountsData.map((account: Account) => {
          const updatedBalance = account.balance * exchangeRateUpdate;
          return { ...account, balance: updatedBalance };
        });
      }),
    );

    // Fuse the initial accounts with updates
    this.accounts$ = merge(initialAccounts$, accountUpdates$, exchangeRateUpdates$).pipe(
      shareReplay(1)
    );
  }

  /**
   * This method makes a first request for getting the value of the current exchange rate so then
   * we can get the accounts with all its fields calculated. It adds more stability and freshness
   * since the beginning of the app execution.
   */
  setInitialData() {
    this.apiService.getExchangeRate().pipe(
      tap(rate => this.exchangeRateService.setInitialExchangeRate(rate)),
      switchMap(
        rate => this.apiService.getAccounts().pipe(
          map((accounts: Account[]) =>
            accounts.map((account: Account) => this.accountService.transformAccount(account, rate)
            )
          )
        )
      )
    ).subscribe(accounts => {
      this.accountService.updateAccounts(accounts);
    });
  }

  onAnimationEnd() {
    this.accountService.resetState();
  }

  navigateToAccountDetail(account: Account) {
    this.router.navigate(['accounts', account._id]);
  }
}
