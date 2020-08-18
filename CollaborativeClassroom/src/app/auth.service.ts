import { Injectable } from '@angular/core';
import { HttpClient, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _url_login: string = "http://localhost:3000/api/v1/users";
  private _url_register: string = "http://localhost:3000/api/v1/register";
  private _url_ip = "http://localhost:3000/api/v1/ip"

  constructor(private http : HttpClient) { }

  getUserDetails(usn,password){
    
    return this.http.post(this._url_login,{"usn": usn, "password": password},{observe:'response'})

  }

  addUserDetails(usn,email,password){
    return this.http.post(this._url_register,{
      "usn":usn,
      "email":email,
      "password":password
    },{observe : 'response'})
  }

  getIp(){
    return this.http.get(this._url_ip,{observe : 'response'})
  }
}
