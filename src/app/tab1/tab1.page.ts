import { Component,OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { bindCallback, from } from 'rxjs';
import { storageVariableNames,GetEquipmentsRequest,SearchEquipmentResponse,EquipmentRecord,BuildingRecord } from '../common/type/common.model';
import { NavController } from '@ionic/angular';
import { MobileService } from '../services/mobile.service';
import { ListItem } from  '../common/type/equipment-steps';
import { LoginService } from '../modules/security/services/login.service';
import { InputConReturn} from '../common/type/common.model';
import { Storage } from '@ionic/storage';
import { SubscribableService } from '../services/subscribable.service';
import { ClientForSelectResponseModel, UserInfoResponseModel } from '../modules/security/classes/authModels';
import { ConnectionStatus, NetworkService } from '../middleware/network.service';
import { OfflineQueryService } from '../common/service/offline-query.service';
import { TranslateConfigService } from '../common/service/translate-config.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{
  constructor(
    private translateConfigService: TranslateConfigService,
    private storage: Storage,
    private mobile:MobileService,
    private loginService: LoginService,
    public navCtrl:NavController,
    public subs:SubscribableService,
    public offlineQuery : OfflineQueryService,
    public networkService: NetworkService
    ) {
      this.storage.remove(storageVariableNames.SEARCHEQUIPMENT);
    }

  

  
  BuildingId:string = "CM0A793";//PUG0005 CM0B246 CM0A392 MTRLPQFB CM0A793 007403 CM0A993
  showSearchEquipList:boolean = false;
  showNoResult:boolean = false;
  searchEquipList:EquipmentRecord[] = [];
  equipFilter:EquipmentRecord[] = [];
  equipSearchValue:string;
  areaBuildinglist:BuildingRecord[] = [];
  // showBuildingAddEquipList:boolean = false;
  // searchBuildingAddEquipList:any = [];
  // buildingFilter:any = [];
  // buildingSearchValue:string;
  debugBuildingId:string="";

  ngOnInit() {
   
  }

  ionViewWillEnter(){
    var isOnline = this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Online;
    this.subs.isOffline = !isOnline;
    this.initAreaBuildingsSync();
    this.initAreaBuildings();
    this.initEquipmentSearch();
    this.subs.Mode = "";
    this.subs.clientSelected = parseInt(this.areaBuildinglist.find(x=>x.BuildingId == this.BuildingId).ClientId);
    this.equipSearchValue = "";
    this.showSearchEquipList = false;
    this.storage.remove(storageVariableNames.SEARCHEQUIPMENT);
  }



  getSearchEquipments(){
    const url = 'equipment/searchequipmentsbybuilding/';
    let body : GetEquipmentsRequest = new GetEquipmentsRequest();
    body.BuildingId =  this.BuildingId;
    body.Clients = this.areaBuildinglist.find(x=>x.BuildingId == this.BuildingId).ClientId;
    //body.UserId = this.subs.userInfo.UserId;
    //body.Clients = this.subs.accessClients.map(x=>x.Id).toString();

    // body.BuildingId = "PUG0005";
     //body.UserId = "128470343";
     //body.Clients = "46";
    const request = JSON.stringify(body);
    this.mobile.post(url,request,"").subscribe( (sc: SearchEquipmentResponse)  =>{
        console.log(sc);
        sc.BuildingId = this.BuildingId;
        if(sc.ListEquipments.length >0){
          this.searchEquipList = sc.ListEquipments.sort((one, two)=>(one.Status < two.Status ? -1:1));
          this.sortListEquipment(this.searchEquipList);
        }
        else{
          this.getSearchEquipments2("007403");
        }
      });
  }

  getSearchEquipmentsOffline(){
    if(this.subs.isOffline){
      this.offlineQuery.getEquipmentRecords(this.BuildingId).then((eq :EquipmentRecord[])=>{
        console.log(eq);
        if(eq.length >0){
          this.searchEquipList = eq.sort((one, two)=>(one.Status > two.Status ? -1:1));
          this.sortListEquipment(this.searchEquipList);
        }
      });
    }
  }

  getSearchEquipments2(buildingid:string){
    const url = 'equipment/searchequipmentsbybuilding/';
    let body : GetEquipmentsRequest = new GetEquipmentsRequest();
    body.BuildingId =  buildingid;
    body.Clients = this.areaBuildinglist.find(x=>x.BuildingId == this.BuildingId).ClientId;
    const request = JSON.stringify(body);
    this.mobile.post(url,request,"").subscribe( (sc: SearchEquipmentResponse)  =>{
        console.log(sc);
        sc.BuildingId = this.BuildingId;
        this.searchEquipList = sc.ListEquipments.sort((one, two)=>(one.Eqnum > two.Eqnum ? -1:1));
        this.sortListEquipment(sc.ListEquipments);
      });
  }

  SaveToStorage(sc:SearchEquipmentResponse){
    if(this.searchEquipList !==undefined) {
      this.storage.set(storageVariableNames.SEARCHEQUIPMENT, sc);
    }
  }

  initEquipmentSearch(){
    this.storage.get(storageVariableNames.SEARCHEQUIPMENT).then((data : SearchEquipmentResponse)=> {
      if (data !==undefined && data !=null && data.BuildingId == this.BuildingId) {
        this.searchEquipList = data.ListEquipments;
      }
      else{
        if(this.subs.isOffline){
          this.getSearchEquipmentsOffline();
        }
        else{
          this.getSearchEquipments();
        }
        
      }
    });
  }

  // getBuildingInfo(){
  //   const url = 'equipment/searchbuildingadd/';
  //   this.mobile.getdebug(url).subscribe( binfo =>{
  //     // this.searchEquipList = binfo.Data.Equipment.ListOfEquipment; 
  //     this.searchBuildingAddEquipList = binfo.Data.Building.ListOfBuilding;
  //   });
  // }
  // getEquipmentInfo(){
  //   const url = 'equipment/searchbuildingadd/';
  //   this.mobile.getdebug(url).subscribe( einfo =>{
  //     // this.searchEquipList = einfo.Data.BuildingEquipments.ListOfItems; 
  //     // console.log("this.searchEquipList:",this.searchEquipList);
  //     // this.searchBuildingAddEquipList = einfo.Data.Building.ListOfBuilding;
      
  //     this.searchEquipList = einfo.Data.Equipment.ListOfEquipment; 
  //   });
  // }
  
  resetDropdown(){
    this.showSearchEquipList = false;
    //this.showBuildingAddEquipList = false;
  }
  getEquipValue(rv :InputConReturn){
    this.showSearchEquipList = true;
    this.equipSearchValue = (rv.value!==undefined)?rv.value.trim():"";
    this.equipFilter = [];
    this.searchEquipList.forEach(u=>{
      if(this.equipFilter.length>=200){
        return;
      }
      if(this.verifyEquipSearch(u)){
        this.equipFilter.push(u);
      }
    });
    if(this.equipFilter.length==0){
      this.showNoResult = true;
    }
    else{
      this.showNoResult = false;
    }
  }
 
  sortListEquipment(listequip:EquipmentRecord[]){
    let _list1 = listequip.filter(x=>x.Status.toUpperCase()=="ACTIVE");
    let _list2 = listequip.filter(x=>x.Status.toUpperCase()=="DECOMMISSIONED");
    let _list3 = listequip.filter(x=>x.Status.toUpperCase()=="INACTIVE");
    _list1 = _list1.sort((one, two)=>(one.Eqnum > two.Eqnum ? -1:1));
    _list2 = _list2.sort((one, two)=>(one.Eqnum > two.Eqnum ? -1:1));
    _list3 = _list3.sort((one, two)=>(one.Eqnum > two.Eqnum ? -1:1));
    this.searchEquipList=[];
    this.searchEquipList = this.searchEquipList.concat(_list1,_list2,_list3);
    let sc : SearchEquipmentResponse = new SearchEquipmentResponse();
    sc.BuildingId = this.BuildingId;
    sc.ListEquipments = this.searchEquipList
    this.SaveToStorage(sc);
  }
  
  verifyEquipSearch(_u){
    let _returnVal:Boolean = false;
    let _rVal = this.equipSearchValue.toLocaleLowerCase();
    if(
        _u.EqtypeCode.toLocaleLowerCase().indexOf(_rVal)>=0 ||
        _u.Eqnum.toLocaleLowerCase().indexOf(_rVal)>=0 ||
        _u.ShortDesc.toLocaleLowerCase().indexOf(_rVal)>=0 ||
        _u.SerialNum.toLocaleLowerCase().indexOf(_rVal)>=0 ||
        _u.FieldItemNum.toLocaleLowerCase().indexOf(_rVal)>=0 ||
        _u.Manufacturer.toLocaleLowerCase().indexOf(_rVal)>=0 ||
        _u.ModelNumber.toLocaleLowerCase().indexOf(_rVal)>=0 ||
        _u.ModelName.toLocaleLowerCase().indexOf(_rVal)>=0 ||
        (_u.Status && _u.Status.toLocaleLowerCase().indexOf(_rVal)>=0 )
      ){
        _returnVal = true;
      }
    return _returnVal;
  }
  // verifyBuildingSearch(_u){
  //   let _returnVal:Boolean = false;
  //   let _rVal = this.buildingSearchValue.toLocaleLowerCase();
  //   if(
  //     _u.ClientLocationCode.toLocaleLowerCase().indexOf(_rVal)>=0 ||
  //     _u.PhysicalLocationAddress.toLocaleLowerCase().indexOf(_rVal)>=0 ||
  //     _u.City.toLocaleLowerCase().indexOf(_rVal)>=0 ||
  //     _u.Province.toLocaleLowerCase().indexOf(_rVal)>=0 ||
  //     _u.Country.toLocaleLowerCase().indexOf(_rVal)>=0
  //     ){
  //       _returnVal = true;
  //     }
  //   return _returnVal;
  // }
  
  selectSearchEquipItem(_ei){
    let navigationExtras: NavigationExtras = {
      queryParams: {
        BuildingId: JSON.stringify(this.equipFilter[_ei].BuildingId),
        BuildingItemId:JSON.stringify(this.equipFilter[_ei].EquipmentId),
        Mode:JSON.stringify(storageVariableNames.MODEEDIT),
      }
    };

    this.resetDropdown();
    this.cleanEquipmentAddStorage();
    this.subs.isJumpStep=true;
    this.subs.Mode = "EDIT";
    this.subs.isDFM = (this.equipFilter[_ei].IsDFM == "1")?"Y":"N";
    //this.subs.isDFM="Y";
    this.subs.clientSelected = parseInt(this.areaBuildinglist.find(x=>x.BuildingId == this.equipFilter[_ei].BuildingId).ClientId);
    this.equipSearchValue = this.searchEquipList[_ei].EqtypeCode + '-' + this.searchEquipList[_ei].ShortDesc;
    this.navCtrl.navigateForward(storageVariableNames.STEP5NAV,navigationExtras);
  }

  selectSearchBuilding(_ei){
   
    let navigationExtras: NavigationExtras = {
      queryParams: {
          BuildingId: JSON.stringify(this.areaBuildinglist[_ei].BuildingId),
          Mode:JSON.stringify(storageVariableNames.MODEADD),
      }
    };
    this.resetDropdown();
    this.cleanEquipmentAddStorage();
    this.subs.Mode = "ADD";
    this.subs.isJumpStep=false;
    this.subs.isDFM = this.areaBuildinglist[_ei].IsDFM;
    this.subs.clientSelected = parseInt(this.areaBuildinglist[_ei].ClientId);
    console.log(storageVariableNames.STEP1NAV,navigationExtras);
    this.navCtrl.navigateForward(storageVariableNames.STEP1NAV,navigationExtras);
  }

  switchBuilding(_ei){
    this.BuildingId = this.areaBuildinglist[_ei].BuildingId;
    this.subs.clientSelected = parseInt(this.areaBuildinglist[_ei].ClientId);
    //this.getSearchEquipments();
    if(this.subs.isOffline){
      this.getSearchEquipmentsOffline();
    }
    else{
      this.getSearchEquipments();
    }
  }

  conClick(){
    this.resetDropdown();
  }

  cleanEquipmentAddStorage(){
    this.storage.remove(storageVariableNames.STEP1DATACLIENTINFO);
    this.storage.remove(storageVariableNames.STEP2DATAEQIPMENTTYPE);
    this.storage.remove(storageVariableNames.STEP3DESCRIPTION);
    this.storage.remove(storageVariableNames.STEP4DATAWARRENTY);
    this.storage.remove(storageVariableNames.SUBHEADER);
    this.storage.remove(storageVariableNames.EUIIPMENTDETAILGET);
    this.subs.isJumpStep = false;
    this.subs.isEditChanged = false;
  }

  getUserInfo(){
    this.loginService.retrieveUserInfo().subscribe((user:UserInfoResponseModel)=>{
      console.log(user);
      this.subs.userInfo = user;
    });

    this.loginService.retrieveAvailableClients().subscribe((clients:Array<ClientForSelectResponseModel>)=>{
      console.log(clients);
      this.subs.accessClients = clients;
      this.initEquipmentSearch();
    });
  }

  navigateToMapSearch(){
    this.navCtrl.navigateForward('/tabs/tab3');
  }

  closeDropdown(){
    this.showSearchEquipList = false;
  }

  initAreaBuildings(){
    if(this.areaBuildinglist.length<2){
      let b1 : BuildingRecord = new BuildingRecord();
      b1.BuildingId = "CM0A793";
      b1.BuildingDesc = "CM0A793 - 00016_RIDEAU AND SUSSEX";
      b1.IsDFM = "Y";
      b1.ClientId = "46";
      let b2 : BuildingRecord = new BuildingRecord();
      b2.BuildingId = "007403";
      b2.BuildingDesc = "007403 - TELUS EAST - ADMIN";
      b2.IsDFM = "N";
      b2.ClientId = "5";
      let b3 : BuildingRecord = new BuildingRecord();
      b3.BuildingId = "CM0C991";
      b3.BuildingDesc = "CM0C991 - 02003_LARRY UTECK & NINE MILE BANKING CENTRE";
      b3.IsDFM = "Y";
      b3.ClientId = "46";
      let b4 : BuildingRecord = new BuildingRecord();
      b4.BuildingId = "TDA0193";
      b4.BuildingDesc = "TDA0193 - 0367_LUNENBURG";
      b4.IsDFM = "N";
      b4.ClientId = "48";
      this.areaBuildinglist.push(b1);
      this.areaBuildinglist.push(b2);
      this.areaBuildinglist.push(b3);
      this.areaBuildinglist.push(b4);
    }
  }

  initAreaBuildingsSync(){
    this.areaBuildinglist = this.subs.areaBuildinglist;
    if(this.areaBuildinglist && this.areaBuildinglist.length>0){
      this.BuildingId = this.areaBuildinglist[0].BuildingId;
    }
  }

  isEditOrAddEquipment:boolean;
  debug(){
    this.subs.isOffline = !this.subs.isOffline;
    //this.isEditOrAddEquipment = !this.isEditOrAddEquipment;
  }

  
  conDebugClick(rv :InputConReturn){
    this.debugBuildingId = (rv.value!==undefined)?rv.value.trim():"";
  }
  onChangeModuleNumberEvent(rv :InputConReturn){
    this.debugBuildingId  = (rv.value!==undefined)?rv.value.trim():"";
  }


  refreshEquipments(){
    this.BuildingId = this.debugBuildingId;
    let b2 : BuildingRecord = new BuildingRecord();
    b2.BuildingId = this.BuildingId;
    b2.BuildingDesc = this.BuildingId + " - testing building";
    b2.IsDFM = "N";
    b2.ClientId = "5";

    this.areaBuildinglist.push(b2);
    this.getSearchEquipments();
  }
  setLang(_v){
    console.log(_v);
    this.translateConfigService.setLanguage(_v);
  }
}
