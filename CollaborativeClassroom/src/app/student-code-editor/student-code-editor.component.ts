import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CodeEditorService } from '../code-editor.service';
import * as ace from 'ace-builds';
import { THEMES } from '../themes';
import { File, FileStatus } from '../file';
import { Status } from '../message';
import { Note } from '../note';
import { FileNoteMap } from '../filenotemap';
import { CurrentFileService } from '../current-file.service';
import { DiffMatchPatch, DiffOp } from '../ng-diff-match-patch';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';

import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-csharp';
import 'ace-builds/src-noconflict/mode-ruby';
import 'ace-builds/src-noconflict/mode-php';
import 'ace-builds/src-noconflict/mode-c_cpp';

import 'ace-builds/src-noconflict/theme-clouds_midnight';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-iplastic';

import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-beautify';
import 'brace/theme/monokai';
import 'brace/mode/html';
import 'brace/mode/javascript';
import 'brace/mode/text';
import { WebsocketService } from '../websocket.service';
import { JoinService } from '../join.service';
import { CodeService } from '../code.service';
import { element } from 'protractor';
import { NoteDialogComponent } from '../note-dialog/note-dialog.component';
import { DownloadService, DownloadStatus } from '../download.service';
import { ILanguage,LANGUAGES} from '../language';
import { LocationService } from '../location.service';

@Component({
  selector: 'app-student-code-editor',
  templateUrl: './student-code-editor.component.html',
  styleUrls: ['./student-code-editor.component.css']
})
export class StudentCodeEditorComponent implements OnInit {

  public codeEditor: ace.Ace.Editor;
  public themes = THEMES;
  public files: File[] = [];
  public notes: Note[] = [];
  public fileNoteMap: FileNoteMap[] = [];
  public currentFile: string = "";
  public langArray: ILanguage[] = LANGUAGES;
  public langComments: string[] = [];
  public outputString: string = "";
  public teacherLocation: string = "";
  private usn:String = sessionStorage.getItem("name");;
  private designation:String = sessionStorage.getItem("designation");
  @ViewChild('codeEditor',{static: false}) private codeEditorElmRef: ElementRef;
  response: any;
  currentLine: number;
  totalCodeLength: number;
  lineTimer;
  public lang: string = "c_cpp";

  constructor(private _locationService: LocationService, private joinService: JoinService,private _download : DownloadService,public dialog: MatDialog, private _diff: DiffMatchPatch,private code: CodeService, private _codeEditorService:CodeEditorService, private _currentFile: CurrentFileService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.initializeEditor();
    this._download.currentDownloadStatus.subscribe();
    this.lineTimer = setInterval(()=>{ 
      this.changeCurrentLine()
    }, 1000);
    this.joinService.sendDetails(this.usn, this.designation);
    this.code.messages.subscribe(msg => {
      msg = JSON.parse(msg);
      this.fileOperations(msg);
    })
    this._locationService.getTeacherLocation().subscribe((message) => {
      this.parseTeacherLocation(message);
    });
    this.code.sendFile({ 'status' : Status.SEND_ALL_FILES});
  }

  ngOnDestroy() {
  }

  sendLocationRange()
  {
    var locrange = this.codeEditor.getSelectionRange() 
    // console.log(locrange)
    this._locationService.sendStudentLocationRange(this.usn, this.currentFile, locrange.start.row + 1, locrange.end.row + 1)
  }

  onNoteDrop(e: any, dropedOn: Note) {
    // console.log(e.dragData)
    // console.log(dropedOn)
    var dragged = e.dragData;
    if (dragged.id != dropedOn.id) {
      dropedOn.text = dropedOn.text + "\n" + e.dragData.text;
      const index: number = this.notes.indexOf(dragged);
      if (index !== -1) {
          this.notes.splice(index, 1);
      }
    }
  }

  private fileOperations(msg: any)
  {
    // console.log(msg);
    if(msg.status != 0)
    {
      var nameArr = msg.filename.split(".");
      if((msg.fileStatus == FileStatus.CREATE_FILE)||(!this.files.find(element => element.name == nameArr[0])))
      {
        var tempFile = new File(nameArr[0],"",nameArr[1]);
        this.files.push(tempFile);
        this.fileNoteMap.push(new FileNoteMap(tempFile.name));
        if(this.currentFile=="")
          this.changeCurrFile(tempFile.name)
      }
      if(msg.fileStatus == FileStatus.UPDATE_FILE)
      {
        var newNameArr = msg.newfilename.split(".");
        if(this.currentFile==nameArr[0])
        {
          this.currentFile = newNameArr[0];
          this.lang = this.langArray.find(element => element.ext == newNameArr[1]).name
          this.codeEditor.getSession().setMode("ace/mode/" + this.lang);
        }
        this.files.find(element => element.name == nameArr[0]).name = newNameArr[0];
        this.files.find(element => element.name == newNameArr[0]).language = newNameArr[1];
        this.fileNoteMap.find(element => element.fileName == nameArr[0]).fileName = newNameArr[0];
        

      }
      else if(msg.fileStatus == FileStatus.UPDATE_FILE_DATA)
      {
        this.files.find(element => element.name == nameArr[0]).data = msg.filecode;
        this.files.find(element => element.name == nameArr[0]).language = nameArr[1];
        if(this.currentFile==nameArr[0])
        {
          this.codeEditor.setValue(msg.filecode);
        }
      }
    }
    
  }

  private parseTeacherLocation(msg: any)
  {
    var teacherFileLocation:string = msg.filename;
    var teacherRowLocation:string = msg.row;
    this.teacherLocation = "Follow cursor at " + teacherFileLocation + ": line " + teacherRowLocation;
    // console.log(this.teacherLocation)
  }

  changeCurrFile(newFile: string)
  {
    this.currentFile = newFile;
    var temp = this.files.find(element => element.name == this.currentFile);
    this.codeEditor.setValue(temp.data);
    this.notes = this.fileNoteMap.find(element => element.fileName == this.currentFile).notes;
    this.lang = this.langArray.find(element => element.ext == temp.language).name
    this.codeEditor.getSession().setMode("ace/mode/" + this.lang);
  }

  /* 
  py - """ """
  js, java, cs, c_cpp - "/*" 
  ruby - =begin, =end
  */

  public download(currentDownloadStatus: DownloadStatus = DownloadStatus.Start): void 
  {
    var zip = new JSZip();
    var comment: string = "";
    for (let i in this.fileNoteMap)
    {
      let x = this.files.find(element => element.name == this.fileNoteMap[i].fileName);
      comment = this.langArray.find(element => element.ext == x.language).comment_syntax;
      var multilineComment = (comment == "#")? '"""': '/*'
      let y = this.fileNoteMap[i].notes
      var line: number = 0;
      var arr = x.data.split("\n");
      var data: string = "";
      while(line<arr.length)
      {
        data+=arr[line]
        // var z = y.find(element => element.lineNumber-1 == line)
        // if(z != undefined)
        // {
        //   data = data + comment + z.text;
        // }
        for(let i in y)
        {
          if(y[i].lineNumber-1 == line)
          {
            if(y[i].text.includes("\n"))
            {
              data += "\n" + multilineComment + y[i].text + multilineComment.split('').reverse().join('');
            }
            else
            {
              data += " " + comment + y[i].text;
            }
          }
        }
        data += "\n";
        ++line;
      }
      for(let i in y)
      {
        if(y[i].lineNumber > line)
        {
          if(y[i].text.includes("\n"))
          {
            data += multilineComment + y[i].text + multilineComment.split('').reverse().join('');
          }
          else
          {
            data += "" + comment + y[i].text;
          }
          data += "\n"
        }
      }
      // console.log(data);
      var lang = this.files.find(element => element.name == this.fileNoteMap[i].fileName).language
      zip.file(this.fileNoteMap[i].fileName + "." + lang, data);
    }

    zip.generateAsync({type:"blob"})
    .then(function(content) {
        saveAs(content, "files.zip");
    });
    this._download.changeDownloadStatus(DownloadStatus.Start);
  }

  private getNextNoteId(notes: Note[]) : number
  {
    if(notes.length == 0)
      return 1
    else
    {
      var max = 0
      for(let i in notes)
      {
        if(max<notes[i].id)
          max = notes[i].id
      }
      return max + 1
    }
  }

  openDialog(): void {
    let x = new Note(this.getNextNoteId(this.notes),"",this.currentLine+1)
    const dialogRef = this.dialog.open(NoteDialogComponent, {
      height: '300px',
      width: '600px',
      data: x
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log(result);
      if(result!=undefined)
        this.addNote(result.id,result.text, result.lineNumber)
    });
  }

  moveUp(note: Note): void
  {
    if(note.lineNumber <= 1)
      return
    note.lineNumber = note.lineNumber - 1
    this.notes.sort(this.compareFn);
    // console.log(this.notes);
  }

  moveDown(note: Note): void
  {
    note.lineNumber = note.lineNumber + 1
    this.notes.sort(this.compareFn);
    // console.log(this.notes);
  }

  editNoteDialog(note: Note): void
  {

    const dialogRef = this.dialog.open(NoteDialogComponent, {
      height: '300px',
      width: '600px',
      data: note
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log(result);
      let x = this.notes.find(element => element.id == note.id)
      x.lineNumber = result.lineNumber;
      x.text = result.text;
    });
    this.notes.sort(this.compareFn);
    // console.log(this.notes);
  }

  deleteNote(note: Note): void
  {
    const index: number = this.notes.indexOf(note);
    if (index !== -1) {
        this.notes.splice(index, 1);
    }
    this.notes.sort(this.compareFn);
    // console.log(this.notes);
  }


  addNote(id: number,text: string, currentLine: string) : void
  {
    let num = parseInt(currentLine);
    if((text=="")||(isNaN(num))||(num<1)||(num>this.totalCodeLength)||(this.currentFile==""))
    {
      // console.log("text " + text + "isNaN " + isNaN(num) + "num " + num + "currentFile " + this.currentFile)
      return;
    }
    // let x = this.notes.find(element => element.lineNumber == num)
    // if(x!=undefined)
    // {
    //   x.text = x.text + "\n" + text;
    //   console.log("added to same note");
    //   return;
    // }
    let currentFileNote = this.fileNoteMap.find(element => element.fileName == this.currentFile);
    currentFileNote.notes.push(new Note(id,text,num));
    currentFileNote.notes.sort(this.compareFn);
    // console.log(currentFileNote);
  }

  compareFn(a: Note,b: Note) : number
  {
    if (a.lineNumber > b.lineNumber)
      return 1;
    else if(a.lineNumber == b.lineNumber)
      return 0;
    else
      return -1;
  }

  changeCurrentLine()
  {
    let temp = this.codeEditor.selection.getCursor().row;
    if(this.currentLine!= temp)
    {
      this.currentLine = temp;
    }
    temp = this.codeEditor.session.getLength();
    if(this.totalCodeLength!= temp)
    {
      this.totalCodeLength = temp;
    }
  }

  /************************************************************************EDITOR FUNCTIONS************************************************/
  // missing propery on EditorOptions 'enableBasicAutocompletion' so this is a workaround still using ts
  private getEditorOptions(): Partial<ace.Ace.EditorOptions> & { enableBasicAutocompletion?: boolean; } {
      const basicEditorOptions: Partial<ace.Ace.EditorOptions> = {
          highlightActiveLine: true,
          minLines: 14,
          fontSize: 20,
          maxLines: 27,
          animatedScroll: true,
      };
      const extraEditorOptions = { enableBasicAutocompletion: true };
      return Object.assign(basicEditorOptions, extraEditorOptions);
  }

  initializeEditor() {
    ace.require('ace/ext/language_tools');
    const element = this.codeEditorElmRef.nativeElement;
    const editorOptions = this.getEditorOptions();
    this.codeEditor = ace.edit(element, editorOptions);
    this.codeEditor.setTheme(this.themes[0].actual_name);
    this.codeEditor.getSession().setMode("ace/mode/c_cpp");
    this.lang = "c_cpp"
    this.codeEditor.setShowFoldWidgets(true);
    this.codeEditor.setReadOnly(true);
    ace.require('ace/ext/beautify');
  }

  /**
   * @description
   *  set the language based on selection
   */
  // public setLanguage(language: string ): void {
  //   if (this.codeEditor) {
  //     this.lang = language;
  //     var mode = "ace/mode/" + language;
  //     this.codeEditor.getSession().setMode(mode);
  //   }
  // }
  
  /**
   * @description
   *  set the theme based on selection
   */
  public setTheme(theme: string ): void {
    if (this.codeEditor) {
      this.codeEditor.setTheme(this.themes.find(element => element.name == theme).actual_name);
    }
  }

  public runCode():void {
      const code = this.codeEditor.getValue();
      // console.log(this.lang);
      this._codeEditorService.getOutput(code,this.lang).subscribe(data=>{
        // console.log(data.body);
        this.response = JSON.parse(JSON.stringify(data.body))
        this.outputString = this.response.output;
        // this.langArray = data.body['langMap'];
    });
  }

  public clearCode() {
    if (this.codeEditor) {
      this.codeEditor.setValue("",0);
  }
  }
  
}