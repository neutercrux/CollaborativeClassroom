import { Injectable } from '@angular/core';
import { HttpClient, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _url_login: string = "http://localhost:3000/api/v1/users";
  private _url_register: string = "http://localhost:3000/register";

  constructor(private http : HttpClient) { }

  getUserDetails(usn,password){
    
    return this.http.get(this._url_login+"/"+usn+"/"+password,{observe:'response'})
  }

  addUserDetails(usn,email,password){
    return this.http.post(this._url_register,{
      "usn":usn,
      "email":email,
      "password":password
    },{observe : 'response'})
  }
}