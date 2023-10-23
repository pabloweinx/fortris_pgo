import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { Observable, filter, iif, map, merge, shareReplay, switchMap, tap, withLatestFrom } from 'rxjs';
import { Account } from 'src/app/interfaces/account.interface';
import { AccountService } from 'src/app/services/account.service';
import { ApiService } from 'src/app/services/api.service';
import { ExchangeRateService } from 'src/app/services/exchange-rate.service';
import { ReactiveService } from 'src/app/services/reactive.service';

@Component({
  selector: 'app-account-details-page',
  templateUrl: './account-details-page.component.html',
  styleUrls: ['./account-details-page.component.scss']
})
export class AccountDetailsPageComponent implements OnInit {

  selectedAccount$: Observable<Account | null> = this.accountService.selectedAccount$;
  exchangeRateUpdate$ = this.exchangeRateService.exchangeRateUpdate$;
  displayedColumns: string[] = ['confirmed_date', 'order_id', 'order_code', 'transaction_type', 'debit', 'credit', 'balance'];

  constructor(
    private accountService: AccountService,
    private apiService: ApiService,
    private exchangeRateService: ExchangeRateService,
    private reactiveService: ReactiveService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const accountId = this.route.snapshot.paramMap.get('id');

    if (accountId) {
      this.accountService.getAccountDetail(accountId).subscribe();
      this.selectedAccount$ = this.mergeSelectedAccountObservables(accountId);
    }
  }

  private mergeSelectedAccountObservables(accountId: string): Observable<Account | null> {
    return merge(
      this.accountService.selectedAccount$.pipe(
        filter(account => account !== null && account._id === accountId)
      ),
      this.accountService.accountBalanceUpdate$.pipe(
        filter(update => update !== null && update._id === accountId),
        map(update => {
          const currentAccount = this.accountService.getCurrentSelectedAccount();
          return currentAccount ? ({ ...currentAccount, ...update }) : update;
        })
      ),
      this.exchangeRateService.exchangeRateUpdate$.pipe(
        withLatestFrom(this.accountService.selectedAccount$),
        map(([rate, account]) => {
          if (account && account._id === accountId) {
            return this.accountService.transformAccount(account, rate);
          }
          return account;
        }),
        filter(account => account !== null)
      )
    );
  }

  onAnimationEnd() {
    this.accountService.resetState();
  }

  // Function to translate the type of transaction.
  getTransactionType(type: number): string {
    switch (type) {
      case 1: return 'Payment received';
      case 2: return 'Payment sent';
      default: return 'Unknown';
    }
  }
}
