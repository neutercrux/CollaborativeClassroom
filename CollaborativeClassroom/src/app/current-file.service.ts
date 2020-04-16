import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrentFileService {

  // private currentOpenFileSource = new BehaviorSubject<[string,FileStatus]>(["",FileStatus.CREATE_FILE]);
  // currentOpenFile = this.currentOpenFileSource.asObservable();

  // constructor() { }

  // changeCurrentFile(currentOpenFile: [string,FileStatus])
  // {
  //   this.currentOpenFileSource.next(currentOpenFile)
  // }
}
