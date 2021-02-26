import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute,NavigationExtras } from '@angular/router';
import { EquipmentSubHeader,EquipmentSubHeaderItem } from '../common/type/common.model';
import { RadioListItem,ListItem } from '../common/type/equipment-steps';
import { storageVariableNames} from '../common/type/common.model';
import { Storage } from '@ionic/storage';
import { SubscribableService } from '../services/subscribable.service'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {


  constructor() { 
  }

  ngOnInit() {
   
  }


 
}
