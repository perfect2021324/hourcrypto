import { Component, OnInit } from '@angular/core';
import { Transaction } from 'src/types/Transaction';
import { TransactionService } from '../transaction.service';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent implements OnInit {
  constructor(private service: TransactionService) { }
  transactions!:any[]
  transaction!:Transaction
  ngOnInit(): void {
    this.service.getCurrentUserTrasanctions().then( list => {
      this.transactions = list
      this.transaction = this.transactions[0]
    })
    console.debug(this.transactions)
  }
  showLookup(trans:Transaction, ind:number){
    this.transaction = trans
  }
}
