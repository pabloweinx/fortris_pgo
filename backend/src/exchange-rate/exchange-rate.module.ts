import { Module } from '@nestjs/common';
import { ExchangeRateController } from './exchange-rate.controller';
import { ExchangeRateService } from './exchange-rate.service';
import { WebsocketGateway } from 'src/gateways/websocket.gateway';
import { AccountsModule } from 'src/accounts/accounts.module';

@Module({
    imports: [AccountsModule],
    providers: [
        ExchangeRateService,
        WebsocketGateway
    ],
    controllers: [ExchangeRateController],
})
export class ExchangeRateModule { }