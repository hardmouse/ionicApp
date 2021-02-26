import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { InputConComponentModule } from '../common/input-con/input-con.module';
import { PipesModule } from '../common/pipe/pipes.module';

import { Tab1PageRoutingModule } from './tab1-routing.module';

import { HeaderComponentModule } from '../header/header.module';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    HeaderComponentModule,
    Tab1PageRoutingModule,
    PipesModule,
    InputConComponentModule,
    TranslateModule.forChild()
  ],
  declarations: [Tab1Page]
})
export class Tab1PageModule {

}

