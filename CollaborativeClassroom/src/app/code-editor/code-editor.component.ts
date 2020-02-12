import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { CodeEditorService } from '../code-editor.service';
import * as ace from 'ace-builds';

import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-beautify';

const THEME = 'ace/theme/github';
const LANG = 'ace/mode/javascript';

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.css']
})
export class CodeEditorComponent implements OnInit {

  private codeEditor: ace.Ace.Editor;
  private editorBeautify;
  private langArray;
  @ViewChild('codeEditor',{static: false}) private codeEditorElmRef: ElementRef;

  constructor(private _codeEditorService:CodeEditorService ) { }

  getLangs(){
    this._codeEditorService.getLangs().subscribe(data=>{
        // console.log(data.body['langMap']);
        this.langArray = data.body['langMap'];
        console.log(this.langArray)
    });
  }

  ngOnInit() {
    this.getLangs();
  }

  ngAfterViewInit() {
      ace.require('ace/ext/language_tools');
      const element = this.codeEditorElmRef.nativeElement;
      const editorOptions = this.getEditorOptions();
      this.codeEditor = ace.edit(element, editorOptions);
      this.codeEditor.setTheme(THEME);
      this.codeEditor.getSession().setMode(LANG);
      this.codeEditor.setShowFoldWidgets(true);
      // hold reference to beautify extension
      this.editorBeautify = ace.require('ace/ext/beautify');
  }

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

}