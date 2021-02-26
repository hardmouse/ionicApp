import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EquipmentStep5SummaryPage } from './equipment-step5-summary.page';

const routes: Routes = [
  {
    path: '',
    component: EquipmentStep5SummaryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EquipmentStep5SummaryPageRoutingModule {}
