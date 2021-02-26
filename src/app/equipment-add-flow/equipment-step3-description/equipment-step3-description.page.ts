import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { NavController } from '@ionic/angular';
import { EquipmentAddFlowPage } from '../equipment-add-flow.page'
import { PhotoService } from '../../services/photo.service';
import { VideoService } from '../../services/video.service';
import { ActivatedRoute} from '@angular/router';
import { Capacitor, Plugins } from '@capacitor/core';
import { LoadingController } from '@ionic/angular';


import { Photo,storageVariableNames,InputConReturn,GetEquipmentsRequest, SearchEquipmentResponse,EquipmentRecord } from '../../common/type/common.model';
import { Step2EquipTypeData,Step2EquipmentType, Step2ValidationData,RadioListItem,Step3ValidationData,RequestEquiment,BgisMediaFile,ListItem,Step3DescriptionData, SmartInput } from '../../common/type/equipment-steps';

import { ActionSheetController, Platform } from '@ionic/angular';
import { File, FileEntry  } from '@ionic-native/File/ngx';
import { MobileService } from '../../services/mobile.service';
import { MediaCapture, MediaFile, CaptureError, CaptureVideoOptions } from '@ionic-native/media-capture/ngx';
import { Media, MediaObject  } from '@ionic-native/media/ngx';
import { StreamingMedia } from '@ionic-native/streaming-media/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { Storage } from '@ionic/storage';
import { SubscribableService } from '../../services/subscribable.service'
import { AlertService } from '../../common/service/alert.services';
import { OfflineQueryService } from '../../common/service/offline-query.service';
const MEDIA_FOLDER_NAME = 'bgis_media';
const MEDIA_FILES_KEY = 'mediaFiles';
@Component({
  selector: 'app-equipment-step3-description',
  templateUrl: './equipment-step3-description.page.html',
  styleUrls: ['./equipment-step3-description.page.scss'],
})
export class EquipmentStep3DescriptionPage extends EquipmentAddFlowPage implements OnInit {

  constructor(
    public navCtrl:NavController, public photoService: PhotoService, public videoService: VideoService,
    private cd: ChangeDetectorRef,
    public storage: Storage,
    public subs:SubscribableService,
    private mobile:MobileService,
    public route: ActivatedRoute,
    private mediaCapture: MediaCapture,
    private file: File,
    private media: Media,
    private streamingMedia: StreamingMedia,
    private photoViewer: PhotoViewer,
    public alertService: AlertService,
    private actionSheetController: ActionSheetController,
    public loadingController: LoadingController,
    public offlineQuery : OfflineQueryService,
    private plt: Platform) { 
      super(navCtrl,storage,route,subs,alertService);
      this.step = 3;
      this.ConRate = this.initConditionRate();
      
      this.subs.photoAdded.subscribe(value => {
      
        if(value==true){
          this.photoService.photos.forEach(f => {
            let isExt :boolean=false;
            if( this.step3Val && this.step3Val.files){
              this.step3Val.files.forEach((x : BgisMediaFile) => {
                if(x.filepath == f.filepath){
                  isExt = true;
                }
              });
              if(!isExt){
                let p : BgisMediaFile = new BgisMediaFile();
                p.webviewPath = f.base64Data;
                p.filepath = f.filepath.substring(f.filepath.lastIndexOf('/')+1,f.filepath.length);
                p.status = "N";
                p.fieldId="";
                this.step3Val.files.push(p);
                //this.copyFileToLocalDir(f.filepath);
              }
            }
            
          });
        }
        
      });
    }

  step3Data:Step3DescriptionData = new Step3DescriptionData();
  step2Data:Step2EquipmentType = new Step2EquipmentType();;
  step2Val : Step2ValidationData = new Step2ValidationData();
  step3Val : Step3ValidationData = new Step3ValidationData();
  step3ValBak : Step3ValidationData = new Step3ValidationData();
  isReplaceExitEquipment:boolean=false;
  showNoResultBuildingItem:boolean;
  searchEquipList: EquipmentRecord[] = [];
  ConRate : RadioListItem[]=[];
  files = [];

  @ViewChild('video') captureElement: ElementRef;
  @ViewChild('myvideo') myVideo: any;
  
  choosefiles1: any;
  imageUrl: any;
  
  isCapacitor:boolean;
  mediaFiles = [];
  //ListUniformats: Uniformat[] = [];
  //ListUniformatsFiltered: Uniformat[] = [];
  listEquipmentItems:ListItem[]=[];
  listEquipmentItemsFiltered:ListItem[]=[];
  maxAttached:boolean=false;

  async ionViewWillEnter() {
    //this.initFileDirectory();
    
    if (!Capacitor.isNative){
      await this.photoService.loadSaved();
    }
    else{
      this.storage.remove("photos");
      this.photoService.photos=[];
    }
    
    if(this.subs.Mode == "EDIT"){
      this.initEditModel();
    }
    this.initStep2Data();
    this.initStep3Data();
  }

  ngOnDestroy(){
    if (this.subs.photoAdded) {
      //this.subs.photoAdded.unsubscribe();
    }
  }
  getInputConEquipmentValue(rv :InputConReturn){
    // if(this.step3Val.showEquipmentSearchList){
    //   this.step3Val.showEquipmentSearchList = false;
    //   return;
    // }
    this.step3Val.EquipmentSearchValue = (rv.value!==undefined)?rv.value.trim():"";
    this.step3Val.showEquipmentSearchList = !rv.isBlur;
    this.step3Val.EquipmentSelected = new ListItem();
    this.listEquipmentItemsFiltered = [];
    this.listEquipmentItems.forEach(u=>{
      let _v = u.Value.toLowerCase();
      if(_v.indexOf(this.step3Val.EquipmentSearchValue.toLocaleLowerCase())>=0){
        this.listEquipmentItemsFiltered.push(u);
      }
    });
    if(this.listEquipmentItemsFiltered.length==0){
      //this.step3Val.showEquipmentSearchList = false;
      this.showNoResultBuildingItem=true;
    }
    else{
      this.showNoResultBuildingItem=false;
    }
  }

  resetBuildingItemInput(){
    this.showNoResultBuildingItem=false;
    this.step3Val.showEquipmentSearchList=false;
    if(this.step3Val.EquipmentSearchKey==""){
      this.step3Val.EquipmentSearchValue = "";
    }
  }

  selectEquipmentItem(index:number){
    let _v = this.listEquipmentItemsFiltered[index].Value;
    this.step3Val.EquipmentSearchValue = _v;
    this.step3Val.EquipmentSelected = this.listEquipmentItemsFiltered[index];
    this.step3Val.EquipmentSearchKey = this.step3Val.EquipmentSelected.Key;
    this.step3Val.showEquipmentSearchList = false;
  }

  hideUfmSearchs(){
    this.step2Val.showUniformatSearchList = false;
  }

  initStep3Data(){
    this.storage.get(storageVariableNames.STEP3DESCRIPTION).then((data : Step3DescriptionData) => {
      if (data) {
        this.step3Data = data;
        this.step3Val = data.VALDATA;     
        this.step3ValBak = data.DIRTYDATA;   
      }
      else{
        this.step3Val = new Step3ValidationData();
        this.step3Val.status = "Active";
        this.step3Val.files = [];
      }
      //this.mappingBakFields();
    });
    
  }

  initStep2Data(){
    this.storage.get(storageVariableNames.STEP2DATAEQIPMENTTYPE).then((data : Step2EquipmentType) => {
      if (data) {
        this.step2Data = data;
        this.MappingData();
      }
      else{
        this.step2Data = new Step2EquipmentType();
        const url = 'equipment/eqiupmenttype/';
        let body : RequestEquiment = new RequestEquiment();
        body.BuildingId =  this.subs.EditBuildingId;
        const request = JSON.stringify(body);
        this.mobile.post(url,request,"").subscribe( (sc : Step2EquipTypeData)  =>{
          console.log(sc);
          this.step2Data.Data = sc;
          this.MappingData();
        });
      }
    });

  }

  SaveToStorage(){
    this.step3Data.VALDATA = this.step3Val;
    this.step3Data.DIRTYDATA = this.step3ValBak;
    this.storage.set(storageVariableNames.STEP3DESCRIPTION, this.step3Data);
  }

  MappingData(){
    //this.listEquipmentItems = this.step2Data.Data.BuildingEquipments.ListOfItems;
    if(!this.step2Data.Data.BuildingEquipmentsSorted){
      if(this.subs.isOffline){
        this.getSearchEquipmentsOffline()
      }
      else{
        this.getSearchEquipments();
      }
      
    }
    else{
      this.listEquipmentItems = this.step2Data.Data.BuildingEquipmentsSorted.ListOfItems;
    }

    if(this.subs.Mode=="EDIT" && this.listEquipmentItems.length>0){
      let eq = this.listEquipmentItems.find(x=>x.Key == this.step3Val.EquipmentSearchKey);
      if(eq!==undefined && eq!==null){
        this.step3Val.EquipmentSearchValue = eq.Value;
      }
    }
    if(this.step2Data.Data.VALDATA!==undefined){
      this.step2Val = this.step2Data.Data.VALDATA;
      this.subHeader.subheaderitems[2].subline = this.step2Val.BuildingItemCode;
    }
  }

  getSearchEquipments(){
    const url = 'equipment/searchequipmentsbybuilding/';
    let body : GetEquipmentsRequest = new GetEquipmentsRequest();
    body.BuildingId =  this.BuildingId;
    body.Clients = this.subs.clientSelected.toString();
    const request = JSON.stringify(body);
    this.presentLoading();
    this.mobile.post(url,request,"").subscribe( (sc: SearchEquipmentResponse)  =>{
        console.log(sc);
        sc.BuildingId = this.BuildingId;
        this.loading.dismiss();
        if(sc.ListEquipments.length >0){
          this.searchEquipList = sc.ListEquipments.sort((one, two)=>(one.Status < two.Status ? -1:1));
          this.sortListEquipment(this.searchEquipList);
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

  sortListEquipment(listequip:EquipmentRecord[]){
    let _list1 = listequip.filter(x=>x.Status.toUpperCase()=="ACTIVE");
    let _list2 = listequip.filter(x=>x.Status.toUpperCase()=="DECOMMISSIONED");
    let _list3 = listequip.filter(x=>x.Status.toUpperCase()=="INACTIVE");
    _list1 = _list1.sort((one, two)=>(one.Eqnum > two.Eqnum ? -1:1));
    _list2 = _list2.sort((one, two)=>(one.Eqnum > two.Eqnum ? -1:1));
    _list3 = _list3.sort((one, two)=>(one.Eqnum > two.Eqnum ? -1:1));
    this.searchEquipList=[];
    this.searchEquipList = this.searchEquipList.concat(_list1,_list2,_list3);
    this.searchEquipList.forEach(eq=>{  
      let l : ListItem = new ListItem(); 
      l.Key = eq.EquipmentId.toString();
      l.Value=eq.Eqnum + "-" + eq.ShortDesc;
      this.listEquipmentItems.push(l)
    });
    //this.step2Data.Data.BuildingEquipments.ListOfItems = this.listEquipmentItems;
    this.step2Data.Data.BuildingEquipmentsSorted = new SmartInput();
    this.step2Data.Data.BuildingEquipmentsSorted.ListOfItems = this.listEquipmentItems;
    this.storage.set(storageVariableNames.STEP2DATAEQIPMENTTYPE, this.step2Data);
  }

  loading:any;
  async presentLoading() {
     this.loading = await this.loadingController.create({
      message: '',
    });
    await this.loading.present();
  }

  replaceequipment(isreqplace:number){
    this.step3Val.isRepExistEqu = (isreqplace==1)?true:false;
  }
  
  selectstatus(index:number){
    this.step3Val.status = (index==1)?"Active":"Decommissioned";
  }

 
  radioSelect(event) {
    console.log("radioSelect",event.detail);
    this.step3Val.ConRateValue  = event.detail;
  }

  navigateToStep2Type(){
    this.resetBuildingItemInput();
    this.SaveToStorage();
    this.navSubHeaderStatus(2);
    this.navCtrl.navigateForward(storageVariableNames.STEP2NAV,this.navigationExtras);
  }

  navigateToStep4Warranty(){
    this.resetBuildingItemInput();
    this.SaveToStorage();
    this.subHeader.subheaderitems[2].isFinished = true;
    this.SaveSubHeaderToStorage();
    this.navSubHeaderStatus(4);
    this.navCtrl.navigateForward(storageVariableNames.STEP4NAV,this.navigationExtras);
  }

  navigateJumpStep5(isSave:boolean){
    this.subHeader.subheaderitems.forEach(x=>x.isFinished = true);
    if(isSave){
      this.SaveToStorage();
      this.SaveSubHeaderToStorage();
    }    
    this.navSubHeaderStatus(5);
    this.navCtrl.navigateForward(storageVariableNames.STEP5NAV,this.navigationExtras);    
  }

  navBackToJump($event){
    this.resetBuildingItemInput();
    if(!this.validateDataChanged()){
      this.navSubHeaderStatus($event);
      this.navBackTo($event);
    }
    else{
      if(this.subs.isJumpStep){
        this.presentAlertSave($event);
      }
      else{
        this.SaveToStorage();
        this.SaveSubHeaderToStorage();
        this.navBackTo($event);
      }
    }
    
  }
  
  async presentAlertSave(_step) {
    let buttons = [{
      text: 'Discard Changes',
      role: 'cancel',
      cssClass: 'button-1',
      handler: (blah) => {
        console.log('Confirm Cancel: blah');
        this.navSubHeaderStatus(_step);
        this.navBackTo(_step);  
      }
    }, {
      text: 'Save Changes',
      cssClass: 'button-2',
      handler: () => {
        this.SaveToStorage();
        this.SaveSubHeaderToStorage();
        this.navBackTo(_step);
      }
    }];
    this.alertService.backAlert(buttons);
  }
  
  validateDataChanged(){
    let isEditChanged = false;
    if(this.step3Val.commentNote != this.step3ValBak.commentNote || this.step3Val.ConRateValue != this.step3ValBak.ConRateValue 
      || this.step3Val.EquipmentSearchValue != this.step3ValBak.EquipmentSearchValue || this.step3Val.status != this.step3ValBak.status){
      isEditChanged = true;
    }

    if(this.step3Val.files !==undefined && this.step3Val.files ){
      let nf = this.step3Val.files.map(x=>x.filepath);
      if(this.step3ValBak.files){
        let of = this.step3ValBak.files.map(x=>x.filepath);
        if (JSON.stringify(nf) != JSON.stringify(of)) {
           isEditChanged = true;
         }
      }
      else{
        isEditChanged = true;
      }
      
    }

    if(isEditChanged){
      return true;
    }
    else{
      return false;
    }
    
  }

  // mappingBakFields(){
  //   this.step3ValBak =   new Step3ValidationData();
  //   this.step3ValBak.commentNote = this.step3Val.commentNote;
  //   this.step3ValBak.ConRateValue = this.step3Val.ConRateValue;
  //   this.step3ValBak.EquipmentSearchValue = this.step3Val.EquipmentSearchValue;
  //   this.step3ValBak.status = this.step3Val.status;
  //   if(this.step3Val.files !==undefined && this.step3Val.files !=null ){
  //     this.step3ValBak.files = [];
  //     this.step3Val.files.forEach(x=>{
  //       let f : BgisMediaFile = new BgisMediaFile();
  //       f.filepath = x.filepath;
  //       this.step3ValBak.files.push(f);
  //     })
      
  //   }
  // }

  cleanFiles(){
    if (Capacitor.isNative) {
      this.files.forEach(x=>{
        this.deleteFile(x);
      })
    }
    else{
      this.step3Val.files.forEach((x : BgisMediaFile, index) =>{
        this.step3Val.files.splice(index, 1);
      })
    }
  }

  captureImage() {
    if(this.step3Val.files!==undefined&& this.step3Val.files.length<3){
      this.photoService.addNewToGallery();
    }
    else{
      this.maxAttached = true;
    }
  }

  // copyFileToLocalDir(fullPath) {
  //   let myPath = fullPath;
  //   // Make sure we copy from the right location
  //   if (fullPath.indexOf('file://') < 0) {
  //     myPath = 'file://' + fullPath;
  //   }
 
  //   const ext = myPath.split('.').pop();
  //   const d = Date.now();
  //   const newName = `${d}.${ext}`;
 
  //   const name = myPath.substr(myPath.lastIndexOf('/') + 1);
  //   const copyFrom = myPath.substr(0, myPath.lastIndexOf('/') + 1);
  //   const copyTo = this.file.dataDirectory + MEDIA_FOLDER_NAME;
 
  //   this.file.copyFile(copyFrom, name, copyTo, newName).then(
  //     success => {
  //       this.loadFiles();
  //     },
  //     error => {
  //       console.log('error: ', error);
  //     }
  //   );
  // }

  
 
  openFile(f: FileEntry) {
    if (f.name.indexOf('.wav') > -1) {
      const path =  f.nativeURL.replace(/^file:\/\//, '');
      const audioFile: MediaObject = this.media.create(path);
      audioFile.play();
    } else if (f.name.indexOf('.MOV') > -1 || f.name.indexOf('.mp4') > -1) {
      this.streamingMedia.playVideo(f.nativeURL);
    } else if (f.name.indexOf('.jpg') > -1) {
      this.photoViewer.show(f.nativeURL, 'MY awesome image');
    }
  }
 
  deleteFile(f: any) {
    if(Capacitor.isNative){
      //const path = f.nativeURL.substr(0, f.nativeURL.lastIndexOf('/') + 1);
      // this.file.removeFile(path, f.name).then(() => {
      //   this.loadFiles();
      // }, err => console.log('error remove: ', err));
      this.step3Val.files.forEach((x : BgisMediaFile, index) =>{
        if(x.status == "N"){
          this.step3Val.files.splice(index, 1);
        }
        else{
          if(x.fieldId == f.fieldId){
            //this.step3Val.files.splice(index, 1);
            x.status = "D";
            x.webviewPath="";
          }
        }
        
      })
    }
    else{
      this.step3Val.files.forEach((x : BgisMediaFile, index) =>{
        if(x.status == "N"){
          this.step3Val.files.splice(index, 1);
        }
        else{
          if(x.fieldId == f.fieldId){
            //this.step3Val.files.splice(index, 1);
            x.status = "D";
            x.webviewPath="";
          }
        }
      })
    }
    
    if(this.step3Val.files!==undefined&& this.step3Val.files.length>=3){
      this.maxAttached = true;
    }
    else{
      this.maxAttached = false;
    };
    this.cd.detectChanges();
  }
  
  
  
  getFileReader(): FileReader {
    const fileReader = new FileReader();
    const zoneOriginalInstance = (fileReader as any)["__zone_symbol__originalInstance"];
    return zoneOriginalInstance || fileReader;
  }

  changeListener($event) : void {

    if(this.step3Val.files!==undefined && this.step3Val.files.filter(x=>x.status!="D").length>=3){
      this.maxAttached = true;
      return;
    };

    if(!this.isCapacitor){
      this.choosefiles1 = $event.target.files[0];   
      let reader = this.getFileReader();    
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
        let p : BgisMediaFile = new BgisMediaFile();
        p.webviewPath = this.imageUrl;
        p.filepath = this.choosefiles1.name;
        p.status = "N";
        p.fieldId="";
        this.step3Val.files.push(p);
        this.cd.detectChanges();
        if(this.step3Val.files.length>=3) this.maxAttached = true;
      };
      reader.readAsDataURL(this.choosefiles1);
    }
    else{
      this.choosefiles1 = $event.target.files[0];   
      let reader = this.getFileReader();    
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
        let p : BgisMediaFile = new BgisMediaFile();
        p.webviewPath = this.imageUrl;
        p.filepath = this.choosefiles1.name;
        p.status = "N";
        p.fieldId="";
        this.step3Val.files.push(p);
        this.cd.detectChanges();
        if(this.step3Val.files.length>=3) this.maxAttached = true;
      };
      reader.readAsDataURL(this.choosefiles1);
    }
    
  }

  b64toBlob(b64Data, contentType) {
    contentType = contentType || '';
    var sliceSize = 512;
    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }
  
  
   //////

  captureVideo() {
    let options: CaptureVideoOptions = {
      limit: 1,
      duration: 30
    }
    this.mediaCapture.captureVideo(options).then((res: MediaFile[]) => {
      let capturedFile = res[0];
      let fileName = capturedFile.name;
      let dir = capturedFile['localURL'].split('/');
      dir.pop();
      let fromDirectory = dir.join('/');      
      var toDirectory = this.file.dataDirectory;
      
      this.file.copyFile(fromDirectory , fileName , toDirectory , fileName).then((res) => {
        //this.storeMediaFiles([{name: fileName, size: capturedFile.size}]);
      },err => {
        console.log('err: ', err);
      });
          },
    (err: CaptureError) => console.error(err));
  }
 
 
 
  storeMediaFiles(files) {
    this.storage.get(MEDIA_FILES_KEY).then(res => {
      if (res) {
        let arr = JSON.parse(res);
        arr = arr.concat(files);
        this.storage.set(MEDIA_FILES_KEY, JSON.stringify(arr));
      } else {
        this.storage.set(MEDIA_FILES_KEY, JSON.stringify(files))
      }
      this.mediaFiles = this.mediaFiles.concat(files);
    })
  }

 

  public async showActionSheet(photo: Photo, position: number) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Photos',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.photoService.deletePicture(photo, position);
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          // Nothing to do, action sheet is automatically closed
          }
      }]
    });
    await actionSheet.present();
  }

  initEditModel(){
    this.storage.get(storageVariableNames.STEP3DESCRIPTION).then((data : Step3DescriptionData) => {
      if (data) {
        this.step3Data = data;
        this.step3Val = data.VALDATA;     
      }
    });
  }

  closeDropdown(){
    if(this.step3Val.showEquipmentSearchList){
      this.step3Val.showEquipmentSearchList = false;
    }

  }      
}
