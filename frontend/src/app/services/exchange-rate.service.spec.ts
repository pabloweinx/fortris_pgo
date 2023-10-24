import { TestBed } from '@angular/core/testing';

import { ExchangeRateService } from './exchange-rate.service';

describe('ExchangeRateService', () => {
  let service: ExchangeRateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExchangeRateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set initial exchange rate correctly', () => {
    const initialRate = 1.2;
    service.setInitialExchangeRate(initialRate);

    service.exchangeRateUpdate$.subscribe(rate => {
      expect(rate).toEqual(initialRate);
    });
  });
});
