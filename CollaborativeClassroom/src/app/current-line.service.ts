import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrentLineService {

  private currentLineSource = new BehaviorSubject<number>(0);
  currentLine = this.currentLineSource.asObservable();

  constructor() { }

  changeCurrentLine(currentLine: number)
  {
    this.currentLineSource.next(currentLine);
  }
}