import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PreferencesPageRoutingModule } from './preferences-routing.module';

import { PreferencesPage } from './preferences.page';
import { HeaderComponentModule } from '../../header/header.module';
import { InputConComponentModule } from '../../common/input-con/input-con.module';

import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HeaderComponentModule,
    InputConComponentModule,
    PreferencesPageRoutingModule,
    TranslateModule.forChild()
  ],
  declarations: [PreferencesPage]
})
export class PreferencesPageModule {}
