import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { InputConReturn } from '../type/common.model';
import { SubscribableService } from '../../services/subscribable.service';
@Component({
  selector: 'input-con',
  templateUrl: './input-con.component.html',
  styleUrls: ['./input-con.component.scss'],
})
export class InputConComponent implements OnInit {

  @Input() name: string;
  @Input() title: string;
  @Input() hasIcon:boolean;
  @Input() isSearch:boolean = false;
  @Input() hasplaceholder:boolean;
  @Input() valuecon:string;
  @Input() hideTitle:boolean;
  @Input() isValid:boolean = true;
  @Input() errorMessage:string;
  @Input() maxLen:number=100;
  @Input() infoTip:string;
  @Input() type:string;
  @Input() isManadtory:boolean;
  @Input() infoTipShow:boolean=false;
  @Output() iconclick = new EventEmitter<InputConReturn>();
  @Output() conclick = new EventEmitter<boolean>();
  inputReturn:InputConReturn=new InputConReturn();
  inputValue:string="";
  

  constructor(public subs:SubscribableService,) { 
    this.inputValue = this.valuecon;
    this.subs.tipClosing.subscribe(value => {
        if(value==this.title){
          this.infoTipShow = !this.infoTipShow;
        }else{
          this.infoTipShow = false;
        }
    });
  }

  ngOnInit() {}

  onClick(event: KeyboardEvent) {
    this.inputReturn=new InputConReturn();
    this.inputReturn.name=this.name;
    this.valuecon="";
    this.inputReturn.value=this.valuecon;
    this.iconclick.emit(this.inputReturn);
  }

  checkKeyUp($event){
    this.inputReturn=new InputConReturn();
    this.inputReturn.name=this.name;
    this.inputReturn.value=this.valuecon;
    this.inputReturn.isBlur= false;
    this.iconclick.emit(this.inputReturn);
  }

  hideSearchs(){
    this.inputReturn=new InputConReturn();
    this.inputReturn.name=this.name;
    this.inputReturn.value=this.valuecon;
    this.inputReturn.isBlur= true;
    this.iconclick.emit(this.inputReturn);
  }

  columnClick(){
    this.conclick.emit(true);
  }

  checkClass(){
    return this.isValid ? '' : 'danger';
  }

  infoTipShowing(){
    this.subs.publicTipShow = false;
    let _n = this.title;
    this.subs.tipClosing.next(_n);
  }

}
