import { Component, Input, OnInit } from '@angular/core';
import { CurrentFileService } from '../current-file.service';
import { File } from '../file';

@Component({
  selector: 'app-file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.css']
})
export class FileExplorerComponent implements OnInit {

  private files: string[] = [];
  @Input() private isStudent: boolean;
  private currentFile: string;
  constructor(private _currentFile: CurrentFileService) { }

  ngOnInit() {
    this._currentFile.currentOpenFile.subscribe(currentOpenFile => this.currentFile = currentOpenFile);
    if(this.isStudent)
    {

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
