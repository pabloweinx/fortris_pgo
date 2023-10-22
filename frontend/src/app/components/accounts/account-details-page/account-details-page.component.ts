import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route } from '@angular/router';
import { Observable, iif, map, shareReplay, switchMap, tap } from 'rxjs';
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
  displayedColumns: string[] = ['confirmed_date', 'order_id', 'order_code', 'transaction_type', 'amount', 'balance'];

  constructor(
    private accountService: AccountService,
    private apiService: ApiService,
    private exchangeRateService: ExchangeRateService,
    private reactiveService: ReactiveService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.reactiveService.initReactivity();

    const accountId = this.route.snapshot.paramMap.get('id');
  
    if (accountId) {
      iif(
        () => !this.exchangeRateService.getCurrentRateValue() || this.exchangeRateService.getCurrentRateValue() === 0, 
        this.apiService.getExchangeRate().pipe(
          tap(rate => this.exchangeRateService.setInitialExchangeRate(rate))
        ),
        this.exchangeRateService.exchangeRateUpdate$
      ).pipe(
        switchMap(
          rate => {
            return this.accountService.getAccountDetail(accountId).pipe(
              map(account => this.accountService.transformAccount(account, rate))
            )
        }),
        shareReplay(1)
      ).subscribe(account => {
        this.accountService.setSelectedAccount(account);
      });
    }
  }

  // Función para traducir el tipo de transacción.
  getTransactionType(type: number): string {
    switch (type) {
      case 1: return 'Payment received';
      case 2: return 'Payment sent';
      default: return 'Unknown';
    }
  }
}
