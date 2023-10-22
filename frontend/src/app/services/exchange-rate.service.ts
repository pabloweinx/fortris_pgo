import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExchangeRateService {

  private _exchangeRateUpdateSubject = new BehaviorSubject<number>(0);
  public exchangeRateUpdate$ = this._exchangeRateUpdateSubject.asObservable();

  constructor() { }

  /**
   * This method is needed to feed the behaviour subject of the exchange rate
   * @param rate the initial exchange rate value
   */
  setInitialExchangeRate(rate: number){
    this._exchangeRateUpdateSubject.next(rate);
  }

  onExchangeRateUpdate(newExchangeRate: number) {
    this._exchangeRateUpdateSubject.next(newExchangeRate);
  }

  getCurrentRateValue(){
    return this._exchangeRateUpdateSubject.getValue();
  }
}
