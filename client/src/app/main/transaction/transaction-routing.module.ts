import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/auth.guard';
import { PageNotFound } from 'src/app/util/component/page-not-found/page-not-found';
import { CreateTransactionComponent } from './create-transaction/create-transaction.component';
import { TransactionListComponent } from './transaction-list/transaction-list.component';

const routes: Routes = [
  { path: "view", canActivate: [AuthGuard], component: TransactionListComponent },
  { path: "create", canActivate: [AuthGuard], component: CreateTransactionComponent },
  { path: "**", component: PageNotFound },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionRoutingModule { }
