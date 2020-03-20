import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private router: Router,private Auth: AuthService) { }
  address : any;
  ngOnInit() {
    this.Auth.getIp().subscribe(data => {
      console.log(data);
      this.address = data.body['address']
    })
  }
  
  viewData(event){
    event.preventDefault()
    this.router.navigate(['/studentData'])
  }
  startSession(event){
    event.preventDefault()
    this.router.navigate(['/mainPage'])
  }
}
