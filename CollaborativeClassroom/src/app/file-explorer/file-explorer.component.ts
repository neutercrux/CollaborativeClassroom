import { Component, OnInit } from '@angular/core';
//import { NgxPubSubService } from '@pscoped/ngx-pub-sub';
import { Subscription } from 'rxjs';
import { CurrentFileService } from '../current-file.service';

@Component({
  selector: 'app-file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.css']
})
export class FileExplorerComponent implements OnInit {

  //subscription1: Subscription;
  private files: string[] = [];
  //private codeString;
  private currentFile: string;
  constructor(/* private pubSub: NgxPubSubService,*/ private _currentFile: CurrentFileService) { }

  ngOnInit() {
    this._currentFile.currentOpenFile.subscribe(currentOpenFile => this.currentFile = currentOpenFile)
    this.files.push("New File");
    this.files.push("file1");
    this.files.push("file2");
    this.files.push("file3");
    // this.subscription1 = this.pubSub.subscribe('randomLast',
    //                             data => this.codeString = data);
  }

  ngOnDestroy() {
    //this.subscription1.unsubscribe();
  }

  addFile(file: string)
  {
    this.files.push(file);
  }

  changeCurrFile(file: string)
  {
    //console.log(file);
    this._currentFile.changeCurrentFile(file);
  }
}
