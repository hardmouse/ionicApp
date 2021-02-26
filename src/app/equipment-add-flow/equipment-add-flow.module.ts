import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EquipmentAddFlowPageRoutingModule } from './equipment-add-flow-routing.module';

import { EquipmentAddFlowPage } from './equipment-add-flow.page';
import { HeaderComponentModule } from '../header/header.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EquipmentAddFlowPageRoutingModule,
    HeaderComponentModule
  ],
  declarations: [EquipmentAddFlowPage]
})
export class EquipmentAddFlowPageModule {}
