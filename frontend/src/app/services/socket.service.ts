import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: io.Socket;

  constructor() {
    this.socket = io.connect('http://localhost:3000');

    this.socket.on("connect", () => {
      console.log('connected to ws!');
    });

    this.socket.on("disconnect", () => {
      console.log('disconnected from ws.');
    });
  }

  getExchangeRate(): Observable<number> {
    return new Observable(observer => {
      this.socket.on('newExchangeRate', (rate: number) => {
        observer.next(rate);
      });
    });
  }

  disconnect(){
    this.socket.disconnect();
  }
}