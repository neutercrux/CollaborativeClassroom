import { Component,Input, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';

import * as moment from 'moment';
import { DoubtService } from '../doubt.service'
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-doubt',
  templateUrl: './doubt.component.html',
  styleUrls: ['./doubt.component.css']
})

@Injectable()
export class DoubtComponent implements OnInit {

  message: string;
  fileUrl: any;
  messages = [];
  questionLength : number = 0;
  numbers = Array(this.questionLength).fill(0).map((x,i)=>i);
  name:String = sessionStorage.getItem("name");;
  designation:String = sessionStorage.getItem("designation");
  @Input() private isStudent: boolean;
  questionSelected:any;

  constructor(private doubtService:DoubtService,private sanitizer: DomSanitizer) { 
  }

  sendMessage() {
    if(this.designation=='student'){
      this.doubtService.sendMessage(this.message,this.name,this.designation,this.questionLength+1);
    }
    else{
      this.doubtService.sendMessage(this.message,this.name,this.designation,this.questionSelected);
    }
    this.message = '';
    this.downloadDoubt()
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

  private downloadDoubt(){
    var data = '';

    for( let m of this.messages){
      if(m.designation=='teacher'){
        data += "A"+m.qno+": "+m.message+"\n"
      }
      else{
        data += "Q"+m.qno+": "+m.message+"\n";
      }
    }
    console.log(data)
    const blob = new Blob([data], { type: 'application/octet-stream' });

    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
  }
}