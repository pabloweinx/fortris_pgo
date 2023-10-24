import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { AccountsService } from './accounts.service';
import { ExchangeRateService } from './exchange-rate.service';

@Injectable({
  providedIn: 'root'
})
export class ReactiveService {
  private socket!: io.Socket;

  constructor(
    private accountsService: AccountsService,
    private exchangeRateService: ExchangeRateService
  ) {
    this.initReactivity();
  }

/**
 * This method connects to all WebSocket events that we need from the server
 */
  initReactivity() {
    this.socket = io.connect('http://localhost:3000');
    this.socket.on("connect", () => console.log('connected to ws!'));
    this.socket.on('newExchangeRate', newExchangeRate => this.exchangeRateService.onExchangeRateUpdate(newExchangeRate));
    this.socket.on('accountBalanceUpdate', updatedAccount => this.accountsService.onAccountBalanceUpdate(updatedAccount));
    this.socket.on("disconnect", () => console.log('disconnected from ws.'));
  }

  disconnect() {
    this.socket.disconnect();
  }
}