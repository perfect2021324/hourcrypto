import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Transaction } from 'src/types/Transaction';
import { } from 'events';

@Component({
  selector: 'app-transaction-item-lookup',
  templateUrl: './transaction-item-lookup.component.html',
  styleUrls: ['./transaction-item-lookup.component.scss']
})
export class TransactionItemLookupComponent implements OnInit {

  constructor() { }
  @Input("transaction") trans !: any
  @Input("index") ind!: number
  @Output("hide") hide = new EventEmitter()

  ngOnInit(): void {

  }
  _hide() {
    this.hide.emit()
  }
}
