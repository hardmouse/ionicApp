import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavController } from '@ionic/angular';

//Avoid console error undefined word 'google'
declare var google:any;

@Component({
  selector: 'app-map-search',
  templateUrl: './map-search.page.html',
  styleUrls: ['./map-search.page.scss'],
})
export class MapSearchPage implements OnInit {
  searcheArea:string;
  map: any;
  @ViewChild('map', {read:ElementRef, static: false}) mapRef: ElementRef;
  infoDialog: any = [];
  locMarkers: any = [
    {
      title: "WIFI",
      latitude: 43.8985233,
      longitude: -79.3117127,
      distance: 10
    },
    {
      title: "Home Town",
      latitude: 25.0540068,
      longitude: 121.5356497,
      distance: 5
    },
    {
      title: "BGIS Office",
      latitude: 43.8331566,
      longitude: -79.3240221,
      distance: 20
    }
  ]

  constructor(public navCtrl:NavController) { }

  ngOnInit() {
  }

  navigateToStep2(){
    this.navCtrl.navigateForward('/tabs/tab1');
  }

  ionViewDidEnter(){
    this.showMap();
  }
  //locMarkers
  placeLocMakers(markers){
    for (let marker of markers){
      let position = new google.maps.LatLng(marker.latitude, marker.longitude);
      let mapMarker = new google.maps.Marker({
        position: position,
        title: marker.title,
        latitude: marker.latitude,
        longitude: marker.longitude,
        distance: marker.distance
      });
      mapMarker.setMap(this.map);
      this.addLocInfoOnMarker(mapMarker);
    }
  }
  addLocInfoOnMarker(mkr){
    let infoContent = `<div class="map-content">
                        <h2 class="header">${mkr.title}</h2>
                        <p>Range: ${mkr.distance} km</p>
                       </div>
                       <ion-button color="primary" id="navBtn">Search Area</ion-button>`;
    let infoWinDialog = new google.maps.InfoWindow({
      content: infoContent
    });
    // let serviceRange = new google.maps.Circle({
    //   strokeColor: "#FF0000",
    //   strokeOpacity: 0.8,
    //   strokeWeight: 2,
    //   fillColor: "#FF0000",
    //   fillOpacity: 0.35,
    //   // map,
    //   center:  {'lat':mkr.latitude, 'lng':mkr.longitude},
    //   radius: Math.sqrt(mkr.distance) * 10000000,
    // });

    mkr.addListener('click',()=>{
      this.closeAllDialog();
      infoWinDialog.open(this.map, mkr);
      google.maps.event.addListenerOnce(infoWinDialog, 'domready', ()=>{
        document.getElementById('navBtn').addEventListener('click',()=>{
          this.navigateToStep2();
        })
      })
    });
    this.infoDialog.push(infoWinDialog);
  }
  closeAllDialog(){
    for(let dia of this.infoDialog){
      dia.close();
    }
  }
  showMap(){
    const location = new google.maps.LatLng(43.8331566, -79.3240221);
    const options = {
      center: location,
      zoom: 12,
      disableDefaultUI: true
    }
    this.map = new google.maps.Map(this.mapRef.nativeElement, options);
    this.placeLocMakers(this.locMarkers);
  }
  gotoSelectedArea(){
    console.log(this.searcheArea);
  }
}
