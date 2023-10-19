import { Module } from '@nestjs/common';
import { ExchangeRateController } from './exchange-rate.controller';
import { ExchangeRateService } from './exchange-rate.service';
import { ExchangeRateGateway } from './exchange-rate.gateway';

@Module({
    providers: [
        ExchangeRateService,
        ExchangeRateGateway
    ],
    controllers: [ExchangeRateController],
})
export class ExchangeRateModule { }