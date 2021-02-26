import { Component, OnInit, Input,Output,EventEmitter } from '@angular/core';
import { NavController } from '@ionic/angular';
import { EquipmentSubHeader,EquipmentSubHeaderItem } from '../common/type/common.model';
import { Observable, BehaviorSubject, Subject, Subscription, Subscribable } from 'rxjs';
import { SubscribableService } from '../services/subscribable.service'
@Component({
  selector: 'app-sub-header',
  templateUrl: './sub-header.component.html',
  styleUrls: ['./sub-header.component.scss']
})
export class SubHeaderComponent implements OnInit {
  
  @Input() subHeader: EquipmentSubHeader;
  @Output() navStep = new EventEmitter<number>();

  isOpenMode:boolean=false;
  isJumpStep=false;
  _sub_header: Subscription;
  mode:number=1;
  cur : EquipmentSubHeaderItem = new EquipmentSubHeaderItem();
  constructor(public navCtrl:NavController,public subs:SubscribableService) { 
    
  }
  
  ngOnInit() {
    //this.cur  = this.subHeader.subheaderitems.find(x=>x.isCurrentStep == true);
    this._sub_header = this.subs.subHeader.subscribe(value => {
     
      if(value!=null){
        this.cur  = value.subheaderitems.find(x=>x.isCurrentStep == true);
        this.subHeader = value;
        this.isOpenMode = false;
        this.mode = (this.subs.Mode=="ADD")?1:0;
        this.isJumpStep = this.subs.isJumpStep;
        // if(this.subHeader.subheaderitems.findIndex(x=>x.isFinished == false)<0){
        //   this.isJumpStep = true;
        // }
        // else{
        //   this.isJumpStep = false;
        // }
      }
      
    });
   }

   ngOnDestroy(){
    if (this._sub_header) {
      //this._sub_header.unsubscribe();
    }
   }

  toggleModel(){
   
    this.isOpenMode = !this.isOpenMode;
  }
  
  nav(item:EquipmentSubHeaderItem, index:number){
    if(index == this.cur.step){return;}
    if(item.isFinished){
      this.navStep.emit(index);      
    }
    this.isOpenMode = false;
  }
}
