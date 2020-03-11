import { Component, Input, OnInit } from '@angular/core';
import { CurrentFileService } from '../current-file.service';
import { File } from '../file';
import { CodeService } from '../code.service';

@Component({
  selector: 'app-file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.css']
})
export class FileExplorerComponent implements OnInit {

  private files: string[] = [];
  @Input() private isStudent: boolean;
  private currentFile: string;
  constructor(private code: CodeService,private _currentFile: CurrentFileService) { }

  ngOnInit() {
    this._currentFile.currentOpenFile.subscribe(currentOpenFile => this.currentFile = currentOpenFile);
    if(this.isStudent)
    {
      this.code.messages.subscribe(msg => {
        console.log(msg);
        this.addFile(msg.filename);
      })
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
  }



  addFile(filename: string)
  {
    if(this.files.find(element => element == filename)==undefined)
    {
      console.log("adding new file " + filename);
      this.files.push(filename);
    }
  }

  changeCurrFile(file: string)
  {
    this._currentFile.changeCurrentFile(file);
  }
}
