import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EquipmentStep1ClientPageRoutingModule } from './equipment-step1-client-routing.module';
import { HeaderComponentModule } from '../../header/header.module';
import { PipesModule } from '../../common/pipe/pipes.module';
import { SubHeaderComponentModule } from '../../sub-header/sub-header.module';
import { InputConComponentModule } from '../../common/input-con/input-con.module';
import { EquipmentStep1ClientPage } from './equipment-step1-client.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    EquipmentStep1ClientPageRoutingModule,
    HeaderComponentModule,
    SubHeaderComponentModule,
    InputConComponentModule
  ],
  declarations: [EquipmentStep1ClientPage]
})
export class EquipmentStep1ClientPageModule {}
