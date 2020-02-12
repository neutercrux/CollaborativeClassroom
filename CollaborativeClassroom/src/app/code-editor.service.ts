import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class CodeEditorService {

  private _url_lang: string = "http://localhost:3000/api/v1/langs";

  constructor(private http : HttpClient) { }

  getLangs(){
    return this.http.get(this._url_lang,{observe:'response'})
  }
}
