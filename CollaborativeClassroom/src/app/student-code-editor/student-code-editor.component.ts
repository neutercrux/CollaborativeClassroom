import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgxPubSubService } from '@pscoped/ngx-pub-sub';
import { CodeEditorService } from '../code-editor.service';
import * as ace from 'ace-builds';
import { THEMES } from '../themes';
import { File } from '../file';
import { CurrentFileService } from '../current-file.service';

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

@Component({
  selector: 'app-student-code-editor',
  templateUrl: './student-code-editor.component.html',
  styleUrls: ['./student-code-editor.component.css']
})
export class StudentCodeEditorComponent implements OnInit {

  private codeEditor: ace.Ace.Editor;
  private themes = THEMES;
  private files: File[] = [];
  private currentFile: string;
  private langArray;
  private lang;
  private outputString: string = "";
  @ViewChild('codeEditor',{static: false}) private codeEditorElmRef: ElementRef;
  latestEvent = 'randomLast';
  response: any;

  constructor(private code: CodeService, private _codeEditorService:CodeEditorService, private _currentFile: CurrentFileService) { }

  ngOnInit() {
    this.getLangs();
  }

  ngAfterViewInit() {
    this.initializeEditor();
    this._currentFile.currentOpenFile.subscribe(currentOpenFile => this.changeCurrentFile(currentOpenFile));
    this.code.messages.subscribe(msg => {
      console.log(msg.filename + " " + msg.filecode);
      var temp = new File(msg.filename,String(msg.filecode))
      this.updateFileData(temp);
    })
  }

  ngOnDestroy() {
  }

  public updateFileData(file: File): void {
    console.log(file);
    if(this.files.find(element => element.name == file.name)==undefined)
    {
      var tempFile = new File(file.name,file.data);
      this.files.push(tempFile);
    }
    var temp = this.files.find(element => element.name == file.name);
    temp.data = file.data;
    if(this.currentFile == file.name)
    {
      this.codeEditor.setValue(temp.data);
    }
  }

  public changeCurrentFile(currFile: string): void {
    if ((this.currentFile!=currFile)&&(this.files.length > 0)) {
      this.files.find(element => element.name == this.currentFile).data = this.codeEditor.getValue();
      this.currentFile = currFile;
      if(this.files.find(element => element.name == this.currentFile)==undefined)
      {
        var tempFile = new File(this.currentFile,"");
        this.files.push(tempFile);
      }
      this.codeEditor.setValue(this.files.find(element => element.name == this.currentFile).data);
    }
  }

  getLangs(){
    this._codeEditorService.getLangs().subscribe(data=>{
        this.langArray = data.body['langMap'];
    });
  }

  /************************************************************************EDITOR FUNCTIONS************************************************/
  // missing propery on EditorOptions 'enableBasicAutocompletion' so this is a workaround still using ts
  private getEditorOptions(): Partial<ace.Ace.EditorOptions> & { enableBasicAutocompletion?: boolean; } {
      const basicEditorOptions: Partial<ace.Ace.EditorOptions> = {
          highlightActiveLine: true,
          minLines: 14,
          maxLines: Infinity,
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
    this.codeEditor.setShowFoldWidgets(true);
    ace.require('ace/ext/beautify');
  }

  /**
   * @description
   *  set the language based on selection
   */
  public setLanguage(language: string ): void {
    if (this.codeEditor) {
      this.lang = language;
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

  public runCode():void {
      const code = this.codeEditor.getValue();
      this._codeEditorService.getOutput(code,this.lang).subscribe(data=>{
        console.log(data.body);
        this.response = JSON.parse(JSON.stringify(data.body))
        this.outputString = this.response.output;
        // this.langArray = data.body['langMap'];
        console.log(this.outputString)
    });
  } 

  public selectLang(input){
      this.lang = input;
  }
  
}