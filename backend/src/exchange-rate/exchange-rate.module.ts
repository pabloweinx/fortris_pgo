import { Module } from '@nestjs/common';
import { ExchangeRateController } from './exchange-rate.controller';
import { ExchangeRateService } from './exchange-rate.service';

@Module({
    providers: [ExchangeRateService],
    controllers: [ExchangeRateController],
})
export class ExchangeRateModule { }