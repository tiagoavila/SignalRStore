import { Injectable } from '@angular/core';
import * as signalR from "@aspnet/signalr";
import { Subject } from 'rxjs';
import { ProductModel } from '../models/product-model';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: signalR.HubConnection;

  public bradcastedNumber: ProductModel;

  public productSubject = new Subject<ProductModel>();

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

  public addProductQuantityAvailableListener = (productId: any) => {
    //broadcastnumberchannel is the name of the method on the server
    let methodName = 'ProductStock-' + productId;

    this.hubConnection.on(methodName, (data) => {
      this.productSubject.next(data as ProductModel);
    })
  }
}
