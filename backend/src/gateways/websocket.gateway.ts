import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ExchangeRateService } from '../exchange-rate/exchange-rate.service';
import { AccountsService } from 'src/accounts/accounts.service';

@WebSocketGateway({ cors: true })
export class WebsocketGateway implements OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  private clients: Socket[] = [];
  private exchangeRateInterval;
  private accountUpdateInterval;

  constructor(
    private exchangeRateService: ExchangeRateService,
    private accountService: AccountsService
  ) { }

  afterInit() {
    this.sendExchangeRatePeriodically();
    this.sendAccountUpdatePeriodically();
  }

  handleConnection(client: Socket) {
    this.clients.push(client);
  }

  sendExchangeRatePeriodically() {
    console.log('sendExchangeRatePeriodically');
    this.exchangeRateInterval = setInterval(() => {
      const newExchangeRate = this.exchangeRateService.calculateNewExchangeRate();
      this.server.emit('newExchangeRate', newExchangeRate);
    }, 30000); // @TODO: set as env global
  }

  /**
   * This method will send via websocket a balance-updated account
   */
  async sendAccountUpdatePeriodically() {
    this.accountUpdateInterval = setInterval(async () => {
      const updatedAccount = await this.accountService.randomlyUpdateAccountBalance();
      this.server.emit('updatedAccount', updatedAccount);
      this.sendAccountBalanceUpdate(updatedAccount);

    }, Math.floor(Math.random() * (40000 - 20000 + 1) + 20000)); // Random interval between 20 and 40 seconds
  }

  sendAccountBalanceUpdate(updatedAccount: any): void {
    this.clients.forEach(client => client.emit('accountBalanceUpdate', updatedAccount));
  }

  handleDisconnect(client: Socket) {
    // @TODO: temporary not disconnecting to prevent restarting nest everytime
    /* this.clients = this.clients.filter(c => c.id !== client.id);

    if (this.clients.length === 0) {
      clearInterval(this.exchangeRateInterval);
      clearInterval(this.accountUpdateInterval);
    } */
  }

}