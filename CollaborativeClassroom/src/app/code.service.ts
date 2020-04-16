import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { File } from './file';

@Injectable({
  providedIn: 'root'
})
export class CodeService {

  messages: Subject<any>;

  // Our constructor calls our wsService connect method
  constructor(private wsService: WebsocketService) {
    this.messages = <Subject<any>>wsService
      .connect()
      .pipe(map((response: any): any => {
        return response;
      }))
   }

  // Our simplified interface for sending
  // messages back to our socket.io server
  sendFile(code: any) {
    this.messages.next(code);
  }

}