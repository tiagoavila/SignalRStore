import { Injectable } from '@angular/core';
import * as signalR from "@aspnet/signalr";
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: signalR.HubConnection;

  public bradcastedNumber: Number;

  message = new Subject<number>();

  constructor() { }

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:63059/producthub')
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err))
  }

  public broadcastNumber = (number: Number) => {
    this.hubConnection.invoke('broadcastnumber', number) //broadcastnumber is the method name on the server
      .catch(err => console.error(err));
  }

  public addBroadcastNumberListener = () => {
    //broadcastnumberchannel is the name of the method on the server
    this.hubConnection.on('broadcastnumberchannel', (data) => {
      this.bradcastedNumber = data;
      console.log(data);
    })
  }

  public addProductQuantityAvailableListener = (productId: any) => {
    //broadcastnumberchannel is the name of the method on the server
    let methodName = 'ProductStock-' + productId;

    this.hubConnection.on(methodName, (data) => {
      this.bradcastedNumber = data;
      console.log("Update quantity for product " + productId + " is: " + data);
    })
  }
}
