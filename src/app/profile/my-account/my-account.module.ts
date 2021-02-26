import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyAccountPageRoutingModule } from './my-account-routing.module';

import { MyAccountPage } from './my-account.page';
import { HeaderComponentModule } from '../../header/header.module';
import { InputConComponentModule } from '../../common/input-con/input-con.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HeaderComponentModule,
    InputConComponentModule,
    MyAccountPageRoutingModule
  ],
  declarations: [MyAccountPage]
})
export class MyAccountPageModule {}
