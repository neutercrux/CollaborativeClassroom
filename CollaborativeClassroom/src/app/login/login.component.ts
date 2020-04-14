import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { from } from 'rxjs';
import {Router} from "@angular/router";
import { window } from 'rxjs/operators';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private Auth: AuthService,private router: Router) { }
  response: any;
  desig:any;
  ngOnInit() {
  }

  loginUser(event){
    event.preventDefault();
    const target = event.target;
    const usn = target.querySelector('#usn').value;
    const password = target.querySelector('#password').value;
    this.Auth.getUserDetails(usn,password).subscribe(data => {
      this.response = JSON.parse(JSON.stringify(data));
      console.log(this.response.body[0].designation);
      this.desig = this.response.body[0].designation
      sessionStorage.setItem("designation",this.response.body[0].designation);
      sessionStorage.setItem("name",usn);
      if(this.response.status==200 && this.desig=='student'){
        // this.router.navigate(['/mainPage'])
        this.router.navigate(['/mainPage'])
      }
      else if(this.response.status==200 && this.desig=='teacher'){
        this.router.navigate(['/dashboard'])
        // this.router.navigate(['/mainPage'])
      }
      else{
        this.router.navigate(['/login'])
      }
    });
  }
}
