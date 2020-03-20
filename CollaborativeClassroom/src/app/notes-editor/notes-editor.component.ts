import { Component, OnInit } from '@angular/core';
import { CurrentLineService } from '../current-line.service';
import { Note } from '../note';

@Component({
  selector: 'app-notes-editor',
  templateUrl: './notes-editor.component.html',
  styleUrls: ['./notes-editor.component.css']
})
export class NotesEditorComponent implements OnInit {

  private notes: Note[] = [];
  private lineNumber: number;

  constructor(private _currentFile: CurrentLineService) { }

  ngOnInit() {}
  
  ngAfterViewInit () {
    this._currentFile.currentLine.subscribe(currentLine=>{this.lineNumber = currentLine});
  }

  addNote(text: string, lineNumber: string)
  {
    console.log(parseInt(lineNumber));
    var temp;
    if(parseInt(lineNumber)==NaN)
    {
      temp = new Note(text,this.lineNumber);
    }
    else
    {
      temp = new Note(text,parseInt(lineNumber));
    }
    this.notes.push(temp);
    console.log(this.notes);
  }

}