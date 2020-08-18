import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JoinService {

  private url = 'http://localhost:3000/';
  private socket;

  constructor() {
    this.socket = io(this.url);
   }
  public sendDetails(usn,designation) {
    this.socket.emit('join', {'usn':usn,'designation':designation});
  }

  // public getMessages = () => {
  //   return Observable.create((observer) => {
  //       this.socket.on('join', (message) => {
  //           observer.next(message);
  //     });
  //   });
  // }
}
