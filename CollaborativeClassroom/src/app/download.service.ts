import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export const enum DownloadStatus {
  Done = 0,
  Start = 1
}

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  private DownloadCallSource = new BehaviorSubject<DownloadStatus>(DownloadStatus.Done);
  currentDownloadStatus = this.DownloadCallSource.asObservable();

  constructor() { }

  changeDownloadStatus(currentDownloadStatus: DownloadStatus)
  {
    this.DownloadCallSource.next(currentDownloadStatus)
  }
}
