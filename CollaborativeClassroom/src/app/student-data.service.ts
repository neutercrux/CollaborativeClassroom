import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StudentDataService {

  constructor(private http : HttpClient) { }

  private _url_update: string = "http://localhost:3000/api/v1/update";

  update(studentArr){
    return this.http.post(this._url_update,{"data": studentArr},{observe:'response'})
  }
}
