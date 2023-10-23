import { Injectable } from '@angular/core';
import { Observable, Subject, combineLatest, filter, map, shareReplay, tap } from 'rxjs';
import * as io from 'socket.io-client';
import { Account } from '../interfaces/account.interface';
import { AccountService } from './account.service';
import { ExchangeRateService } from './exchange-rate.service';

@Injectable({
  providedIn: 'root'
})
export class ReactiveService {
  private socket!: io.Socket;

  constructor(
    private accountService: AccountService,
    private exchangeRateService: ExchangeRateService
  ) {
    this.initReactivity();
  }

  initReactivity() {
    this.socket = io.connect('http://localhost:3000');
    this.socket.on("connect", () => console.log('connected to ws!'));
    this.socket.on('newExchangeRate', newExchangeRate => this.exchangeRateService.onExchangeRateUpdate(newExchangeRate));
    this.socket.on('accountBalanceUpdate', updatedAccount => this.accountService.onAccountBalanceUpdate(updatedAccount));
    this.socket.on("disconnect", () => console.log('disconnected from ws.'));
  }

  disconnect() {
    this.socket.disconnect();
  }
}