import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { CodeEditorService } from '../code-editor.service';
import * as ace from 'ace-builds';
import { THEMES } from '../themes';
import { File, FileStatus } from '../file';
import { Status } from '../message';

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
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FileDialogComponent } from '../file-dialog/file-dialog.component';
import { ILanguage, LANGUAGES } from '../language';
import { element } from 'protractor';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { DownloadStatus, DownloadService } from '../download.service';

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.css']
})
export class CodeEditorComponent implements OnInit {

  public codeEditor: ace.Ace.Editor;
  public themes = THEMES;
  public files: File[] = [];
  public currentFile: string = "";
  public langArray: ILanguage[] = LANGUAGES;
  public outputString: string = "";
  @ViewChild('codeEditor',{static: false}) private codeEditorElmRef: ElementRef;
  response: any;
  lang: string;
  timer;
  sess: string;

  constructor(private _download: DownloadService,public dialog: MatDialog,private code : CodeService, private _codeEditorService:CodeEditorService, private webSocketService:WebsocketService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.initializeEditor();
    this.codeEditor.setReadOnly(true);
    this.code.messages.subscribe(msg => {
      msg = JSON.parse(msg);
      this.parseMsg(msg);
    })
  }

  publish() {
    var new_sess = this.codeEditor.getValue();
    if(this.sess!=new_sess)
    {
      this.sess = new_sess;
      let temp = this.files.find(element => element.name == this.currentFile);
      temp.data = this.sess;
      this.code.sendFile({ 'fileStatus' : FileStatus.UPDATE_FILE_DATA, 'filename' : this.currentFile + "." + temp.language, 'filecode' : temp.data });
    }
  }

  private parseMsg(msg: any)
  {
    console.log(msg);
    if(msg.status == Status.SEND_ALL_FILES)
    {
      for (let i in this.files)
      {
        this.code.sendFile({ 'fileStatus' : FileStatus.UPDATE_FILE_DATA, 'filename' : this.files[i].name + "." + this.files[i].language, 'filecode' : this.files[i].data });
      }
    }
  }

  public download(currentDownloadStatus: DownloadStatus = DownloadStatus.Start): void 
  {
    var zip = new JSZip();
    for (let i in this.files)
    {
      let x = this.files[i].data
      console.log(x);
      var lang = this.files[i].language
      zip.file(this.files[i].name + "." + lang, x);
    }

    zip.generateAsync({type:"blob"})
    .then(function(content) {
        saveAs(content, "files.zip");
    });
    this._download.changeDownloadStatus(DownloadStatus.Start);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(FileDialogComponent, {
      height: '200px',
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
      height: '200px',
      width: '600px',
      data: filename
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(result!=undefined)
        this.updateFile(filename,result)
    });
  }

  addFile(filename: string)
  {
    if((this.files.find(element => element.name == filename)==undefined)&&(filename!=""))
    {
      var tempFile = new File(filename,"",this.lang);
      this.files.push(tempFile);
      if(this.currentFile=="")
      {
        this.codeEditor.setReadOnly(false);
        this.timer = setInterval(() => { this.publish(); }, 2000);
      }
      this.code.sendFile({ 'fileStatus' : FileStatus.CREATE_FILE, 'filename' : filename + "." + this.lang});
      this.switchCurrFile(filename);
    }
    else
    {
      console.log("Choose a different name");
    }
  }

  switchCurrFile(file: string)
  {
    if(this.currentFile!="")
      this.files.find(element => element.name == this.currentFile).data = this.codeEditor.getValue();
    this.currentFile = file;
    let temp = this.files.find(element => element.name == this.currentFile);
    this.codeEditor.setValue(temp.data);
    this.lang = temp.language;
    this.codeEditor.getSession().setMode("ace/mode/" + this.langArray.find(element => element.ext == temp.language).name);
  }

  updateFile(oldFileName: string, newFileName: string)
  {
    this.files.find(element => element.name == oldFileName).name = newFileName;
    var lang = this.files.find(element => element.name == oldFileName).language;
    this.code.sendFile({ 'fileStatus' : FileStatus.UPDATE_FILE, 'filename' : oldFileName + "." + lang, 'newfilename' : newFileName + "." + this.lang });
  }

  deleteFile(fileName: string)
  {
    var file = this.files.find(element => element.name == fileName);
    var lang = file.language;
    var i = this.files.indexOf(file);
    this.files.splice(i,1);
    this.code.sendFile({ 'fileStatus' : FileStatus.DELETE_FILE, 'filename' : fileName + "." + lang });
  }

  // public changeCurrentFile(currFile: string): void {
  //   if (this.currentFile!=currFile) {
  //     this.files.find(element => element.name == this.currentFile).data = this.codeEditor.getValue();
  //     this.currentFile = currFile;
  //     if(this.files.find(element => element.name == this.currentFile)==undefined)
  //     {
  //       var tempFile = new File(this.currentFile,"");
  //       this.files.push(tempFile);
  //     }
  //     let temp = this.files.find(element => element.name == this.currentFile);
  //     this.codeEditor.setValue(temp.data);
  //     this.code.sendFile(temp);
  //   }
  // }

  // getLangs(){
  //   this._codeEditorService.getLangs().subscribe(data=>{
  //       this.langArray = data.body['langMap'];
  //       console.log(this.langArray);
  //   });
  // }

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
    this.lang = "cpp"
    this.codeEditor.setShowFoldWidgets(true);
    // hold reference to beautify extension
    ace.require('ace/ext/beautify');
    this.sess = this.codeEditor.getValue();
  }

  /**
   * @returns - the current editor's content.
   */
  // public getContent() {
  //     if (this.codeEditor) {
  //         const code = this.codeEditor.getValue();
  //         return code;
  //     }
  // }

  public clearCode() {
    if (this.codeEditor) {
      this.codeEditor.setValue("",0);
  }
  }

  /**
   * @description
   *  set the language based on selection
   */
  public setLanguage(language: string ): void {
    if (this.codeEditor) {
      this.lang = this.langArray.find(element => element.name == language).ext
      this.files.find(element => element.name == this.currentFile).language = this.lang
      this.updateFile(this.currentFile,this.currentFile);
      var mode = "ace/mode/" + language;
      this.codeEditor.getSession().setMode(mode);
    }
  }
  
  /**
   * @description
   *  set the theme based on selection
   */
  public setTheme(theme: string ): void {
    if (this.codeEditor) {
      this.codeEditor.setTheme(this.themes.find(element => element.name == theme).actual_name);
    }
  }
  
  /**
   * @description
   *  beautify the editor content, rely on Ace Beautify extension.
   */
  // public beautifyContent(): void {
  //     if (this.codeEditor && this.editorBeautify) {
  //         const session = this.codeEditor.getSession();
  //         this.editorBeautify.beautify(session);
  //     }
  // }

  public runCode():void {
      const code = this.codeEditor.getValue();
      this._codeEditorService.getOutput(code,this.langArray.find(element => element.ext == this.lang).name).subscribe(data=>{
        // console.log(data.body);
        this.response = JSON.parse(JSON.stringify(data.body))
        this.outputString = this.response.output;
        // this.langArray = data.body['langMap'];
        // console.log(this.outputString)
    });
  }
}