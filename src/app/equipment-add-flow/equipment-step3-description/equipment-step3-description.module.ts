import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EquipmentStep3DescriptionPageRoutingModule } from './equipment-step3-description-routing.module';

import { EquipmentStep3DescriptionPage } from './equipment-step3-description.page';
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
    EquipmentStep3DescriptionPageRoutingModule,
    HeaderComponentModule,SubHeaderComponentModule,
    InputConComponentModule
  ],
  declarations: [EquipmentStep3DescriptionPage]
})
export class EquipmentStep3DescriptionPageModule {}
