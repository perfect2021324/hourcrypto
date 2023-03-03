import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-donate',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.scss']
})
export class DonateComponent implements OnInit {

  constructor(private fBuilder: FormBuilder, private httpClient: HttpClient, private router: Router) { }
  form!: FormGroup
  ngOnInit(): void {
    this.form = this.fBuilder.group({
      amount: ""
    })
  }
  show = {
    form: true,
    progress: false,
    response: false
  }
  response = {
    message: "Trasaction failed"
  }
  submitForm = () => {
    if (this.form.valid) {
      const formData = new FormData()
      formData.append("purpose", "donation")
      formData.append("mode", "paypal")
      formData.append("amount", this.form.get("amount")?.value)
      this.httpClient.post<any>(`${environment.HT_API_URL}/payment/in`, formData).subscribe((res) => {
        console.debug(res)
        this.show.form = false
        if (res?.approvalUrl && res?.paymentId) {
          // console.debug(res.approvalUrl)
          let ares = window.open(res.approvalUrl)
          this.show.progress = true
          let timeoutId = setTimeout(() => {
            this.httpClient.get<any>(`${environment.HT_API_URL}/payment/executed/${res.paymentId}`).subscribe(finalRes => {
              if (finalRes?._id) {
                this.response.message = "Trasaction completed"
              }
              this.show.progress = false
              this.show.response = true
            })
          }, 10 * 1000)
        }
        else {
          this.show.response = true
        }
      })

    }
  }
}
