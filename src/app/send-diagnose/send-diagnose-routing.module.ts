import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SendDiagnosePage } from './send-diagnose.page';

const routes: Routes = [
  {
    path: '',
    component: SendDiagnosePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SendDiagnosePageRoutingModule {}
