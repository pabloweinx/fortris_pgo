import { Module } from '@nestjs/common';
import { ExchangeRateController } from './exchange-rate.controller';

@Module({
    providers: [ExchangeRateController],
    controllers: [ExchangeRateController],
})
export class ExchangeRateModule { }