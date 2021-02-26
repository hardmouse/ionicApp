import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EquipmentStep3DescriptionPage } from './equipment-step3-description.page';

const routes: Routes = [
  {
    path: '',
    component: EquipmentStep3DescriptionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EquipmentStep3DescriptionPageRoutingModule {}
