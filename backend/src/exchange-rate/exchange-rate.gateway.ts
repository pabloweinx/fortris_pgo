import { OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class ExchangeRateGateway implements OnGatewayInit {
  afterInit(server: any) {
    throw new Error('Method not implemented.');
  }
  @WebSocketServer()
  server: Server;

  sendExchangeRate(rate: number) {
    this.server.emit('newRate', rate);
  }
}