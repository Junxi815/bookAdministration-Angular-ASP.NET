import { Component, OnInit } from '@angular/core';
declare var $:any;

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  constructor(){}

  ngOnInit() {}
  sfix():void{
    console.log("11111");
    $('body').layout.fix();
  }
}