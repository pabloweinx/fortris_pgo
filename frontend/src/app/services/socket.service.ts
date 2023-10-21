import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import * as io from 'socket.io-client';
import { Account } from '../interfaces/account';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: io.Socket;

  private accountsDataSubject = new BehaviorSubject<Account[]>([]);
  accountsData$ = this.accountsDataSubject.asObservable();

  private accountBalanceUpdateSubject = new BehaviorSubject<Account[]>([]);
  accountBalanceUpdate$ = this.accountBalanceUpdateSubject.asObservable();

  private exchangeRateUpdateSubject = new BehaviorSubject<number>(0);
  exchangeRateUpdate$ = this.exchangeRateUpdateSubject.asObservable();

  constructor() {
    this.socket = io.connect('http://localhost:3000');
    this.socket.on("connect", () => console.log('connected to ws!'));
    this.socket.on('newExchangeRate', newExchangeRate => this.onExchangeRateUpdate(newExchangeRate));
    this.socket.on('accountBalanceUpdate', updatedAccount => this.onAccountBalanceUpdate(updatedAccount));
    this.socket.on("disconnect", () => console.log('disconnected from ws.'));
  }

  onExchangeRateUpdate(newExchangeRate: number) {
    this.exchangeRateUpdateSubject.next(newExchangeRate);
  }

  onAccountBalanceUpdate(updatedAccount: Account) {
    // Aquí recibes una sola cuenta actualizada, la gestionas y la añades a accountsStateUpdates$
    const currentUpdates = this.accountBalanceUpdateSubject.getValue();
    const indexToUpdate = currentUpdates.findIndex(account => account._id === updatedAccount._id);

    if (indexToUpdate !== -1) {
      currentUpdates[indexToUpdate] = updatedAccount;
    } else {
      currentUpdates.push(updatedAccount);
    }

    this.accountBalanceUpdateSubject.next(currentUpdates);
  }

  /**
   * This method is needed to feed the behaviour subject of the accounts to work with them more efficiently
   * @param accounts the array of accounts
   */
  setInitialAccounts(accounts: Account[]): void {
    this.accountsDataSubject.next(accounts);
  }

  /**
   * This method is needed to feed the behaviour subject of the exchange rate
   * @param rate the initial exchange rate value
   */
  setInitialExchangeRate(rate: number){
    this.exchangeRateUpdateSubject.next(rate);
  }

  disconnect() {
    this.socket.disconnect();
  }
}