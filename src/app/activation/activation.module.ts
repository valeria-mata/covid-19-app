import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActivationPageRoutingModule } from './activation-routing.module';

import { ActivationPage } from './activation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ActivationPageRoutingModule
  ],
  declarations: [ActivationPage]
})
export class ActivationPageModule {}
