import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  socket:any 

  constructor() {
    this.socket = io("ws://localhost:3000")
    console.log(this.socket)
   }

   listen(eventName:string){
     return new Observable((subscriber) => {
        this.socket.on(eventName,(data)=>{
          subscriber.next(data)
          console.log(data)
        })
     });
   }
   emit(eventName:string,data:any){
     this.socket.emit(eventName,data)
   }
}
