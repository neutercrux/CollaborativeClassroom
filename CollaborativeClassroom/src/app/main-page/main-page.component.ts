import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  isStudent: boolean;

  constructor() { }

  ngOnInit() {
    this.isStudent = ("student" == sessionStorage.getItem("designation"));
    console.log(sessionStorage.getItem("designation"));
  }

}
