import { NgModule } from '@angular/core';

import { TransactionRoutingModule } from './transaction-routing.module';
import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { TransactionItemComponent } from './transaction-item/transaction-item.component';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from 'src/app/auth.interceptor';
import { CreateTransactionComponent } from './create-transaction/create-transaction.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TransactionItemLookupComponent } from './transaction-item-lookup/transaction-item-lookup.component';
import { UtilModule } from 'src/app/util/util.module';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    TransactionItemComponent,
    TransactionListComponent,
    CreateTransactionComponent,
    TransactionItemLookupComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    TransactionRoutingModule,
    UtilModule,
    MatInputModule,
    MatButtonModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
})
export class TransactionModule { }
