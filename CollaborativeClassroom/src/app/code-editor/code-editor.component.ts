import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
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
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.css']
})
export class CodeEditorComponent implements OnInit {

  private codeEditor: ace.Ace.Editor;
  private themes = THEMES;
  private files: File[] = [];
  private currentFile: string;
  private langArray;
  private lang;
  private outputString: string = "";
  @ViewChild('codeEditor',{static: false}) private codeEditorElmRef: ElementRef;
  timer;
  sess;
  response: any;

  constructor(private code : CodeService, private _codeEditorService:CodeEditorService, private _currentFile: CurrentFileService,private webSocketService:WebsocketService) { }

  ngOnInit() {
    this.getLangs();
    
  }

  ngAfterViewInit() {
    this.initializeEditor();
    this.timer = setInterval(() => { this.publish(); }, 2000);
    var temp = new File(this.currentFile,"");
    this.files.push(temp);
    this._currentFile.currentOpenFile.subscribe(currentOpenFile => this.changeCurrentFile(currentOpenFile))
  }

  publish() {
    var new_sess = this.codeEditor.getValue();
    if(this.sess!=new_sess)
    {
      this.sess = new_sess;
      this.files.find(element => element.name == this.currentFile).data = this.sess;
      this.code.sendCode(this.sess);
    }
  }

  public changeCurrentFile(currFile: string): void {
    if (this.currentFile!=currFile) {
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
      this._codeEditorService.getOutput(code,this.lang).subscribe(data=>{
        // console.log(data.body);
        this.response = JSON.parse(JSON.stringify(data.body))
        this.outputString = this.response.output;
        // this.langArray = data.body['langMap'];
        // console.log(this.outputString)
    });
  }
  

  public selectLang(input){
      this.lang = input;
  }

  
}