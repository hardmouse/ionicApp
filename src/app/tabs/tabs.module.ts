import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs-routing.module';
import { TranslateModule } from '@ngx-translate/core';

import { TabsPage } from './tabs.page';
import { PipesModule } from '../common/pipe/pipes.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    PipesModule,
    TranslateModule.forChild()
  ],
  declarations: [TabsPage]
})
export class TabsPageModule { }