import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _url_login: string = "http://localhost:5000/login";
  private _url_register: string = "http://localhost:5000/register";

  constructor(private http : HttpClient) { }

  getUserDetails(username,password){
    return this.http.post(this._url_login,{
      "username":username,
      "password":password
    },{observe : 'response'})
  }

  addUserDetails(username,email,password){
    return this.http.post(this._url_register,{
      "username":username,
      "email":email,
      "password":password
    },{observe : 'response'})
  }
}
