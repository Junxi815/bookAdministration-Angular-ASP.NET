import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-stars',
  templateUrl: './stars.component.html',
  styleUrls: ['./stars.component.css']
})
export class StarsComponent implements OnInit {
  @Input()
  rating:number=0;

  @Output()
  changeRating: EventEmitter<number> = new EventEmitter();
  
  stars:Array<boolean>;

  constructor() { }

  ngOnInit() {
    // for(let i=1;i<=5;i++){
    //   this.stars.push(i>this.rating);
    // }
  }
  ngOnChanges(changes:SimpleChanges){
    let change = changes['rating'];
    let cur = change.currentValue;
    let pre = change.previousValue;
    if(pre!==cur){
      this.stars = [];
      for(let i=1;i<=5;i++){
        this.stars.push(i>cur);
      }
    }
    
  }

  clickHandler(i:number){
    this.changeRating.emit(i+1);
  }



}
