import { Component, Input, OnInit } from '@angular/core';
import { CurrentFileService } from '../current-file.service';
import { CodeService } from '../code.service';
import { FileDialogComponent } from '../file-dialog/file-dialog.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.css']
})
export class FileExplorerComponent implements OnInit {

  public files: string[] = [];
  @Input() private isStudent: boolean;
  private currentFile: string;
  constructor(public dialog: MatDialog, private code: CodeService,private _currentFile: CurrentFileService) { }

  ngOnInit() {
    this._currentFile.currentOpenFile.subscribe(currentOpenFile => this.currentFile = currentOpenFile);
    if(this.isStudent)
    {
      this.code.messages.subscribe(msg => {
        msg = JSON.parse(msg);
        this.addFile(msg.filename);
      })
    }
  }

  ngOnDestroy() {
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(FileDialogComponent, {
      height: '300px',
      width: '600px',
      data: ""
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(result!=undefined)
        this.addFile(result)
    });
  }

  editFileDialog(filename: string): void
  {

    const dialogRef = this.dialog.open(FileDialogComponent, {
      height: '300px',
      width: '600px',
      data: filename
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      let x = this.files.find(element => element == filename)
      x = result
    });
  }


  addFile(filename: string)
  {
    if((this.files.length==0)&&(this.isStudent))
    {
      console.log("adding new file " + filename);
      this.files.push(filename);
      this.changeCurrFile(filename);
    }
    if((this.files.find(element => element == filename)==undefined)&&(filename!=""))
    {
      console.log("adding new file " + filename);
      this.files.push(filename);
      if(!this.isStudent)
      {
        this.changeCurrFile(filename);
      }
    }
  }

  changeCurrFile(file: string)
  {
    this.currentFile = file;
    this._currentFile.changeCurrentFile(file);
  }
}
