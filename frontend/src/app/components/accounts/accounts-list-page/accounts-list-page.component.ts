import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable, filter, map, switchMap, tap } from 'rxjs';
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
export class AccountsListPageComponent implements OnInit, OnDestroy {

  accounts$: Observable<Account[]> = this.accountService.accounts$;
  exchangeRateUpdate$: Observable<number> = this.exchangeRateService.exchangeRateUpdate$;
  displayedColumns: string[] = ['account_name', 'category', 'tags', 'balance', 'available_balance'];

  constructor(
    private apiService: ApiService,
    private accountService: AccountService,
    private exchangeRateService: ExchangeRateService,
    private reactiveService: ReactiveService,
    private router: Router
  ) {

  }
  ngOnInit(): void {
    this.reactiveService.initReactivity();

    // We'll store the db accounts to work with them when receiving socket updates
    this.setInitialData();

    // Preventing this observable to participate in the combineLatest op till it has a valid value (e. g, the one obtained in the setInitialData())
    this.exchangeRateService.exchangeRateUpdate$.pipe(
      filter(rate => rate !== 0)
    )
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
          map((accounts: any) =>
            accounts.map((account: Account) => this.accountService.transformAccount(account, rate)
            )
          )
        )
      )
    ).subscribe(accounts => {
      this.accountService.setInitialAccounts(accounts);
    });
  }

  onAnimationEnd(event: AnimationEvent, account: Account) {
    this.accountService.resetStates();
  }

  navigateToAccountDetail(account: Account) {
    this.router.navigate(['accounts', account._id]);
  }


  ngOnDestroy(): void {
    this.reactiveService.disconnect();
  }
}
