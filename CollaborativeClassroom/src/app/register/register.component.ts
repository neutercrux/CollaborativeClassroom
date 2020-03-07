import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private Auth: AuthService,private router: Router) { }
  response: any;

  ngOnInit() {
  }

  registerUser(event){
    event.preventDefault();
    const target = event.target;
    const username = target.querySelector('#username').value;
    const password = target.querySelector('#password').value;
    const email = target.querySelector('#email').value;
    console.log(username,password,email);
    this.Auth.addUserDetails(username,email,password,).subscribe(data=>{
      this.response = JSON.parse(JSON.stringify(data));
      console.log(this.response);
      if(this.response.status==201){
        this.router.navigate(['/login']);
      }
      else{
        this.router.navigate(['/register']);
      }
    })
  }

}
