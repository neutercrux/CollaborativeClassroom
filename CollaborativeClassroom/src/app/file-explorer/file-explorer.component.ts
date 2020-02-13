import { Component, OnInit } from '@angular/core';
import { NgxPubSubService } from '@pscoped/ngx-pub-sub';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.css']
})
export class FileExplorerComponent implements OnInit {

  subscription1: Subscription;
  private codeString;
  constructor(private pubSub: NgxPubSubService) { }

  ngOnInit() {

    this.subscription1 = this.pubSub.subscribe('randomLast',
                                data => this.codeString = data);
  }

  ngOnDestroy() {
    this.subscription1.unsubscribe();
  }

}
