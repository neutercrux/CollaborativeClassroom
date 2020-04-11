import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';

import * as moment from 'moment';
// import {filter} from 'rxjs/operator/filter'
// import 'rxjs/add/operator/distinctUntilChanged';
// import 'rxjs/add/operator/filter';
// import 'rxjs/add/operator/skipWhile';
// import 'rxjs/add/operator/scan';
// import 'rxjs/add/operator/throttleTime';
import { DoubtService } from '../doubt.service'

@Component({
  selector: 'app-doubt',
  templateUrl: './doubt.component.html',
  styleUrls: ['./doubt.component.css']
})

@Injectable()
export class DoubtComponent implements OnInit {

  message: string;
  messages = [];
  questionLength : number = 0;
  numbers = Array(this.questionLength).fill(0).map((x,i)=>i);
  name:String = sessionStorage.getItem("name");;
  designation:String = sessionStorage.getItem("designation");
  isStudent = ("student" == sessionStorage.getItem("designation"));
  questionSelected:any;

  constructor(private doubtService:DoubtService) { 
  }

  sendMessage() {
    if(this.designation=='student'){
      this.doubtService.sendMessage(this.message,this.name,this.designation,this.questionLength+1);
    }
    else{
      this.doubtService.sendMessage(this.message,this.name,this.designation,this.questionSelected);
    }
    this.message = '';
  }

  ngOnInit() {
    this.doubtService.getMessages().subscribe((message) => {
      if(message.message.length>0 && message.qno){
        const currentTime = moment().format('hh:mm a');
        const messageWithTimestamp = {'time':currentTime,'message':message.message,'user':message.name,'qno':message.qno,'designation':message.designation};
        this.messages.push(messageWithTimestamp);
        if(message.designation=='student'){
          this.questionLength = this.questionLength+1;
          this.numbers = Array(this.questionLength).fill(0).map((x,i)=>i);
        }
        if(message.designation=='teacher'){
          this.questionSelected = 0;
        }
      }
    });
    console.log(this.messages)
  }
  updateQues(number){
    console.log(number)
    this.questionSelected = number;
  }
}
