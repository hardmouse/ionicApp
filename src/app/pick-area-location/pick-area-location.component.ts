

import { Component,OnInit,ViewChild,ElementRef } from '@angular/core';
import { NavController } from '@ionic/angular';
//import{ GoogleMaps, GoogleMap } from "@ionic-native/google-maps";

declare var google;


@Component({
  selector: 'app-pick-area-location',
  templateUrl: './pick-area-location.component.html',
  styleUrls: ['./pick-area-location.component.scss'],
})
export class PickAreaLocationComponent implements OnInit {

  constructor(public navCtrl:NavController,
     //private _googleMaps:GoogleMaps
     ) { }

  @ViewChild('map') mapElement:ElementRef;
  map;

  ngOnInit() {}

  ngAfterViewInit(){
    this.initMap();
  }
  initMap(){
    //let element = this.mapElement.nativeElement;
    //this.map = this._googleMaps.create(element);
    this.map = new google.maps.Map(
      this.mapElement.nativeElement,
      {center: {lat:-34.397, lng:150.644},
      zoom:8}
    )
  }

  navigateToOtherPage(): void {
    this.navCtrl.navigateForward('tab1');
 }
 
}
