import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EquipmentStep5SummaryPageRoutingModule } from './equipment-step5-summary-routing.module';

import { EquipmentStep5SummaryPage } from './equipment-step5-summary.page';
import { SubHeaderComponentModule } from '../../sub-header/sub-header.module';
import { HeaderComponentModule } from '../../header/header.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EquipmentStep5SummaryPageRoutingModule,
    HeaderComponentModule,SubHeaderComponentModule
  ],
  declarations: [EquipmentStep5SummaryPage]
})
export class EquipmentStep5SummaryPageModule {}
