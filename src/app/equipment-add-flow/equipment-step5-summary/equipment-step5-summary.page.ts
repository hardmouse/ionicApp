import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { NavController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { EquipmentAddFlowPage } from '../equipment-add-flow.page'
import { storageVariableNames} from '../../common/type/common.model';
import { ActivatedRoute} from '@angular/router';
import { MobileService } from '../../services/mobile.service';
import { FuncsService } from '../../services/funcs/funcs.service';
import { Storage } from '@ionic/storage';
import { Step1Client,Step1ValidationData,Step3ValidationData,Step2EquipmentType,Step2ValidationData,RequestEquiment,Step2EquipTypeData,Step1ClientData,CreateEquipmentResponse,
  Step3DescriptionData,Step4WarrantyData,Step4ValidationData,RequestEquipmentAdd,RequestFile,FlexRequest,BgisMediaFile,Uniformat,UniformatDescription,RadioListItem } from '../../common/type/equipment-steps'
import { SubscribableService } from '../../services/subscribable.service';
import { AlertService } from '../../common/service/alert.services';
import { OfflineQueryService } from '../../common/service/offline-query.service';
import { OfflineManagerService } from '../../middleware/offline-manager.service';

@Component({
  selector: 'app-equipment-step5-summary',
  templateUrl: './equipment-step5-summary.page.html',
  styleUrls: ['./equipment-step5-summary.page.scss'],
})
export class EquipmentStep5SummaryPage extends EquipmentAddFlowPage implements OnInit {

  constructor(public navCtrl:NavController,
    public storage: Storage,
    public route: ActivatedRoute,
    public subs:SubscribableService,
    private cd: ChangeDetectorRef,
    private mobile:MobileService,
    public alertService: AlertService,
    public loadingController: LoadingController,
    public offlineQuery : OfflineQueryService,
    public offlineManager : OfflineManagerService,
    private funcs: FuncsService) { 
    super(navCtrl,storage,route,subs,alertService);
    this.step = 5;
    this.Criticality = this.initCapacity();
    this.ConditionRating = this.initConditionRate();
  }

  step1Val : Step1ValidationData = new Step1ValidationData();
  step2Val : Step2ValidationData = new Step2ValidationData();
  step3Val : Step3ValidationData = new Step3ValidationData();
  step4Val : Step4ValidationData = new Step4ValidationData();
  step1ValBak : Step1ValidationData = new Step1ValidationData();
  step2ValBak : Step2ValidationData = new Step2ValidationData();
  step3ValBak : Step3ValidationData = new Step3ValidationData();
  step4ValBak : Step4ValidationData = new Step4ValidationData();

  showEquipmentSepc:boolean=false;
  sStep2ManuDate:string="";
  sStep4StartDate:string="";
  sStep4KeyDate:string="";
  sStep4InstallationDate:string="";
  sStep4PartsWarrantyDate:string="";
  sStep4LabourWarrantyDate:string="";
  sStep4PurchaseDate:string="";
  request:RequestEquipmentAdd;
  step2Data : Step2EquipmentType = new Step2EquipmentType();
  step1Data : Step1Client = new Step1Client();
  step4Data:Step4WarrantyData = new Step4WarrantyData();
  step3Data:Step3DescriptionData = new Step3DescriptionData();
  showUPC:boolean = false;
  showPurchaseInfo:boolean = false;
  Criticality : RadioListItem[]=[];
  criticalityDesc:string ="";
  ConditionRating : RadioListItem[]=[];
  conditionRatingDesc:string="";
  ionViewWillEnter() {
    this.Mode = this.subs.Mode;
    if(this.Mode=="ADD"){
      this.isJumpStep = false;
      this.initStep1Data();
      this.initStep2Data();
      this.initStep3Data();
      this.initStep4Data();
    }
    else{
      this.getEquipmentSummary();
    }
    
  }

  navigateToStep4Warranty(){
    this.subs.isEditChanged = true;
    this.navSubHeaderStatus(4);
    this.navCtrl.navigateForward(storageVariableNames.STEP4NAV);
  }

  SubmitSummary(){
    this.initRequestEquipmentAdd();
  }

  initRequestEquipmentAdd(){
    this.request = new RequestEquipmentAdd();
    //this.request.isInSideBuilding = (this.step1Val.isInsideBuilding == 1)?true:false;
    this.request.BuildingId = this.step1Val.BuildingId;
    this.request.FmzId = this.step1Val.FmzId;
    this.request.RegionId = this.step1Val.RegionId;

    this.request.floorSearchValue = this.step1Val.floorSearchValue;
    this.request.FloorId  = (this.step1Val.floorSearchKey === undefined || this.step1Val.floorSearchKey == "") ? null : parseInt(this.step1Val.floorSearchKey);
  
    this.request.CriticalityCode  = this.step1Val.CriticalityValue;
    this.request.isInHerigageArea = this.step1Val.isInHerigageArea;
    this.request.AreaId  = (this.step1Val.areaSearchKey === undefined || this.step1Val.areaSearchKey == "") ? null : parseInt(this.step1Val.areaSearchKey);
    this.request.RegionDesc = this.step1Val.RegionDesc;
    this.request.FMZDesc = this.step1Val.FMZDesc;
    this.request.BuildingDesc = this.step1Val.BuildingDesc;
    this.request.ClientCode = this.step1Val.ClientCode;
    this.request.ClientLocation = this.step1Val.ClientLocation;
    this.request.SpecificLocation = this.step1Val.SpecificLocation;

    this.request.IsDFM = this.step2Val.IsDFM;
    this.request.FieldItemNumber = this.step2Val.FieldItemNumber;
    this.request.ModelNumber  = this.step2Val.ModelNumber;
    this.request.ModelName = this.step2Val.ModelName;
    this.request.ManufacturedDate = (this.step2Val.ManufacturerDate === undefined)? null : new Date(this.funcs.formatDate(this.step2Val.ManufacturerDate));
    this.request.Manufacturer = this.step2Val.Manufacturer;
    this.request.SerialNumber = this.step2Val.SerialNumber;
    this.request.BuildingItemId = (this.step2Val.BuildingItemValue === undefined || this.step2Val.BuildingItemValue == "") ? null : parseInt(this.step2Val.BuildingItemValue);
  
    this.request.SystemTypeId  = (this.step2Val.SystemTypeKey === undefined || this.step2Val.SystemTypeKey == "") ? null : parseInt(this.step2Val.SystemTypeKey);
   
    this.request.Description  = this.step2Val.DescriptionValue;
    this.request.FrenchDescription  = this.step2Val.DescriptionFrValue;
    this.request.EqNum  = this.step2Val.BuildingItemCode;
    this.request.ParentItemId  = (this.step2Val.ParentItemSearchKey === undefined || this.step2Val.ParentItemSearchKey == "") ? null : parseInt(this.step2Val.ParentItemSearchKey);
   
    this.request.Status  = this.step3Val.status; //(this.step3Val.status == 1)?"Active":"Decommissioned";
    this.request.BuildingItemTypeDesc = this.step2Val.UniformatSearchValue;
    this.request.BuildingItemTypeId  = this.step2Val.UniformatSearchKey;
    this.request.UnitCode = "";

    //this.request.DecommissionedDate = new Date(this.funcs.formatDate(this.step3Val.DecommissionedDate));
    this.request.ConditionRating  = this.step3Val.ConRateValue;
    this.request.isRepExistEqu = this.step3Val.isRepExistEqu;
    this.request.commentNote = this.step3Val.commentNote;
    
    this.request.CrossRef  = (this.step3Val.EquipmentSearchKey === undefined || this.step3Val.EquipmentSearchKey == "") ? null : parseInt(this.step3Val.EquipmentSearchKey);
  
    this.request.Base64Files  = [];
    this.step3Val.files.forEach(x=>{
      let f :RequestFile = new RequestFile();
      f.FileName = x.filepath;
      f.FieldID = x.fieldId;
      f.Status = x.status;
      f.PictureID = x.pictureId;
      let base64StringArray: string[]= x.webviewPath.split("base64,")

      if(base64StringArray.length > 0){
          f.WebViewPath = base64StringArray[1];
      }
      this.request.Base64Files.push(f);
    })

    this.request.StartDate = new Date(this.step4Val.StartDate);
    this.request.KeyDate = new Date(this.step4Val.KeyDate);
    this.request.isMaintenanceResponsibility = this.step4Val.isMaintenanceResponsibility;
    this.request.InstallationDate = (this.step4Val.InstallationDate === undefined) ? null : new Date(this.funcs.formatDate(this.step4Val.InstallationDate));
    this.request.PartWarrantyExpirationDate  = (this.step4Val.PartsWarrantyDate === undefined) ? null : new Date(this.funcs.formatDate(this.step4Val.PartsWarrantyDate)); 
    this.request.LabourWarrantyExpirationDate  = (this.step4Val.LabourWarrantyDate === undefined) ? null : new Date(this.funcs.formatDate(this.step4Val.LabourWarrantyDate));
    this.request.PurchaseDate = new Date(this.funcs.formatDate(this.step4Val.PurchaseDate));
    this.request.PurchasePrice = this.step4Val.PurchasePrice;
    this.request.IsPurchasePriceValid = this.step4Val.isPurchasePriceValid;
    this.request.Ownership  = this.step4Val.OwnershipKey;
    this.request.AcquisitionStatus  = this.step4Val.AcquisitionStatusKey;
    this.request.DispositionStatus = this.step4Val.DispositionStatusKey;
    this.request.PMResponsibility  = this.step4Val.ResponsibilityValue;
    this.request.PMResponsibilityComment = this.step4Val.PMResponsibilityComment;
    this.request.VendorName  = this.step4Val.WarrantyVenderName;

    this.request.FlexRequest = new FlexRequest();
    this.request.FlexRequest.Id = this.BuildingItemId;
    this.request.FlexRequest.FlexObjectId = this.BuildingItemId;
    this.request.FlexRequest.FlexFieldValues = [];
    this.request.FlexRequest.FlexFieldIds = [];
    
    if(this.step2Val.UniformatSelected && this.step2Val.UniformatSelected.UDescList){
      this.step2Val.UniformatSelected.UDescList.forEach(x=>{
        let _udf = [];
        if(x.ControlType ==1 || x.ControlType ==0){
          _udf.push(x.UDFOptionSearchValue);
          this.request[x.Name] = x.UDFOptionSearchValue;
        }
        else{
          _udf.push(x.UDFOptionSearchKey);
          this.request[x.Name] = x.UDFOptionSearchKey;
        }
        this.request.FlexRequest.FlexFieldValues.push(_udf);
        this.request.FlexRequest.FlexFieldIds.push(Number(x.Id));
        
      });
  
    }
    this.request.FlexRequest.FlexFieldValues = null;
    if(!this.subs.isOffline){
      this.submit();
    }
    else{
      //save to the queue
      let requesttype = this.subs.Mode;
      this.offlineManager.saveRequest("equipment/Save/", requesttype, JSON.stringify(this.request));
      if(this.request.CrossRef >0){
        this.offlineManager.saveRequest("equipment/Save/", "cross", JSON.stringify(this.request.CrossRef));
      }
      this.presentSuccessConfirm(true,"Offline Save to the queue!");
    }

  }

  submit(){
    const url = 'equipment/Save/';
    const request = JSON.stringify(this.request);
    console.log(request);
    this.presentLoading();
    this.mobile.post(url,request,"").subscribe( (r : CreateEquipmentResponse)  =>{
      console.log(r);
      this.loading.dismiss();
      if(r.Result.Success){
        if(this.request.CrossRef >0){
          this.crossEquipment(this.request.CrossRef)
        }
        else{
          //this.loading.dismiss();
          this.presentSuccessConfirm(r.Result.Success,r.Result.ErrorMessage);
        }
      }
      else{
        this.loading.dismiss();
        this.presentSuccessConfirm(r.Result.Success,r.Result.ErrorMessage);
      }
     
    });
  }

  loading:any;
  async presentLoading() {
     this.loading = await this.loadingController.create({
      message: '',
      //duration: 2000
    });
    await this.loading.present();

  }
  
  async presentSuccessConfirm(s:boolean,e:string) {
    let buttonsSuccess = [{
      text: 'Continue',
      cssClass: 'button-1',
      handler: () => {
        this.navCtrl.navigateForward(storageVariableNames.MYREQUEST);
      }
    }];
    let buttons = [{
      text: 'Go Back',
      role: 'cancel',
      cssClass: 'button-1',
      handler: (blah) => {
        console.log('Confirm Cancel: blah');
      }
    }, {
      text: 'Continue',
      cssClass: 'button-2',
      handler: () => {
        this.navCtrl.navigateForward(storageVariableNames.MYREQUEST);
      }
    }];
    if(s){
      if(this.subs.Mode=='ADD'){
        this.alertService.goToRequestListAlert(buttonsSuccess,'Equipment is added successfully!');
      }else{
        this.alertService.goToRequestListAlert(buttonsSuccess,'Equipment is updated successfully!');
      }
      this.subs.clearMode();
    }
    else{
      this.alertService.addEqFailedAlert(buttons,e);
    }
  }
  
  initStep1Data(){
    this.storage.get(storageVariableNames.STEP1DATACLIENTINFO).then((data : Step1Client)=> {
      if (data) {
        this.step1Val = data.Data.VALDATA;
        this.step1Val.BuildingId = data.Data.BuildingId;
        this.step1Val.FmzId = data.Data.FmzId;
        this.step1Val.RegionId = data.Data.RegionId;
        this.step1ValBak = data.Data.DIRTYDATA;
        let _c = this.Criticality.find(x=>x.Key == this.step1Val.CriticalityValue);
        if(_c){ this.criticalityDesc = _c.Value;}
      }
      else{

        if(this.subs.isOffline){
          this.offlineQuery.getStep1ClientData(this.BuildingId).then((sc : Step1ClientData)=>{
            this.step1Data.Data = sc;
            this.SaveToStorageStep1();
          });
        }
        else{
          const url = 'equipment/equipmentclient/';
          let body : RequestEquiment = new RequestEquiment();
          body.BuildingId =  this.BuildingId;
          
          const request = JSON.stringify(body);
          this.mobile.post(url,request,"").subscribe( (sc : Step1ClientData)  =>{
              console.log(sc);
              this.step1Data.Data = sc;
              this.SaveToStorageStep1();
            });
        }
        
      }
    });
  }

  initStep2Data(){
    this.storage.get(storageVariableNames.STEP2DATAEQIPMENTTYPE).then((data : Step2EquipmentType) => {
      if (data) {
        this.step2Val = data.Data.VALDATA;
        this.step2ValBak = data.Data.DIRTYDATA;
        if(this.step2Val!==undefined){
          this.subHeader.subheaderitems[4].subline = this.step2Val.BuildingItemCode;
          this.SaveSubHeaderToStorage();
          if(this.step2Val.UniformatSelected && this.step2Val.UniformatSelected.UDescList  && this.step2Val.UniformatSelected.UDescList.length>0 ){
            this.step2Val.UniformatSelected.UDescList.forEach(x=>{
              if(x.UDFOptionSearchValue!==null && x.UDFOptionSearchValue!==""){
                this.showEquipmentSepc = true;
              }
            });
          }
          else{ this.showEquipmentSepc = false;}
          this.step2Val.sManufacturerDate = this.funcs.formatDate(this.step2Val.ManufacturerDate);
        }
      }
      else{
        
        if(this.Mode=="EDIT"){

          if(this.subs.isOffline){
            this.offlineQuery.getStep2EquipmentTypetData(this.BuildingId).then((sc : Step2EquipTypeData)=>{
              this.step2Data.Data = sc;
              this.SaveToStorageStep2();
            });
          }
          else{
            const url = 'equipment/eqiupmenttype/';
            let body : RequestEquiment = new RequestEquiment();
            body.BuildingId =  this.BuildingId;
            const request = JSON.stringify(body);
            this.mobile.post(url,request,"").subscribe( (sc : Step2EquipTypeData)  =>{
              console.log(sc);
              this.step2Data.Data = sc;
              this.step2Val.sManufacturerDate = this.funcs.formatDate(this.step2Val.ManufacturerDate);
              this.SaveToStorageStep2();
            });
          }
          
        }
        
      }
      this.initShowUPC();
    });
  }

  initStep3Data(){
    this.storage.get(storageVariableNames.STEP3DESCRIPTION).then((data : Step3DescriptionData) => {
      if (data) {
        this.step3Data = data;
        this.step3Val = data.VALDATA;   
        this.step3ValBak = data.DIRTYDATA;
        let _c = this.ConditionRating.find(x=>x.Key == this.step3Val.ConRateValue);
        if(_c){ this.conditionRatingDesc = _c.Value;}
        this.SaveEditStep3Data(); 
      }
      else{
        this.mappingBakStep3Fields();
        this.SaveEditStep3Data(); 
      }
    });
  }


  initStep4Data(){
    this.storage.get(storageVariableNames.STEP4DATAWARRENTY).then((data : Step4WarrantyData) => {
      if (data) {
        this.step4Val = data.VALDATA;
        this.step4ValBak = data.DIRTYDATA;
        //if(this.subs.Mode=="ADD"){
          if(this.step4Val.StartDate.indexOf("T00:00:00")<0 && this.step4Val.StartDate.indexOf("-")<10){
            this.step4Val.StartDate = this.step4Val.StartDate + "T00:00:00";
          }
          if(this.step4Val.KeyDate.indexOf("T00:00:00")<0 && this.step4Val.KeyDate.indexOf("-")<10){
            this.step4Val.KeyDate = this.step4Val.KeyDate + "T00:00:00";
          }
          this.step4Val.StartDate = this.funcs.formatDate(this.step4Val.StartDate);
          this.step4Val.KeyDate = this.funcs.formatDate(this.step4Val.KeyDate);
        //}
        
        this.step4Val.sInstallationDate = this.funcs.formatDate(this.step4Val.InstallationDate);
        this.step4Val.sPartsWarrantyDate = this.funcs.formatDate(this.step4Val.PartsWarrantyDate);
        this.step4Val.sLabourWarrantyDate = this.funcs.formatDate(this.step4Val.LabourWarrantyDate);
        this.step4Val.sPurchaseDate = this.funcs.formatDate(this.step4Val.PurchaseDate);
      }
      else{
        if(this.Mode=="EDIT"){
          if(this.subs.isOffline){
            this.offlineQuery.getStep4EquipmentProcurementtData(this.BuildingId).then((sc : Step4WarrantyData)=>{
              this.step4Data = sc;
              this.SaveEditStep4Data();
            });
          }
          else{
            const url = 'equipment/equipmentprocurement/';
            let body : RequestEquiment = new RequestEquiment();
            body.BuildingId =  this.BuildingId;
            const request = JSON.stringify(body);
            this.mobile.post(url,request,"").subscribe( (sc : Step4WarrantyData)  =>{
              console.log(sc);
              this.step4Data = sc;
              this.SaveEditStep4Data();
            });
          }
          
        }
      }
      this.initShowPurchaseInfo();
    });

  }

  getEquipmentSummary(){
    this.storage.get(storageVariableNames.EUIIPMENTDETAILGET).then((data : RequestEquipmentAdd) => {
      if (data) {
        this.request = data;
        this.initEquipmentEdit();
      }
      else{
        if(this.subs.isOffline){
          this.offlineQuery.getEquipmentById(parseInt(this.BuildingItemId)).then(eq=>{
            this.request = eq;
            this.initEquipmentEdit();
          });
          
        }
        else{
          const url = 'equipment/getequipment';
          let body : RequestEquiment = new RequestEquiment();
          body.BuildingId =  this.BuildingId;
          body.BuildingItemId =  this.BuildingItemId;
          const request = JSON.stringify(body);
          this.presentLoading();
          this.mobile.post(url,request,request).subscribe( (sc : RequestEquipmentAdd)  =>{
              this.storage.set(storageVariableNames.EUIIPMENTDETAILGET, sc);
              this.loading.dismiss();
              console.log(sc);
              this.request = sc;
              this.initEquipmentEdit();
            });          
        }
      }
    });
  }


  crossEquipment(crossItemId:number){
    const url = 'equipment/getequipment';
    let body : RequestEquiment = new RequestEquiment();
    body.BuildingId =  this.BuildingId;
    body.BuildingItemId =  crossItemId.toString();
    const request = JSON.stringify(body);
    //this.presentLoading();
    this.mobile.post(url,request,request).subscribe( (sc : RequestEquipmentAdd)  =>{
        this.storage.set(storageVariableNames.EUIIPMENTDETAILGET, sc);
        //this.loading.dismiss();
        console.log(sc);
        this.request = sc;
        if(this.request.Status != "Inactive"){
          this.request.Status = "Inactive";
          this.crossEquipmentUpdate(this.request);
        }
        else{
          //this.loading.dismiss();
          this.presentSuccessConfirm(true,"");
        }
      }); 
  }

  crossEquipmentUpdate(request:any){
    const url = 'equipment/Save/';
    const body = JSON.stringify(request);
    console.log(request);
    
    this.mobile.post(url,body,"").subscribe( (r : CreateEquipmentResponse)  =>{
      console.log(r);
      let error="";
      if(r.Result.Success){
        error = " Update replace equipment to Inactive " + r.Result.ErrorMessage;
      }
      
      this.presentSuccessConfirm(r.Result.Success,error);
    });
  }

  convertNulltoEmpty(v:any){
    return (v==null || v =="" || v==0)?"":v.toString();
  }

  initEquipmentEdit(){

    this.step1Val = new Step1ValidationData();
    this.step2Val = new Step2ValidationData();
    this.step3Val  = new Step3ValidationData();
    this.step4Val  = new Step4ValidationData();
   
    this.step1Val.RegionDesc = this.request.RegionDesc;
    this.request.SpecificLocation = this.step1Val.SpecificLocation;
    //this.step1Val.isInsideBuilding = (this.request.isInSideBuilding)?1:0;
    this.step1Val.BuildingId = this.BuildingId;
    this.step1Val.FmzId = this.request.FmzId;
    this.step1Val.RegionId = this.request.RegionId;

    //this.step1Val.floorSearchValue = this.convertNulltoEmpty(this.request.floorSearchValue);
    this.step1Val.floorSearchKey = this.convertNulltoEmpty(this.request.FloorId); 
    this.step1Val.CriticalityValue  = this.request.CriticalityCode;
    let _c = this.Criticality.find(x=>x.Key == this.step1Val.CriticalityValue);
    if(_c){ this.criticalityDesc = _c.Value;}
    this.step1Val.isInHerigageArea = this.request.isInHerigageArea;
    this.step1Val.areaSearchKey = (this.request.AreaId==null || this.request.AreaId==0)?"":this.request.AreaId.toString();
    this.step1Val.FMZDesc = this.request.FMZDesc;
    this.step1Val.BuildingDesc = this.request.BuildingDesc;
    this.step1Val.ClientCode = this.convertNulltoEmpty(this.request.ClientCode);
    this.step1Val.ClientLocation = this.convertNulltoEmpty(this.request.ClientLocation);
    this.step1Val.SpecificLocation = this.request.SpecificLocation;
    //this.step1Val.ClientCode = this.request.ClientCode;


    this.step2Val.IsDFM = this.convertNulltoEmpty(this.request.IsDFM);
    this.step2Val.FieldItemNumber = this.convertNulltoEmpty(this.request.FieldItemNumber);
    this.step2Val.ModelNumber  = this.convertNulltoEmpty(this.request.ModelNumber);
    this.step2Val.ModelName = this.convertNulltoEmpty(this.request.ModelName);
    this.step2Val.ManufacturerDate = this.request.ManufacturedDate;
    this.step2Val.Manufacturer = this.convertNulltoEmpty(this.request.Manufacturer);
    this.step2Val.SerialNumber = this.convertNulltoEmpty(this.request.SerialNumber);
    this.step2Val.BuildingItemValue = (this.request.BuildingItemId == null ||this.request.BuildingItemId==0)?"":this.request.BuildingItemId.toString();

    this.step2Val.SystemTypeKey = (this.request.SystemTypeId == null || this.request.SystemTypeId==0)?"":this.request.SystemTypeId.toString();
    this.step2Val.DescriptionValue  = this.convertNulltoEmpty(this.request.Description);
    this.step2Val.DescriptionFrValue = this.convertNulltoEmpty(this.request.FrenchDescription);
    this.step2Val.BuildingItemCode  =this.convertNulltoEmpty( this.request.EqNum);
    this.step2Val.ParentItemSearchKey = (this.request.ParentItemId == null || this.request.ParentItemId==0)?"":this.request.ParentItemId.toString();
    this.step2Val.UniformatSearchValue = this.convertNulltoEmpty(this.request.BuildingItemTypeDesc);
    this.step2Val.UniformatSearchKey  = this.convertNulltoEmpty(this.request.BuildingItemTypeId);
    //this.request.UnitCode = "";

    this.step3Val.status  = this.request.Status; // (this.request.Status  == "Active")?1:0;
    

    this.step3Val.DecommissionedDate = this.convertNulltoEmpty(this.request.DecommissionedDate);
    this.step3Val.ConRateValue  = this.convertNulltoEmpty(this.request.ConditionRating);
    let _c2 = this.ConditionRating.find(x=>x.Key == this.step3Val.ConRateValue);
    if(_c2){ this.conditionRatingDesc = _c2.Value;}

    this.step3Val.isRepExistEqu = this.convertNulltoEmpty(this.request.isRepExistEqu);
    this.step3Val.commentNote = this.convertNulltoEmpty(this.request.commentNote);
    
    this.step3Val.EquipmentSearchKey = (this.request.CrossRef == null || this.request.CrossRef==0)?"":this.request.CrossRef.toString();

    this.step3Val.files  = [];
    if(this.request.Base64Files){
      this.request.Base64Files.forEach(x=>{
        let f :BgisMediaFile = new BgisMediaFile();
        f.filepath = x.FileName.toLowerCase();
        let extension = x.FileName.substring(x.FileName.lastIndexOf(".")+1);
        let urltype=extension;
        if(extension.toLowerCase()=="mov"||extension.toLowerCase()=="mp4"){
          urltype = "video/quicktime";
        }
        f.webviewPath = "data:image/"+urltype+";base64," + x.WebViewPath;
        f.status = x.Status;
        f.fieldId = x.FieldID;
        f.pictureId = x.PictureID;
        this.step3Val.files.push(f);
      });
    }


    this.step4Val.StartDate = this.convertNulltoEmpty(this.funcs.formatDate(this.request.StartDate));
    this.step4Val.KeyDate = this.convertNulltoEmpty(this.funcs.formatDate(this.request.KeyDate)); 
    if(this.step4Val.KeyDate == "1-01-01"){ this.step4Val.KeyDate = "2001-01-01";};
    this.step4Val.isMaintenanceResponsibility = this.request.isMaintenanceResponsibility;
    this.step4Val.InstallationDate = this.request.InstallationDate;
    this.step4Val.PartsWarrantyDate  = this.request.PartWarrantyExpirationDate;
    this.step4Val.LabourWarrantyDate  = this.request.LabourWarrantyExpirationDate;
    this.step4Val.PurchaseDate = this.request.PurchaseDate;
    this.step4Val.PurchasePrice = this.convertNulltoEmpty(this.request.PurchasePrice);
    this.step4Val.isPurchasePriceValid = true;
    this.step4Val.OwnershipKey  = this.convertNulltoEmpty(this.request.Ownership);
    this.step4Val.AcquisitionStatusKey  = this.convertNulltoEmpty(this.request.AcquisitionStatus);
    this.step4Val.DispositionStatusKey = this.convertNulltoEmpty(this.request.DispositionStatus);
    this.step4Val.ResponsibilityValue  = this.convertNulltoEmpty(this.request.PMResponsibility);
    this.step4Val.PMResponsibilityComment = this.convertNulltoEmpty(this.request.PMResponsibilityComment);
    this.step4Val.WarrantyVenderName  = this.convertNulltoEmpty(this.request.VendorName);

    if(this.request.FlexRequest!==undefined && this.request.FlexRequest!=null){
      this.step2Val.UniformatSelected = new Uniformat();
      this.step2Val.UniformatSelected.UDescList = this.request.fields;
      this.step2Val.UniformatSelected.Id = this.request.FlexRequest.Id;
      //add udf
      this.step2Val.UniformatSelected.UDescList.forEach(x=>{
        if(x.ControlType == 3){
          x.UDFOptionSearchKey = this.request[x.Name];
          x.UDFOptionSearchValue = x.ListOfItems.find(l=>l.Key = x.UDFOptionSearchKey).Value;
        }
        else{
          x.UDFOptionSearchValue = this.request[x.Name];
        }
      })
    }
    
    this.step2Val.sManufacturerDate = this.funcs.formatDate(this.step2Val.ManufacturerDate);
    this.sStep4StartDate = this.step4Val.StartDate;
    this.sStep4KeyDate = this.step4Val.KeyDate;
    // this.sStep4InstallationDate = this.funcs.formatDate(this.step4Val.InstallationDate);
    // this.sStep4PartsWarrantyDate = this.funcs.formatDate(this.step4Val.PartsWarrantyDate);
    // this.sStep4LabourWarrantyDate = this.funcs.formatDate(this.step4Val.LabourWarrantyDate);
    // this.sStep4PurchaseDate = this.funcs.formatDate(this.step4Val.PurchaseDate);

    this.step4Val.sInstallationDate = this.funcs.formatDate(this.step4Val.InstallationDate);
    this.step4Val.sPartsWarrantyDate = this.funcs.formatDate(this.step4Val.PartsWarrantyDate);
    this.step4Val.sLabourWarrantyDate = this.funcs.formatDate(this.step4Val.LabourWarrantyDate);
    this.step4Val.sPurchaseDate = this.funcs.formatDate(this.step4Val.PurchaseDate);

    this.subs.EditBuildingId = this.step1Val.BuildingId; 
    this.subs.BuildingItemCode = this.step2Val.BuildingItemCode;
    this.mappingBakStep1Fields();
    this.mappingBakStep2Fields()
    this.mappingBakStep3Fields();
    this.mappingBakStep4Fields()
    this.SaveSubHeaderToStorage();
    this.cd.detectChanges();
    this.initEditModeSubHeader();
    this.initStep2Data();
    this.initStep1Data();
    this.initStep4Data();
    this.initStep3Data();
  }

  SaveEditStep4Data(){
    let listOwnership = this.step4Data.Ownership.ListOfItems;
    if(listOwnership.length>0){
      let pa = listOwnership.find(x=>x.Key == this.step4Val.OwnershipKey);
      if(pa!==undefined && pa!==null){
        this.step4Val.OwnershipValue = pa.Value;
      }
    }

    let listAcquisitionStatus = this.step4Data.AcquisitionStatus.ListOfItems;
    if(listAcquisitionStatus.length>0){
      let pa = listAcquisitionStatus.find(x=>x.Key == this.step4Val.AcquisitionStatusKey);
      if(pa!==undefined && pa!==null){
        this.step4Val.AcquisitionStatusValue = pa.Value;
      }
    }
    
    let listDispositionStatus = this.step4Data.DispositionStatus.ListOfItems;
    if(listDispositionStatus.length>0){
      let pa = listDispositionStatus.find(x=>x.Key == this.step4Val.DispositionStatusKey);
      if(pa!==undefined && pa!==null){
        this.step4Val.DispositionStatus = pa.Value;
      }
    }
    this.mappingBakStep4Fields();
    this.step4Data.VALDATA = this.step4Val;
    this.step4Data.DIRTYDATA = this.step4ValBak;
    this.storage.set(storageVariableNames.STEP4DATAWARRENTY, this.step4Data);
    this.initShowPurchaseInfo();
  }
 
  SaveEditStep3Data(){

    
    if(this.step3Val.files && this.step3Val.files.length>0){
      this.step3Val.files.forEach(f => {
        if(f.status == "D"){
         let index =this.request.Base64Files.findIndex(x=>x.PictureID == f.pictureId);
         if(index>-1){
           this.request.Base64Files.splice(index,1);
         }
        }
      });
      this.storage.set(storageVariableNames.EUIIPMENTDETAILGET, this.request);
    }
    this.step3ValBak.status = this.step3Val.status;
    this.step3Data.VALDATA = this.step3Val;
    this.step3Data.DIRTYDATA = this.step3ValBak;
    this.storage.set(storageVariableNames.STEP3DESCRIPTION, this.step3Data);
  }


  SaveToStorageStep2(){
    
    //this.storage.set(storageVariableNames.STEP2DATAEQIPMENTTYPE, this.step2Data);
    this.step2Val.IsDFM = this.step2Data.Data.IsDFM.trim();
    this.step2ValBak.ManufacturerDate = this.step2Val.ManufacturerDate;
    this.step2ValBak.sManufacturerDate = this.funcs.formatDate(this.step2Val.ManufacturerDate);
    this.step2ValBak.SystemTypeValue = this.step2Val.SystemTypeValue;
    this.step2ValBak.UniformatSearchValue = this.step2Val.UniformatSearchValue;
    let listEquipmentItems = this.step2Data.Data.BuildingEquipments.ListOfItems;
    if(this.request.BuildingItemTypeId!==null && this.request.BuildingItemTypeId.toString()!=""){
      let u = this.step2Data.Data.BuildingItemTypeCodes.find(x=>x.Id ==  this.request.BuildingItemTypeId.toString());
      this.step2Val.UniformatSelected = u;
      if(u!=null){
        this.step2Val.UniformatSearchValue =  u.Code + ' - ' + u.UDescription;
        if(this.step2Val.UniformatSelected.UDescList){
          this.step2Val.UniformatSelected.UDescList.forEach(x=>{
            x.UDFOptionSearchValue = this.request[x.Name];
            x.UDFOptionSearchValueBak = this.request[x.Name];
          });
          if(this.step2Val.UniformatSelected && this.step2Val.UniformatSelected.UDescList){
            this.step2Val.UniformatSelected.UDescList.sort((one, two)=>(one.Name < two.Name ? -1:1));
          }
        }
        
      }
    }
    let listSystemType = this.step2Data.Data.SystemType.ListOfItems;
    if(listSystemType.length>0){
      let sk = listSystemType.find(x=>x.Key == this.step2Val.SystemTypeKey);
      if(sk!==undefined && sk!==null){
        this.step2Val.SystemTypeValue = sk.Value;
      }
    }
    if(this.step2Val.UniformatSelected && this.step2Val.UniformatSelected.UDescList && this.step2Val.UniformatSelected.UDescList.length>0){
      this.step2Val.UniformatSelected.UDescList.forEach(x=>{
        if(x.UDFOptionSearchValue!==null && x.UDFOptionSearchValue!==""){
          this.showEquipmentSepc = true;
        }
      })
    }
    if(listEquipmentItems.length>0){
      let eq = listEquipmentItems.find(x=>x.Key == this.step3Val.EquipmentSearchKey);
      if(eq!==undefined && eq!==null){
        this.step3Val.EquipmentSearchValue = eq.Value;
        //this.SaveEditStep3Data();
      }
    }
    let listParentItems = this.step2Data.Data.ParentItem.ListOfItems;
    if(listParentItems.length>0){
      let pa = listParentItems.find(x=>x.Key == this.step2Val.ParentItemSearchKey);
      if(pa!==undefined && pa!==null){
        this.step2Val.ParentItemSearchValue = pa.Value;
      }
    }
    this.mappingBakStep2Fields();

    this.step2Data.Data.VALDATA = this.step2Val;
    this.step2Data.Data.DIRTYDATA = this.step2ValBak;
    this.storage.set(storageVariableNames.STEP2DATAEQIPMENTTYPE, this.step2Data);
    this.initShowUPC();
    
  }

  initShowUPC(){
    if (this.step2Val.FieldItemNumber == '' && this.step2Val.ModelNumber == '' && this.step2Val.Manufacturer == '' && this.step2Val.ModelName == '' && this.step2Val.SerialNumber == '' && this.step2Val.ManufacturerDate== null){
      this.showUPC = false;
    }
    else{
      this.showUPC = true;
    }
  }

  initShowPurchaseInfo(){
    if(this.step4Val.DispositionStatus=='' && this.step4Val.AcquisitionStatusValue=='' && this.step4Val.OwnershipValue=='' && this.step4Val.PurchasePrice=='' && this.step4Val.PurchaseDate==null){
      this.showPurchaseInfo = false;
    }
    else{
      this.showPurchaseInfo = true;
    }
  }

  initUDF(){
    
    if(this.step2Data.Data.BuildingItemTypeCodes.length>0){
      if(this.request.FlexRequest!==null){
        let u = this.step2Data.Data.BuildingItemTypeCodes.find(x=>x.Id == this.request.FlexRequest.Id);
        if(u!==undefined && u!=null){
          this.step2Val.UniformatSelected = u;
          this.step2Val.UniformatSelected.UDescList.forEach(x=>{

            //let _f = this.request.fields.findIndex(i=>i.Id == x.Id)
            if(x.ControlType == 3){
              x.UDFOptionSearchKey = this.request[x.Name];
              x.UDFOptionSearchValue = x.ListOfItems.find(l=>l.Key = x.UDFOptionSearchKey).Value;
            }
            else{
              x.UDFOptionSearchValue = this.request[x.Name];
            }
            
          })
        }
      }
      
    }
    if(this.step2Val.UniformatSelected!==null && this.step2Val.UniformatSelected.UDescList!==undefined && this.step2Val.UniformatSelected.UDescList.length>0){
      this.step2Val.UniformatSelected.UDescList.forEach(x=>{
        if(x.UDFOptionSearchValue!==null && x.UDFOptionSearchValue!==""){
          this.showEquipmentSepc = true;
        }
      })
    }
    
  }

  SaveToStorageStep1(){

    let listFloors = this.step1Data.Data.Floor.ListOfItems;
    let listAreas = this.step1Data.Data.Area.ListOfItems;
    this.step1Val.RegionDesc = this.step1Data.Data.RegionDescription;
    this.step1Val.FMZDesc = this.step1Data.Data.FmzDescription;
    this.step1Val.BuildingDesc = this.step1Data.Data.BuildingDescription;
    this.step1ValBak.isInHerigageArea = this.step1Val.isInHerigageArea;
    this.step1ValBak.floorSearchKey = this.step1Val.floorSearchKey;
    if(listAreas.length>0){
      let _a = listAreas.find(x=>x.Key == this.step1Val.areaSearchKey);
      if(_a!==undefined && _a!==null){
        this.step1Val.areaSearchValue = _a.Value;
      }
    }

    if(listFloors.length>0){
      let _f = listFloors.find(x=>x.Key == this.step1Val.floorSearchKey);
      if(_f!==undefined && _f!==null){
        this.step1Val.floorSearchValue = _f.Value;
      }
    }
    this.mappingBakStep1Fields();
    this.step1Data.Data.VALDATA = this.step1Val;
    this.step1Data.Data.DIRTYDATA = this.step1ValBak;
    this.storage.set(storageVariableNames.STEP1DATACLIENTINFO, this.step1Data);
    
  }

  mappingBakStep1Fields(){
    this.step1ValBak =   new Step1ValidationData();
    this.step1ValBak.floorSearchValue = this.step1Val.floorSearchValue;
    this.step1ValBak.CriticalityValue = this.step1Val.CriticalityValue;
    this.step1ValBak.areaSearchValue = this.step1Val.areaSearchValue;
    this.step1ValBak.isInHerigageArea = this.step1Val.isInHerigageArea;
    this.step1ValBak.ClientCode = this.step1Val.ClientCode;
    this.step1ValBak.ClientLocation = this.step1Val.ClientLocation;
    this.step1ValBak.SpecificLocation = this.step1Val.SpecificLocation;
  }

  mappingBakStep2Fields(){
    this.step2ValBak =   new Step2ValidationData();
    this.step2ValBak.UniformatSearchValue = this.step2Val.UniformatSearchValue;
    this.step2ValBak.SystemTypeValue = this.step2Val.SystemTypeValue;
    this.step2ValBak.DescriptionValue = this.step2Val.DescriptionValue;
    this.step2ValBak.DescriptionFrValue = this.step2Val.DescriptionFrValue;
    this.step2ValBak.ParentItemSearchValue = this.step2Val.ParentItemSearchValue;
    this.step2ValBak.FieldItemNumber = this.step2Val.FieldItemNumber;
    this.step2ValBak.ModelNumber = this.step2Val.ModelNumber;

    this.step2ValBak.Manufacturer = this.step2Val.Manufacturer;
    this.step2ValBak.ModelName = this.step2Val.ModelName;
    this.step2ValBak.SerialNumber = this.step2Val.SerialNumber;
    this.step2ValBak.ManufacturerDate = this.step2Val.ManufacturerDate;
    this.step2ValBak.sManufacturerDate = this.funcs.formatDate(this.step2Val.ManufacturerDate);
    if(this.step2Val.UniformatSelected){
      if(this.step2Val.UniformatSelected.UDescList !==undefined && this.step2Val.UniformatSelected.UDescList !=null ){
        this.step2ValBak.UniformatSelected = new Uniformat();
        this.step2ValBak.UniformatSelected.UDescList = [];
        this.step2Val.UniformatSelected.UDescList.forEach(x=>{
          let u : UniformatDescription = new UniformatDescription();
          u.UDFOptionSearchKey = x.UDFOptionSearchKey;
          u.UDFOptionSearchValue = x.UDFOptionSearchValue;
          this.step2ValBak.UniformatSelected.UDescList.push(u);
        })
  
      }
    }
    
  }

  mappingBakStep3Fields(){
    this.step3ValBak =   new Step3ValidationData();
    this.step3ValBak.commentNote = this.step3Val.commentNote;
    this.step3ValBak.ConRateValue = this.step3Val.ConRateValue;
    this.step3ValBak.EquipmentSearchValue = this.step3Val.EquipmentSearchValue;
    this.step3ValBak.status = this.step3Val.status;
    if(this.step3Val.files !==undefined && this.step3Val.files !=null ){
      this.step3ValBak.files = [];
      this.step3Val.files.forEach(x=>{
        let f : BgisMediaFile = new BgisMediaFile();
        f.filepath = x.filepath;
        this.step3ValBak.files.push(f);
      })
      
    }
  }

  mappingBakStep4Fields(){
    this.step4ValBak =   new Step4ValidationData();
    this.step4ValBak.WarrantyVenderName = this.step4Val.WarrantyVenderName;
    this.step4ValBak.StartDate = this.step4Val.StartDate;
    this.step4ValBak.KeyDate = this.step4Val.KeyDate;

    this.step4ValBak.DispositionStatus = this.step4Val.DispositionStatus;
    this.step4ValBak.InstallationDate = this.step4Val.InstallationDate;
    this.step4ValBak.PartsWarrantyDate = this.step4Val.PartsWarrantyDate;

    this.step4ValBak.LabourWarrantyDate = this.step4Val.LabourWarrantyDate;
    this.step4ValBak.PurchaseDate = this.step4Val.PurchaseDate;
    this.step4ValBak.isMaintenanceResponsibility = this.step4Val.isMaintenanceResponsibility;

    this.step4ValBak.ResponsibilityValue = this.step4Val.ResponsibilityValue;
    this.step4ValBak.PMResponsibilityComment = this.step4Val.PMResponsibilityComment;
    this.step4ValBak.PurchasePrice = this.step4Val.PurchasePrice;

    this.step4ValBak.OwnershipValue = this.step4Val.OwnershipValue;
    this.step4ValBak.AcquisitionStatusValue = this.step4Val.AcquisitionStatusValue;

    this.step4ValBak.sInstallationDate = this.funcs.formatDate(this.step4Val.InstallationDate);
    this.step4ValBak.sPartsWarrantyDate = this.funcs.formatDate(this.step4Val.PartsWarrantyDate);
    this.step4ValBak.sLabourWarrantyDate = this.funcs.formatDate(this.step4Val.LabourWarrantyDate);
    this.step4ValBak.sPurchaseDate = this.funcs.formatDate(this.step4Val.PurchaseDate);
    
  }
}
