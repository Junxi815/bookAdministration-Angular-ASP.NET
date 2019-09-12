import { Component, OnInit } from '@angular/core';
import { SseService } from '../shared/sse.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  msgNumber:number = 0;
  sseUrl="http://10.1.1.11:3000/"; //according to server's url and port

  constructor(public sseService:SseService) { }
  
  ngOnInit() {
    this.connectWithSse();
  }
  connectWithSse(){
    this.sseService.observeStream(this.sseUrl+"api/sse").subscribe(data=>this.msgNumber=data);
  }


}
