import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HeaderComponent } from './header.component';

import { PopupSelectionComponentModule } from '../profile/popup-selection/popup-selection.module';
@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule, PopupSelectionComponentModule],
  declarations: [HeaderComponent],
  exports: [HeaderComponent]
})
export class HeaderComponentModule {}
