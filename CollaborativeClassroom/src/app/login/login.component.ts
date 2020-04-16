import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { from } from 'rxjs';
import {Router} from "@angular/router";
import { window } from 'rxjs/operators';
import { NotifierService } from 'angular-notifier';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private notifier: NotifierService;

  constructor(private Auth: AuthService,private router: Router,notifier: NotifierService) { 
    this.notifier = notifier
  }
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
      // console.log(this.response.body[0].designation);
      
      console.log(this.response.status)
      console.log(this.response);
      if(this.response.status==200 && this.response.body[0].designation=='student'){
        // this.router.navigate(['/mainPage'])
        this.desig = this.response.body[0].designation
        sessionStorage.setItem("designation",this.response.body[0].designation);
        sessionStorage.setItem("name",usn);
        this.router.navigate(['/mainPage'])
      }
      else if(this.response.status==200 && this.response.body[0].designation=='teacher'){
        this.desig = this.response.body[0].designation
        sessionStorage.setItem("designation",this.response.body[0].designation);
        sessionStorage.setItem("name",usn);
        this.router.navigate(['/dashboard'])
        // this.router.navigate(['/mainPage'])
      }
      else if(this.response.status==204){
        this.showNotification('error','Please check user credentials')
        this.router.navigate(['/login'])
      }
    });
  }
  public showNotification( type: string, message: string ): void {
    console.log('notif')
		this.notifier.notify( type, message );
	}
}
