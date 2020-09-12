import { Component,Input, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';

import * as moment from 'moment';
import { DoubtService } from '../doubt.service'
import { DomSanitizer } from '@angular/platform-browser';
import { DownloadService, DownloadStatus } from '../download.service';

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
  // questionLength : number = 0;
  // numbers = Array(this.questionLength).fill(0).map((x,i)=>i);
  name:String = sessionStorage.getItem("name");;
  designation:String = sessionStorage.getItem("designation");
  @Input() public isStudent: boolean;
  questionSelected:any;

  constructor(private _download: DownloadService,private doubtService:DoubtService,private sanitizer: DomSanitizer) { 
  }

  sendMessage() {
    if(this.message!='')
    {
      const currentTime = moment().format('hh:mm a');
      if(this.designation=='student'){
        this.doubtService.sendMessage(this.message,this.name,this.designation, 0, currentTime);
      }
      else{
        this.doubtService.sendMessage(this.message,this.name,this.designation, this.questionSelected, currentTime);
      }
    }
    this.message = '';
  }

  ngOnInit() {
    this._download.currentDownloadStatus.subscribe(currentDownloadStatus => this.downloadDoubt(currentDownloadStatus));
    this.doubtService.getMessages().subscribe((message) => {
      this.parseMsgs(message);
    });
    this.doubtService.getAllMessages(this.name, this.designation)
  }

  private parseMsgs(message) {
    if(message.message.length>0 && message.qno && (this.messages.find(element => element.id == message.id)==undefined)){
      const messageWithTimestamp = {'time':message.currentTime,'message':message.message,'user':message.name,'qno':message.qno,'designation':message.designation,'id':message.id};
      this.messages.push(messageWithTimestamp);
      // if(message.designation=='student'){
      //   this.questionLength = this.questionLength+1;
      //   this.numbers = Array(this.questionLength).fill(0).map((x,i)=>i);
      // }
      if(message.designation=='teacher'){
        this.questionSelected = 0;
      }
    }
  }

  updateQues(number){
    this.questionSelected = number;
  }

  private downloadDoubt(currentDownloadStatus: DownloadStatus){
    // console.log(currentDownloadStatus);
    if(currentDownloadStatus == DownloadStatus.Start)
    {
      var data = '';

      for( let m of this.messages){
        if(m.designation=='teacher'){
          data += "A"+m.qno+": "+m.message+"\n"
        }
        else{
          data += "Q"+m.qno+": "+m.message+"\n";
        }
      }
      // console.log(data)
      
      var FileSaver = require('file-saver');
      var blob = new Blob([data], {type: "text/plain;charset=utf-8"});
      FileSaver.saveAs(blob, "doubts.txt");

      this._download.changeDownloadStatus(DownloadStatus.Done);
    }
  }
}
