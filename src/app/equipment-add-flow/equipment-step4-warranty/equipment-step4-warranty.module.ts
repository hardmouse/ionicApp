import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EquipmentStep4WarrantyPageRoutingModule } from './equipment-step4-warranty-routing.module';

import { EquipmentStep4WarrantyPage } from './equipment-step4-warranty.page';
import { HeaderComponentModule } from '../../header/header.module';
import { SubHeaderComponentModule } from '../../sub-header/sub-header.module';
import { InputConComponentModule } from '../../common/input-con/input-con.module';
import { PipesModule } from '../../common/pipe/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    InputConComponentModule,
    EquipmentStep4WarrantyPageRoutingModule,
    HeaderComponentModule,SubHeaderComponentModule
  ],
  declarations: [EquipmentStep4WarrantyPage]
})
export class EquipmentStep4WarrantyPageModule {}
