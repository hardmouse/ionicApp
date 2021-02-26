import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EquipmentStep2TypePage } from './equipment-step2-type.page';

const routes: Routes = [
  {
    path: '',
    component: EquipmentStep2TypePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EquipmentStep2TypePageRoutingModule {}
