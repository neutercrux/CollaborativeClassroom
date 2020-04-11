import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class DoubtService {

  private url = 'http://localhost:3000';
  private socket;

  constructor() {
    this.socket = io(this.url);
   }
   public sendMessage(message,name,designation,qno) {
    this.socket.emit('new-doubt', {'message':message,'name':name,'designation':designation,'qno':qno});
  }

  public getMessages = () => {
    return Observable.create((observer) => {
        this.socket.on('new-doubt', (message) => {
            observer.next(message);
      });
    });
  }
}
