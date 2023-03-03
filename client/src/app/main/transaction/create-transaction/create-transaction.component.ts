import { Component, OnChanges, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppStore } from 'src/app/app.store';
import { CurrentUser } from 'src/app/currentuser';
import { AlertService } from 'src/app/util/service/alert.service';
import { TransactionService } from '../transaction.service';

@Component({
  selector: 'app-create-transaction',
  templateUrl: './create-transaction.component.html',
  styleUrls: ['./create-transaction.component.scss']
})
export class CreateTransactionComponent implements OnInit {

  constructor(private fBuilder: FormBuilder, private service: TransactionService, private currentUser: CurrentUser, private store: AppStore) { }
  transfer!: FormGroup
  @ViewChild(FormGroupDirective) formGroupDirective!: FormGroupDirective
  ngOnInit(): void {
    this.transfer = this.fBuilder.group({
      hours: ["", [Validators.required, Validators.min(1)]],
      cryptoAddress: ["", [Validators.email, Validators.required]]
    })
  }
  submitForm = async () => {
    if (!this.transfer.valid) return
    if (!this.currentUser.getCryptoAddress()) return
    let hours = this.transfer.get("hours")?.value
    let creditAccount = this.transfer.get("cryptoAddress")?.value
    if (this.currentUser.getCryptoAddress() === creditAccount) return
    if (creditAccount && hours && this.currentUser.getWallet() < hours) return
    let data: { amount: Number, debitAccount: String, creditAccount: String, createdBy: String } = {
      amount: hours,
      debitAccount: new String(this.currentUser.getCryptoAddress()),
      creditAccount: new String(creditAccount),
      createdBy: new String(this.currentUser.getCryptoAddress()),
    }
    this.store.setLoading(true)
    let res = await this.service.transferHours(data)
    this.store.setLoading(false, 2000)
    let transaction = res.payload
    if (res.responseMessage) AlertService.toast(res.responseMessage, res.responseCode, "", { timer: 2000 })
    if (!transaction?._id) return
    this.formGroupDirective.resetForm()
    await this.currentUser.refreshWallet()
    return
  }
}
