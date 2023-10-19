import { Controller, Get } from '@nestjs/common';
import { ExchangeRateService } from './exchange-rate.service';

@Controller('exchange-rate')
export class ExchangeRateController {

    constructor(
        private exchangeRateService: ExchangeRateService
    ) { }

    @Get()
    getExchangeRate(): number {
        return this.exchangeRateService.calculateNewExchangeRate();
    }
}