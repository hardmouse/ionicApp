import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InputConComponent } from './input-con.component';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule],
  declarations: [InputConComponent],
  exports: [InputConComponent]
})
export class InputConComponentModule {}