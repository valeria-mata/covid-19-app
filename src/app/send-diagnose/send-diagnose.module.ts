import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SendDiagnosePageRoutingModule } from './send-diagnose-routing.module';

import { SendDiagnosePage } from './send-diagnose.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SendDiagnosePageRoutingModule
  ],
  declarations: [SendDiagnosePage]
})
export class SendDiagnosePageModule {}
