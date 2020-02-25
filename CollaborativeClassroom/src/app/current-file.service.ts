import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrentFileService {

  private currentOpenFileSource = new BehaviorSubject<string>("New File");
  currentOpenFile = this.currentOpenFileSource.asObservable();

  constructor() { }

  changeCurrentFile(currentOpenFile: string)
  {
    this.currentOpenFileSource.next(currentOpenFile)
  }
}
