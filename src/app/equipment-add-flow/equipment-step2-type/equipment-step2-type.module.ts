import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EquipmentStep2TypePageRoutingModule } from './equipment-step2-type-routing.module';
import { PipesModule } from '../../common/pipe/pipes.module';
import { EquipmentStep2TypePage } from './equipment-step2-type.page';
import { HeaderComponentModule } from '../../header/header.module';
import { SubHeaderComponentModule } from '../../sub-header/sub-header.module';
import { InputConComponentModule } from '../../common/input-con/input-con.module';
import { FieldItemNumberDirective} from '../../common/directive/field-item-number.directive';
import { FieldUDFDateDirective} from '../../common/directive/field-udf-date.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InputConComponentModule,
    EquipmentStep2TypePageRoutingModule,
    HeaderComponentModule,
    PipesModule,
    SubHeaderComponentModule
  ],
  declarations: [EquipmentStep2TypePage,
    FieldItemNumberDirective,
    FieldUDFDateDirective
  ],
  exports: [
    FieldItemNumberDirective,
    FieldUDFDateDirective
  ]
})
export class EquipmentStep2TypePageModule {}
