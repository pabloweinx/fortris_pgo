import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, filter, forkJoin, map, merge, switchMap, withLatestFrom } from 'rxjs';
import { Account } from 'src/app/interfaces/account.interface';
import { AccountsService } from 'src/app/services/accounts.service';
import { ApiService } from 'src/app/services/api.service';
import { ExchangeRateService } from 'src/app/services/exchange-rate.service';
import { ReactiveService } from 'src/app/services/reactive.service';

@Component({
  selector: 'app-account-details-page',
  templateUrl: './account-details-page.component.html',
  styleUrls: ['./account-details-page.component.scss']
})
export class AccountDetailsPageComponent implements OnInit {

  selectedAccount$: Observable<Account | null> = this.accountsService.selectedAccount$;
  displayedColumns: string[] = ['confirmed_date', 'order_id', 'order_code', 'transaction_type', 'debit', 'credit', 'balance'];

  constructor(
    private accountsService: AccountsService,
    private apiService: ApiService,
    private exchangeRateService: ExchangeRateService,
    private reactiveService: ReactiveService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const accountId = this.route.snapshot.paramMap.get('id');

    if (accountId) {
      this.accountsService.getAccountDetail(accountId).subscribe();

      this.apiService.getExchangeRate().subscribe(rate => {
        this.exchangeRateService.onExchangeRateUpdate(rate);
      });

      this.selectedAccount$ = this.mergeSelectedAccountObservables(accountId);
    }
  }

  /**
   * This function merges multiple observables related to selected account for the detail page
   * and returns an observable that emits the merged account data.
   * @param {string} id - The account id 
   * @returns an Observable of type `Account | null`.
   */
  private mergeSelectedAccountObservables(id: string): Observable<Account | null> {
    return merge(
      this.accountsService.selectedAccount$.pipe(
        filter(account => account !== null && account._id === id)
      ),
      this.accountsService.accountBalanceUpdate$.pipe(
        filter(update => update !== null && update._id === id),
        map(update => {
          const currentAccount = this.accountsService.getCurrentSelectedAccount();
          return currentAccount ? ({ ...currentAccount, ...update }) : update;
        })
      ),
      this.exchangeRateService.exchangeRateUpdate$.pipe(
        withLatestFrom(this.accountsService.selectedAccount$),
        map(([rate, account]) => {
          if (account && account._id === id) {
            return this.accountsService.transformAccount(account, rate);
          }
          return account;
        }),
        filter(account => account !== null)
      )
    );
  }

  /**
   * This method calls the `resetState` method to remove the transient state
   * that represents an account balance update
   */
  onAnimationEnd() {
    this.accountsService.resetState();
  }


  /**
   * This function translates the type of transaction to a human-readable text
   */
  getTransactionType(type: number): string {
    switch (type) {
      case 1: return 'Payment received';
      case 2: return 'Payment sent';
      default: return 'Unknown';
    }
  }

  goBack() {
    this.router.navigate(['/accounts']);
  }
}
