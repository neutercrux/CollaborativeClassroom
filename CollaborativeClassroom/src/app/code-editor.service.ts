import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class CodeEditorService {

  private _url_lang: string = "/api/v1/langs";

  constructor(private http : HttpClient) { }

  getLangs(){
    return this.http.get(this._url_lang,{observe:'response'})
  }

  getOutput(code,lang)
  {
    return this.http.post("/api/v1/run",{"program":code,"lang":lang},
                        {observe:'response'})
  }
}
