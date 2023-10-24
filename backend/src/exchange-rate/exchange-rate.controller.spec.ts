import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeRateController } from './exchange-rate.controller';
import { ExchangeRateService } from './exchange-rate.service';

describe('ExchangeRateController', () => {
  let controller: ExchangeRateController;
  let mockExchangeRateService = {
    calculateNewExchangeRate: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExchangeRateController],
      providers: [
        { provide: ExchangeRateService, useValue: mockExchangeRateService }
      ]
    }).compile();

    controller = module.get<ExchangeRateController>(ExchangeRateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get a new exchange rate', () => {
    const mockRate = 1.23;
    mockExchangeRateService.calculateNewExchangeRate.mockReturnValue(mockRate);

    expect(controller.getExchangeRate()).toBe(mockRate);
    expect(mockExchangeRateService.calculateNewExchangeRate).toHaveBeenCalled();
  });

});
