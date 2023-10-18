import { Component, OnInit } from '@angular/core';
import { Observable, filter, map, switchMap } from 'rxjs';
import { Account } from 'src/app/interfaces/account';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-accounts-list-page',
  templateUrl: './accounts-list-page.component.html',
  styleUrls: ['./accounts-list-page.component.scss']
})
export class AccountsListPageComponent implements OnInit {

  accounts$!: Observable<Account[]>;

  constructor(
    private apiService: ApiService,
  ) {

  }
  ngOnInit(): void {
    this.accounts$ = this.apiService.getExchangeRate().pipe(
      switchMap(
        rate => this.apiService.getAccounts().pipe(
          map((accounts: any) =>
            accounts.map((account: Account) => this.transformObject(account, rate))
          )
        )
      )
    )
  }

  transformObject(account: Account, rate: number) {
    return {
      ...account,
      balance_btc: account.balance,
      available_balance_btc: account.available_balance,
      // We don't need to store in the db the values calculated in dollars
      balance_dollar: 235325,
      available_balance_dollar: 134324
    };
  }
}
