import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CurrentUser } from 'src/app/currentuser';

@Component({
  selector: 'app-transaction-item',
  templateUrl: './transaction-item.component.html',
  styleUrls: ['./transaction-item.component.scss']
})
export class TransactionItemComponent implements OnInit {

  constructor(private currentUser: CurrentUser) { }
  @Input("transaction") transaction!: any
  @Input('ind') ind!: number
  @Output("lookup") lookup = new EventEmitter<number>()

  madeWith!: string
  madeAt!: Date
  indicator!: string
  amount!: number
  classs = ['amount']
  ngOnInit(): void {
    this.indicator = this.transaction.indicator
    this.madeAt = this.transaction.createdAt
    if (this.indicator === 'dr') {
      this.madeWith = this.transaction._debitAccount.cryptoAddress
      this.amount = this.transaction.debitAmount
      this.classs = [...this.classs, 'text-danger']
    }
    else {
      this.madeWith = this.transaction._creditAccount.cryptoAddress
      this.amount = this.transaction.creditAmount
      this.classs = [...this.classs, 'text-success']
    }
  }
  showLookup() {
    this.lookup.emit(this.ind)
  }
}
