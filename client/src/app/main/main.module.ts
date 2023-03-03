import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { JobModule } from './job/job.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../auth.interceptor';
import { TimerComponent } from './timer/timer.component';
import { TimerService } from './timer/timer.service';
import { TransactionModule } from './transaction/transaction.module';
import { DonateComponent } from './donate/donate.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PaymentModule } from './payment/payment.module';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatPaginatorModule } from '@angular/material/paginator';
// import { LeftSidebarComponent } from '../left-sidebar/left-sidebar.component';


@NgModule({
  declarations: [
    MainComponent,
    TimerComponent,
    DonateComponent,
    ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    JobModule,
    TransactionModule,
    PaymentModule,
    ReactiveFormsModule,
    MatSidenavModule,
    MatProgressBarModule,
    MatPaginatorModule,

    // LeftSidebarComponent
  ],
  providers: [
    TimerService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
})
export class MainModule {
  // menus = [
  //   {
  //     title: 'general',
  //     type: 'header'
  //   },
  // ]
  // toggled = false;
  // toggle() {
  //   this.toggled = ! this.toggled;
  // }
  // getSidebarState() {
  //   return this.toggled;
  // }

  // setSidebarState(state: boolean) {
  //   this.toggled = state;
  // }
}
