import { AfterContentInit, Component, DoCheck, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CurrentUser } from 'src/app/currentuser';
import { PaymentService } from '../payment.service';

@Component({
  selector: 'app-hours',
  template: `

    <div class="tab" style="position:relative; top: 10vh;  width:98vw; max-width:500px;"> 
      <div class="tab tab-header m-2" >
        <h2 class="text-center">Wallet</h2>
      </div>
      <div class="tab tab-body m-2">
        <form [formGroup]="form">
          <div class="form-floating">
            <input type="number" id="hours" name="hours" class="form-control" formControlName="hours" placeholder="$0.00">
            <label for="hours">$0.00</label>
          </div>
          <div class="form-floating">
            <input type="text" id="payTo" name="payTo" class="form-control" formControlName="payTo" placeholder="Paypal email">
            <label for="payTo">Paypal email</label>
          </div>
          <div class="form-floating">
            <input type="text" id="_payTo" name="_payTo" class="form-control" formControlName="_payTo" placeholder="confirm paypal email">
            <label for="hours">Confirm paypal email</label>
          </div>
        </form>
        <a href="#" class="btn btn-secondary end-1" (click)="$event.preventDefault(); wallet ? redeemHours() : null"> Redeem</a>
      </div>
    </div>
  `,
  styles: [
  ]
})
export class HoursComponent implements OnInit {

  constructor(public currentUser: CurrentUser, public paymentService: PaymentService, private fBuilder: FormBuilder) { }
  wallet!: number
  cryptoAddress!: string | undefined
  form!: FormGroup
  async ngOnInit(): Promise<void> {
    await this.pullLatestUserDetails()
    this.form = this.fBuilder.group({
      hours: 0,
      payTo: "",
      _payTo: "",
    })
  }

  async pullLatestUserDetails() {
    await this.currentUser.refreshWallet()
    this.wallet = this.currentUser.getWallet()
    this.cryptoAddress = this.currentUser.getCryptoAddress()
  }

  redeemHours = () => {
    if (this.form.valid) {
      const amount = this.form.get("hours")?.value
      const payTo = this.form.get("payTo")?.value
      const _payTo = this.form.get("_payTo")?.value //confriming mail
      if (amount && payTo && payTo === _payTo) {
        this.paymentService.redeemHours({ amount, payTo }).subscribe(res => {
          if (res.status === "success") {
            this.pullLatestUserDetails()
            this.form.patchValue({
              hours: 0,
              payTo: "",
              _payTo: "",
            })
          }
        })
      }
    }
  }
}
