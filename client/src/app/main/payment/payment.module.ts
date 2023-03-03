import { NgModule } from '@angular/core';

import { PaymentRoutingModule } from './payment-routing.module';
import { HoursComponent } from './hours/hours.component';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { UtilModule } from 'src/app/util/util.module';


@NgModule({
  declarations: [
    HoursComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    PaymentRoutingModule,
    UtilModule
  ],
  providers: []
})
export class PaymentModule { }
