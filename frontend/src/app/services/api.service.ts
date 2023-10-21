import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Account } from '../interfaces/account';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient) { }

  getAccounts(): Observable<Account[]> {
    return this.httpClient.get<Account[]>(environment.API_URL + '/accounts');
  }

  getAccount(id: number) {
    return this.httpClient.get(environment.API_URL + '/accounts/' + id);
  }

  getExchangeRate(): Observable<number | any>{
    return this.httpClient.get(environment.API_URL + '/exchange-rate');
  }
}
