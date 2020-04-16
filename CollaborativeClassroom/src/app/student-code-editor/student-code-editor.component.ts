import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CodeEditorService } from '../code-editor.service';
import * as ace from 'ace-builds';
import { THEMES } from '../themes';
import { File, FileStatus } from '../file';
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
import { CodeService } from '../code.service';
import { element } from 'protractor';
import { NoteDialogComponent } from '../note-dialog/note-dialog.component';
import { DownloadService, DownloadStatus } from '../download.service';
import { ILanguage,LANGUAGES} from '../language';

@Component({
  selector: 'app-student-code-editor',
  templateUrl: './student-code-editor.component.html',
  styleUrls: ['./student-code-editor.component.css']
})
export class StudentCodeEditorComponent implements OnInit {

  private codeEditor: ace.Ace.Editor;
  private themes = THEMES;
  private files: File[] = [];
  private notes: Note[] = [];
  private fileNoteMap: FileNoteMap[] = [];
  private currentFile: string = "";
  private langArray: ILanguage[] = LANGUAGES;
  private langComments: string[] = [];
  private outputString: string = "";
  @ViewChild('codeEditor',{static: false}) private codeEditorElmRef: ElementRef;
  response: any;
  currentLine: number;
  totalCodeLength: number;
  lineTimer;
  lang: string;

  constructor(private _download : DownloadService,public dialog: MatDialog, private _diff: DiffMatchPatch,private code: CodeService, private _codeEditorService:CodeEditorService, private _currentFile: CurrentFileService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.initializeEditor();
    this._download.currentDownloadStatus.subscribe();
    this.lineTimer = setInterval(()=>{ 
      this.changeCurrentLine()
    }, 1000);
    this.code.messages.subscribe(msg => {
      msg = JSON.parse(msg);
      this.fileOperations(msg);
    })
  }

  ngOnDestroy() {
  }

  private fileOperations(msg: any)
  {
    console.log(msg);
    if(msg.fileStatus == FileStatus.CREATE_FILE)
    {
      var nameArr = msg.filename.split(".");
      var tempFile = new File(nameArr[0],"",nameArr[1]);
      this.files.push(tempFile);
      this.fileNoteMap.push(new FileNoteMap(tempFile.name));
      if(this.currentFile=="")
        this.changeCurrFile(tempFile.name)
    }
    else if(msg.fileStatus == FileStatus.UPDATE_FILE)
    {
      var nameArr = msg.filename.split(".");
      var newNameArr = msg.newfilename.split(".");
      if(this.currentFile==nameArr[0])
      {
        this.currentFile = newNameArr[0];
      }
      this.files.find(element => element.name == nameArr[0]).name = newNameArr[0];
      this.files.find(element => element.name == newNameArr[0]).language = newNameArr[1];
      this.fileNoteMap.find(element => element.fileName == nameArr[0]).fileName = newNameArr[0];
      this.lang = this.langArray.find(element => element.ext == newNameArr[1]).name
      this.codeEditor.getSession().setMode("ace/mode/" + this.lang);

    }
    else if(msg.fileStatus == FileStatus.UPDATE_FILE_DATA)
    {
      var nameArr = msg.filename.split(".");
      this.files.find(element => element.name == nameArr[0]).data = msg.filecode;
      this.files.find(element => element.name == nameArr[0]).language = nameArr[1];
      if(this.currentFile==nameArr[0])
      {
        this.codeEditor.setValue(msg.filecode);
      }
    }
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

  // public changeCurrentFile(currFile: string): void {
  //   if ((this.currentFile!=currFile)&&(this.files.length > 0)) {
  //     this.files.find(element => element.name == this.currentFile).data = this.codeEditor.getValue();
  //     this.currentFile = currFile;
  //     if(this.files.find(element => element.name == this.currentFile)==undefined)
  //     {
  //       var tempFile = new File(this.currentFile,"");
  //       this.files.push(tempFile);
  //       this.fileNoteMap.push(new FileNoteMap(tempFile.name));
  //     }
  //     this.codeEditor.setValue(this.files.find(element => element.name == this.currentFile).data);
  //     this.notes = this.fileNoteMap.find(element => element.fileName == this.currentFile).notes;
  //   }
  // }

  // public updateFileData(file: File): void {
  //   if(this.files.find(element => element.name == file.name)==undefined)
  //   {
  //     var tempFile = new File(file.name,file.data);
  //     this.files.push(tempFile);
  //     this.fileNoteMap.push(new FileNoteMap(tempFile.name));
  //   }
  //   var temp = this.files.find(element => element.name == file.name);
  //   //this.resolveNotePositioning(temp.data,file.data);
  //   temp.data = file.data;
  //   if(this.currentFile == file.name)
  //   {
  //     this.codeEditor.setValue(temp.data);
  //   }
  //   if(this.currentFile=="")
  //   {
  //     this.currentFile = file.name;
  //     this.codeEditor.setValue(temp.data);
  //     this.notes = this.fileNoteMap.find(element => element.fileName == this.currentFile).notes;
  //   }
  // }

  private download(currentDownloadStatus: DownloadStatus): void 
  {
    var zip = new JSZip();
    var comment: string = "//";
    for (let i in this.fileNoteMap)
    {
      let x = this.files.find(element => element.name == this.fileNoteMap[i].fileName);
      let y = this.fileNoteMap[i].notes
      var line: number = 0;
      var arr = x.data.split("\n");
      var data: string = "";
      while(line<arr.length)
      {
        data+=arr[line]
        var z = y.find(element => element.lineNumber-1 == line)
        if(z != undefined)
        {
          data = data + comment + z.text;
        }
        data += "\n";
        ++line;
      }
      console.log(data);
      var lang = this.files.find(element => element.name == this.fileNoteMap[i].fileName).language
      zip.file(this.fileNoteMap[i].fileName + "." + lang, data);
    }

    zip.generateAsync({type:"blob"})
    .then(function(content) {
        saveAs(content, "files.zip");
    });
    this._download.changeDownloadStatus(DownloadStatus.Start);
  }

  openDialog(): void {
    let x = new Note("",this.currentLine+1)
    const dialogRef = this.dialog.open(NoteDialogComponent, {
      height: '300px',
      width: '600px',
      data: x
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(result!=undefined)
        this.addNote(result.text, result.lineNumber)
    });
  }

  editNoteDialog(note: Note): void
  {

    const dialogRef = this.dialog.open(NoteDialogComponent, {
      height: '300px',
      width: '600px',
      data: note
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      let x = this.notes.find(element => element.lineNumber == note.lineNumber)
      x.lineNumber = result.lineNumber;
      x.text = result.text;
    });
  }


  addNote(text: string, currentLine: string) : void
  {
    let num = parseInt(currentLine);
    if((text=="")||(isNaN(num))||(num<1)||(num>this.totalCodeLength)||(this.currentFile==""))
    {
      console.log("text " + text + "isNaN " + isNaN(num) + "num " + num + "currentFile " + this.currentFile)
      return;
    }
    let x = this.notes.find(element => element.lineNumber == num)
    if(x!=undefined)
    {
      x.text = x.text + "\n" + text;
      console.log("added to same note");
      return;
    }
    let currentFileNote = this.fileNoteMap.find(element => element.fileName == this.currentFile);
    currentFileNote.notes.push(new Note(text,num));
    currentFileNote.notes.sort(this.compareFn);
    console.log(currentFileNote);
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

  

  resolveNotePositioning(temp: string,file: string)
  {
    let diffArr = this._diff.diff_main(temp,file);
    console.log(diffArr);
    var lineNumber = 1;
    for (let i in diffArr)
    {
      switch (diffArr[i][0])
      {
        case -1:
          {
            for(let j of diffArr[i][1])
            {
              if(j=="\n")
              {
                this.notes.forEach(function (element){
                  if(element.lineNumber>lineNumber)
                  {
                    --element.lineNumber;
                  }
                })
              }
            }
            break;
          }
        case 0:
          {
            for(let j of diffArr[i][1])
            {
              if(j=="\n")
                ++lineNumber;
            }
            break;
          }
        case 1:
          {
            for(let j of diffArr[i][1])
            {
              if(j=="\n")
              {
                this.notes.forEach(function (element){
                  if(element.lineNumber>=lineNumber)
                  {
                    ++element.lineNumber;
                  }
                })
              }
            }
            break;
          }
      }
    }
    this.adjustNotes();
  }

  // resolveNotePositioning(temp: string,file: string)
  // {
  //   let diffArr = this._diff.diff_main(temp,file);
  //   console.log(diffArr);
  //   var lineNumber = 1;
  //   var prevText = "";
  //   var currentText = "";
  //   var repositionNotes: boolean = false;
  //   var delta: number = 0;
  //   var repositionLine: number = 0;
  //   for (let i in diffArr)
  //   {
  //     switch (diffArr[i][0])
  //     {
  //       case -1:
  //         {
  //           for(let j of diffArr[i][1])
  //           {
  //             if(j!="\n")
  //               currentText+= j;
  //             else
  //             {
  //               if(repositionNotes)
  //               {
  //                 this.repositionNotes(repositionLine,delta);
  //               }
  //               repositionNotes = true;
  //               repositionLine = lineNumber;
  //               delta = -1;
  //               if(prevText!="" && prevText.length >= currentText.length)
  //               {
  //                 //console.log("added 1 to reposition")
  //                 //++repositionLine;
  //               }
  //               console.log("repositionLine: "+repositionLine+" delta: "+delta+" prevText: "+prevText+" currentText: "+currentText)
  //               prevText = currentText;
  //               currentText = "";
  //               // this.notes.forEach(function (element){
  //               //   if(element.lineNumber>lineNumber)
  //               //   {
  //               //     --element.lineNumber;
  //               //   }
  //               // })
  //             }
  //           }
  //           break;
  //         }
  //       case 0:
  //         {
  //           for(let j of diffArr[i][1])
  //           {
  //             if(j!="\n")
  //               currentText+= j;
  //             else
  //             {
  //               if(repositionNotes)
  //               {
  //                 this.repositionNotes(repositionLine,delta);
  //               }
  //               repositionNotes = false;
  //               repositionLine = this.totalCodeLength;
  //               delta = 0;
  //               prevText = "";
  //               currentText = "";
  //               ++lineNumber;
  //             }
  //           }
  //           break;
  //         }
  //       case 1:
  //         {
  //           for(let j of diffArr[i][1])
  //           {
  //             if(j!="\n")
  //               currentText+= j;
  //             else
  //             {
  //               if(repositionNotes)
  //               {
  //                 this.repositionNotes(repositionLine,delta);
  //               }
  //               repositionNotes = true;
  //               repositionLine = lineNumber;
  //               delta = 1;
  //               if(prevText!="" && prevText.length >= currentText.length)
  //               {
  //                 --repositionLine;
  //               }
  //               console.log("repositionLine: "+repositionLine+" delta: "+delta+" prevText: "+prevText+" currentText: "+currentText)
  //               prevText = currentText;
  //               currentText = "";
  //               ++lineNumber;
  //               // this.notes.forEach(function (element){
  //               //   if(element.lineNumber>lineNumber)
  //               //   {
  //               //     ++element.lineNumber;
  //               //   }
  //               // })
  //             }
  //           }
  //           break;
  //         }
  //     }
  //   }
  //   if(repositionNotes)
  //   {
  //     this.repositionNotes(repositionLine,delta);
  //   }
  //   this.adjustNotes();
  // }

  // private repositionNotes(repositionLine: number,delta: number): void
  // {
  //   this.notes.forEach(function (element){
  //     if(element.lineNumber>repositionLine)
  //     {
  //       element.lineNumber+=delta;
  //     }
  //   })
  // }

  public adjustNotes(): void
  {
    for(let i: number = 0;i<this.notes.length-1;++i)
    {
      if(this.notes[i].lineNumber == this.notes[i+1].lineNumber)
      {
        this.notes[i].text = this.notes[i].text + this.notes[i+1].text
        this.notes.splice(i+1,1);
      }
    }
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
      this._codeEditorService.getOutput(code,this.langArray.find(element => element.ext == this.lang).name).subscribe(data=>{
        // console.log(data.body);
        this.response = JSON.parse(JSON.stringify(data.body))
        this.outputString = this.response.output;
        // this.langArray = data.body['langMap'];
    });
  }
  
}