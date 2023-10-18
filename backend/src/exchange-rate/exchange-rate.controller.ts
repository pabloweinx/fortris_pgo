import { Controller, Get } from '@nestjs/common';

@Controller('exchange-rate')
export class ExchangeRateController {
    @Get()
    getExchangeRate(): number {
        return Math.floor(Math.random() * (12000 - 5000 + 1) + 5000);
    }
}