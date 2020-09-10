import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private url = 'http://localhost:3000/';
  private socket;

  constructor() {
    this.socket = io(this.url);
   }
  public sendTeacherLocation(filename,row) {
    this.socket.emit('teacher-location', {'filename':filename,'row':row});
  }

  public getTeacherLocation = () => {
    return Observable.create((observer) => {
        this.socket.on('teacher-location', (message) => {
            observer.next(message);
      });
    });
  }

  public sendStudentLocationRange(usn,filename, startRow, endRow)
  {
    this.socket.emit('feedback', {'usn':usn, 'filename':filename, 'startRow':startRow,'endRow':endRow});
  }

  public getFeedback = () => {
    return Observable.create((observer) => {
        this.socket.on('feedback', (message) => {
            observer.next(message);
      });
    });
  }

}
