import { Component, ViewChild, ElementRef } from '@angular/core';
import { Loader } from "@googlemaps/js-api-loader"
import { Plugins } from '@capacitor/core'
import { BuildingRecord } from '../common/type/common.model';
import { BuildingService } from '../common/service/building.service';
import { finalize } from 'rxjs/operators';
import { OfflineManagerService } from '../middleware/offline-manager.service';
import { LanguageService } from '../common/service/language.service';
import { SubscribableService } from '../services/subscribable.service'
import { SpinnerDialog } from '@ionic-native/spinner-dialog/ngx';

const { Geolocation } = Plugins;
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  @ViewChild('map', { static: false }) gmap: ElementRef;
  @ViewChild('input', { static: false }) input: ElementRef;
  constructor(private service: BuildingService,
    // private offlineManager: OfflineManagerService,
    public subs: SubscribableService,
    private languageService: LanguageService, private spinnerDialog: SpinnerDialog) {

  }

  ionViewWillEnter() {
    this.selectMoreBuildings();
  }

  resultsAvailable = false;
  locations: any[] = [];
  location: string;
  ignoreNextChange: boolean = false;
  searchLocation(event: any) {
    if (this.ignoreNextChange) {
      this.ignoreNextChange = false;
      return;
    }
    const query = event.target.value.toLowerCase();
    this.service.getLocation(query).subscribe(locations => {
      this.locations = locations;
      if (this.locations.length > 0) {
        this.resultsAvailable = true;
      } else {
        this.resultsAvailable = false;
      }
    })
  }


  locationSelected(location: any) {
    this.location = location.formatted_address;
    this.locations = [];
    this.resultsAvailable = false;
    this.ignoreNextChange = true;

    // const geo = location.geometry
    this.center = { lat: location.lat, lng: location.lng };
    if (this.showBuildings) {
      this.showBuildings = false;
      this.map = null;
      this.marker = null;
      this.circle = null;
      setTimeout(async () => {
        await this.initMap();
      }, 100)
    }
    else
      this.drawCircle();
  }

  map: any;
  center: any;
  circle: any;
  marker: any;
  mapsAvailable = true;
  radius = 2000; //in meters;
  
  async initMap() {
    const options = JSON.parse(localStorage.getItem('RCMOPTIONS'))
    console.log('RCMOPTS', options);
    // if (!options) {
    //   await this.mapsUnavailable();
    //   return;
    // }
    var tn = 2;
    if (tn)
      this.radius = +tn * 1000;
    const loader = new Loader({
      apiKey: "AIzaSyCWo9pO0zaiW9b0xWFKfMXCOW1LnfojQBE",
      version: "weekly",
      libraries: ['places']
    });

    loader.load().then(() => {
      this.map = new google.maps.Map(this.gmap.nativeElement as HTMLElement, {
        center: this.center,
        zoom: 13
      });
      const centerControlDiv = document.createElement("div");
      this.searchThisArea(centerControlDiv);
      this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);
      this.drawCircle();

      google.maps.event.addListener(this.map, 'click', (event) => {
        this.center = event.latLng;
        this.drawCircle();
      });
    }).catch(() => this.mapsUnavailable());
  }

  // async initMap() {
  //   const options = JSON.parse(localStorage.getItem('RCMOPTIONS'))
  //   console.log('RCMOPTS', options);
  //   if (!options) {
  //     await this.mapsUnavailable();
  //     return;
  //   }
  //   if (options.MapsSearchArea)
  //     this.radius = +options.MapsSearchArea * 1000;
  //   const loader = new Loader({
  //     apiKey: options.GoogleMapsAPIKey,
  //     version: "weekly",
  //     libraries: ['places']
  //   });

  //   loader.load().then(() => {
  //     this.map = new google.maps.Map(this.gmap.nativeElement as HTMLElement, {
  //       center: this.center,
  //       zoom: 13
  //     });
  //     const centerControlDiv = document.createElement("div");
  //     this.searchThisArea(centerControlDiv);
  //     this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);
  //     this.drawCircle();

  //     google.maps.event.addListener(this.map, 'click', (event) => {
  //       this.center = event.latLng;
  //       this.drawCircle();
  //     });
  //   }).catch(() => this.mapsUnavailable());
  // }

  private async mapsUnavailable() {
    const message = await this.languageService.translate('MAPS', 'MapsUnavailable');
    // this.offlineManager.presentToastWithButton(message);
    this.mapsAvailable = false;

    Geolocation.getCurrentPosition().then(pos => {
      this.center = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      this.getBuildingsForSelectedCoordinates();
    }).catch(async () => {
      this.showBuildings = true;
      const message = await this.languageService.translate('Buildings', 'LocationNotavailable')
      // this.offlineManager.presentToastWithButton(message);
    });
  }

  private drawCircle(isInit = false) {
    this.map.setCenter(this.center);
    this.map.zoom = 13;
    if (this.marker) this.marker.setPosition(this.center);
    else {
      this.marker = new google.maps.Marker({
        position: this.center,
        map: this.map,
        title: "",
      });
    }

    if (this.circle) this.circle.setCenter(this.center)
    else {
      this.circle = new google.maps.Circle({
        strokeColor: "#00467f",
        strokeOpacity: 0.9,
        strokeWeight: 2,
        fillColor: "#00467f",
        fillOpacity: 0.35,
        map: this.map,
        center: this.center,
        radius: this.radius,
      });
    }
  }

  getCurrentPosition() {
    let searchedLoc = localStorage.getItem('SearchedLocaion');
    if (!!searchedLoc) {
      this.center = JSON.parse(searchedLoc);
      setTimeout(async () => {
        await this.initMap();
      }, 100)
    } else {
      Geolocation.getCurrentPosition().then(pos => {
        // this.latitude = 43.64877;
        // this.longitude = -79.38167;
        console.log('pos', pos.coords)
        this.center = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        //this.center = { lat: 43.64877, lng: -79.38167 };
        this.initMap();
      }).catch(() => this.mapsUnavailable())
    }
  }

  async searchThisArea(controlDiv: Element) {
    let buttonText = '';
    try {
      buttonText = await this.languageService.translate('Buildings', 'SearchAreaButton')
    } catch {
      buttonText = 'Search this area';
    }
    const controlUI = document.createElement("div");
    controlUI.style.backgroundColor = "#fff";
    controlUI.style.border = "2px solid #fff";
    controlUI.style.borderRadius = "10px";
    controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
    controlUI.style.cursor = "pointer";
    controlUI.style.marginBottom = "22px";
    controlUI.style.marginTop = "10px";
    controlUI.style.textAlign = "center";
    controlUI.title = "Click to recenter the map";
    controlDiv.appendChild(controlUI);
    // Set CSS for the control interior.
    const controlText = document.createElement("div");
    controlText.style.color = "rgb(25,25,25)";
    controlText.style.fontFamily = "Roboto,Arial,sans-serif";
    controlText.style.paddingLeft = "5px";
    controlText.style.paddingRight = "5px";
    controlText.style.paddingTop = "5px";
    controlText.style.paddingBottom = "5px";

    controlText.innerHTML = buttonText;
    controlUI.appendChild(controlText);
    // Setup the click event listeners: simply set the map to Chicago.
    controlUI.addEventListener("click", () => {
      if (this.center) {
        localStorage.setItem('SearchedLocaion', JSON.stringify(this.center));
        this.getBuildingsForSelectedCoordinates();
      } else {
        //show warning
      }
    });
  }

  private getBuildingsForSelectedCoordinates() {
    this.spinnerDialog.show();
    this.service.getBuildingsForSelectedArea(this.center.lat, this.center.lng) //(this.latitude, this.longitude)
      .pipe((finalize(() => {
        if (this.areaBuildinglist.length > 0) {
          this.showBuildings = true;
        }
        this.spinnerDialog.hide();
      })))
      .subscribe(buildings => {
        this.areaBuildinglist = buildings;
        this.subs.areaBuildinglist = this.areaBuildinglist;
        this.spinnerDialog.hide();
      });
  }

  async downloadBuildingData(buildingId: string, clientId: number) {
    // this.offlineManager.executeQuery('Select * from Buildings where BuildingId = ?', [buildingId]).then(async (data) => {
    //   if (data.rows.length === 0) {
    //     const checkIfClientExist = await this.offlineManager.executeQuery('Select Count(*) as Total from Buildings where ClientId = ?', [clientId]).then(data => {
    //       if (data.rows.length > 0) {
    //         const item = data.rows.item(0).Total;
    //         return item > 0;
    //       } else return false;
    //     });

    //     this.service.downloadData(buildingId, checkIfClientExist ? -1 : clientId);
    //   }
    //   else {
    //     const message = await this.languageService.translate('Buildings', 'BuildingDataAlreadyExist');
    //     // this.offlineManager.presentToastWithButton(message);
    //   }
    // })
  }

  areaBuildinglist: BuildingRecord[] = [];
  showBuildings = false;
  selectMoreBuildings() {
    this.showBuildings = false;
    this.marker = null;
    this.center = null;
    this.map = null;
    this.circle = null;
    this.getCurrentPosition();
  }
}
