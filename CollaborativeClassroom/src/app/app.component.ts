import { Component } from '@angular/core';
import { NgxPubSubService } from '@pscoped/ngx-pub-sub';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CollaborativeClassroom';
  latestEvent = 'randomLast';
  
  constructor(pubsubSvc: NgxPubSubService){
    pubsubSvc.registerEventWithLastValue(this.latestEvent, undefined);
  }
}
