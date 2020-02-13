import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { NgxPubSubService } from '@pscoped/ngx-pub-sub';
import { CodeEditorService } from '../code-editor.service';
import * as ace from 'ace-builds';
import { THEMES } from '../themes';

import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/theme-clouds_midnight';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-beautify';
import { publish, tap, takeWhile } from 'rxjs/operators';

const LANG = 'ace/mode/c_cpp';

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.css']
})
export class CodeEditorComponent implements OnInit {

  private codeEditor: ace.Ace.Editor;
  private editorBeautify;
  private themes = THEMES;
  private langArray;
  private lang;
  @ViewChild('codeEditor',{static: false}) private codeEditorElmRef: ElementRef;
  timer;
  sess;
  latestEvent = 'randomLast';

  constructor(private _codeEditorService:CodeEditorService,private pubsub: NgxPubSubService ) { }

  ngOnInit() {
    this.getLangs();
  }

  ngAfterViewInit() {
      ace.require('ace/ext/language_tools');
      const element = this.codeEditorElmRef.nativeElement;
      const editorOptions = this.getEditorOptions();
      this.codeEditor = ace.edit(element, editorOptions);
      this.codeEditor.setTheme(this.themes[0].actual_name);
      this.codeEditor.getSession().setMode(LANG);
      this.codeEditor.setShowFoldWidgets(true);
      // hold reference to beautify extension
      this.editorBeautify = ace.require('ace/ext/beautify');
      this.sess = this.codeEditor.getValue();
      this.timer = setInterval(() => { this.publish(); }, 2000);
  }

  publish() {
    // console.log("func called");
    var new_sess = this.codeEditor.getValue();
    if(this.sess!=new_sess)
    {
      console.log(new_sess);
      this.sess = new_sess;
      this.pubsub.publishWithLast(this.latestEvent, this.sess);
    }
    
  }

  getLangs(){
    this._codeEditorService.getLangs().subscribe(data=>{
        // console.log(data.body['langMap']);
        this.langArray = data.body['langMap'];
        console.log(this.langArray)
    });
  }

  /************************************************************************EDITOR FUNCTIONS************************************************/
  // missing propery on EditorOptions 'enableBasicAutocompletion' so this is a wolkaround still using ts
  private getEditorOptions(): Partial<ace.Ace.EditorOptions> & { enableBasicAutocompletion?: boolean; } {
      const basicEditorOptions: Partial<ace.Ace.EditorOptions> = {
          highlightActiveLine: true,
          minLines: 14,
          maxLines: Infinity,
      };
      const extraEditorOptions = { enableBasicAutocompletion: true };
      return Object.assign(basicEditorOptions, extraEditorOptions);
  }

  /**
   * @returns - the current editor's content.
   */
  public getContent() {
      if (this.codeEditor) {
          const code = this.codeEditor.getValue();
          return code;
      }
  }

  public clearCode() {
    if (this.codeEditor) {
      this.codeEditor.setValue("",0);
  }
  }

  /**
   * @description
   *  set the theme based on selection
   */
  public setTheme(theme: string ): void {
    if (this.codeEditor) {

      console.log(this.themes.find(element => element.name == theme).actual_name);
      this.codeEditor.setTheme(this.themes.find(element => element.name == theme).actual_name);
    }
}
  
  /**
   * @description
   *  beautify the editor content, rely on Ace Beautify extension.
   */
  public beautifyContent(): void {
      if (this.codeEditor && this.editorBeautify) {
          const session = this.codeEditor.getSession();
          this.editorBeautify.beautify(session);
      }
  }

  public runCode():void {
      const code = this.getContent();
      this._codeEditorService.getOutput(code,this.lang).subscribe(data=>{
        console.log(data.body);
        // this.langArray = data.body['langMap'];
        // console.log(this.langArray)
    });
  }
  

  public selectLang(input){
      this.lang = input;
  }
  
}