import { OnGatewayDisconnect, OnGatewayInit, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ExchangeRateService } from './exchange-rate.service';

@WebSocketGateway()
export class ExchangeRateGateway implements OnGatewayInit, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private exchangeRateService: ExchangeRateService) { }

  afterInit(server: Server) {
    this.sendExchangeRatePeriodically();
  }

  sendExchangeRatePeriodically() {
    console.log('sendExchangeRatePeriodically');
    setInterval(() => {
      const newExchangeRate = this.exchangeRateService.calculateNewExchangeRate();
      this.server.emit('newExchangeRate', newExchangeRate);
    }, 5000); // @TODO: set as env global
  }

  handleDisconnect(client: any) {
    throw new Error('Method not implemented.');
  }
  
}