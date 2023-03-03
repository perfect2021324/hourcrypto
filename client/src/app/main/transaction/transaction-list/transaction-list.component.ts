import { Component, OnInit } from '@angular/core';
import { CurrentUser } from 'src/app/currentuser';
import { Transaction, TransationDetail } from 'src/types/Transaction';
import { TransactionService } from '../transaction.service';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent implements OnInit {
  constructor(private service: TransactionService) { }
  transactions!: TransationDetail[]
  selectedTransaction!: any

  ngOnInit(): void {
    this.service.getCurrentUserTrasanctions().then(list => {
      this.transactions = list
    })
  }
  showLookup(event: number) {
    console.debug(this.transactions[event])
    this.selectedTransaction = this.transactions[event]
  }
  hideLookup() {
    this.selectedTransaction = undefined
  }
}
