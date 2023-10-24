import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeRateService } from './exchange-rate.service';

describe('ExchangeRateService', () => {
  let service: ExchangeRateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExchangeRateService],
    }).compile();

    service = module.get<ExchangeRateService>(ExchangeRateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should calculate an exchange rate within the expected range', () => {
    const rate = service.calculateNewExchangeRate();
    expect(rate).toBeGreaterThanOrEqual(5000);
    expect(rate).toBeLessThanOrEqual(12000);
  });
});
