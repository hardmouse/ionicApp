import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { EquipmentChangeSearchResults,ApprovalPortalFilter,EquipmentChangeSearchResult} from '../common/type/common.model';
import { SubscribableService } from '../services/subscribable.service';
import { MobileService } from '../services/mobile.service';
import { FuncsService } from '../services/funcs/funcs.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  showApproved:boolean = true;
  showRejected:boolean = true;
  showPending:boolean = true;
  searchRequestsValue:string;
  searchRequestsList:EquipmentChangeSearchResult[] = [];
  PageNumber:number=1;
  searchRequestsListFilter:EquipmentChangeSearchResult[] = [];

  constructor(
    public navCtrl:NavController,
    public subs:SubscribableService,
    private mobile:MobileService,
    private funcs: FuncsService
    ) {
      
      this.subs.Mode = "";
    }
  select(item){
    console.log(item);
  }
  delete(item){
    console.log(item);
  }
  getButtonColor(_st){
    _st = _st.toLowerCase();
    switch(_st){
      case 'approved':{
        return "success";
        break; 
      }
      case 'rejected':{
        return "danger";
        break; 
      }
      default: {
        return "warning";
        break; 
      } 
    }
  }
  
  ionViewWillEnter(){
    this.getProjectInfo();
  }

  getProjectInfo(){
    // const url = 'equipmentchangerequests/requestlist';
    const url = 'requests/requestList ';
    let body : ApprovalPortalFilter = new ApprovalPortalFilter();
    this.subs.clientSelected = -1;
    body.PageNumber =  this.PageNumber;
    body.PageSize = 1000;
    const request = JSON.stringify(body);
    this.mobile.post(url,request,"").subscribe( (sc: EquipmentChangeSearchResults) =>{
      this.searchRequestsList = this.searchRequestsListFilter = sc['Data'].Requests.ListOfRequest;
      this.searchRequestsListFilter.forEach(x=>{
        x.sRequestDate =  this.funcs.formatDate(x.RequestDate);
      });
    })
  }

  toggleState(){
    this.onChangeTime(this.searchRequestsValue);
  }
  onChangeTime(e) {
    console.log(e);
    this.searchRequestsValue = (e!==undefined)?e.trim():"";
    this.searchRequestsListFilter = [];
    this.searchRequestsList.forEach(u=>{
      console.log(u);
      if(this.verifySearch(u) && this.verifyState(u)){
        this.searchRequestsListFilter.push(u);
      }
    });
  }
  verifySearch(_u){
    let _returnVal:Boolean = false;
    let _rVal = this.searchRequestsValue.toLocaleLowerCase();
    if(
        _u.BuildingItemCode.toLocaleLowerCase().indexOf(_rVal)>=0 ||
        _u.Uniformat.toLocaleLowerCase().indexOf(_rVal)>=0 ||
        _u.UniDescription.toLocaleLowerCase().indexOf(_rVal)>=0 ||
        _u.SystemType.toLocaleLowerCase().indexOf(_rVal)>=0 ||
        _u.FieldItemNumber.toLocaleLowerCase().indexOf(_rVal)>=0 ||
        _u.Model.toLocaleLowerCase().indexOf(_rVal)>=0 ||
        _u.Manufacturer.toLocaleLowerCase().indexOf(_rVal)>=0 ||
        _u.SerialNumber.toLocaleLowerCase().indexOf(_rVal)>=0
      ){
        _returnVal = true;
      }
    return _returnVal;
  }
  verifyState(_u){
    let _returnVal:Boolean = false;
    if(_u.state.toLocaleLowerCase()=="approved" && this.showApproved){
      _returnVal = true;   
    }else if(_u.state.toLocaleLowerCase()=="pending" && this.showPending){
      _returnVal = true;
    }else if(_u.state.toLocaleLowerCase()=="rejected" && this.showRejected){
      _returnVal = true;
    }
    return _returnVal;
  }
}