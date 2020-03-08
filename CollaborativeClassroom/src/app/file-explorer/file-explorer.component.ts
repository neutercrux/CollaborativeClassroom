import { Component, Input, OnInit } from '@angular/core';
import { CurrentFileService } from '../current-file.service';
import { Subscription } from 'rxjs';
import { NgxPubSubService } from '@pscoped/ngx-pub-sub';
import { File } from '../file';

@Component({
  selector: 'app-file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.css']
})
export class FileExplorerComponent implements OnInit {

  private files: string[] = [];
  subscription1: Subscription;
  @Input() private isStudent: boolean;
  private currentFile: string;
  constructor(private pubsub: NgxPubSubService,private _currentFile: CurrentFileService) { }

  ngOnInit() {
    this._currentFile.currentOpenFile.subscribe(currentOpenFile => this.currentFile = currentOpenFile);
    if(this.isStudent)
    {
      this.subscription1 = this.pubsub.subscribe('randomLast',data => this.addFile(data));
    }
    else
    {
      this.files.push("New File");
      this.files.push("file1");
      this.files.push("file2");
      this.files.push("file3");
    }
  }

  ngOnDestroy() {
    this.subscription1.unsubscribe();
  }



  addFile(file: File)
  {
    if(this.files.find(element => element == file.name)==undefined)
    {
      console.log("adding new file " + file.name);
      this.files.push(file.name);
    }
  }

  changeCurrFile(file: string)
  {
    this._currentFile.changeCurrentFile(file);
  }
}
