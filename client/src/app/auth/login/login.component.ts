import { Component, DoCheck, OnInit } from '@angular/core';
import { EmailValidator, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CurrentUser } from '../../currentuser';
import { Alert } from 'src/types/Alert';
import { AccountDetails } from 'src/types/Account';
import { AlertService } from 'src/app/util/service/alert.service';
import { AppStore } from 'src/app/app.store';
import { CustomErrorStateMatcher } from 'src/app/custom-error-state-matcher.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'
  ]
})
export class LoginComponent implements OnInit {
  constructor(private router: Router, private fBuilder: FormBuilder, private auth: AuthService, private currentUser: CurrentUser, private store: AppStore, public errorState: CustomErrorStateMatcher) { }
  user: FormGroup = this.fBuilder.group({})
  ngOnInit(): void {
    this.user = this.fBuilder.group({
      // change Validators.email to Validators.min(0) in the next line of you wanna log with tye SYSTEM
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(4)]]
    })
  }
  async submitForm() {
    // comment the next line of you wanna log with tye SYSTEM
    if (this.user.invalid) return
    let formData = new FormData()
    formData.append("email", this.user.get("email")?.value)
    formData.append("password", this.user.get("password")?.value)

    this.store.setLoading(true)
    const res = await this.auth.login(formData)
    const accountDetails: AccountDetails = res.payload
    if (accountDetails._id) this.currentUser.setCurrentUser(accountDetails)
    if (accountDetails.token) this.currentUser.setToken(accountDetails.token?.valueOf()) // for persistent login
    AlertService.toast(res.responseMessage, res.responseCode, undefined, { timer: 1500 })
    if (await this.currentUser.isLoggedIn()) setTimeout(() => {
      this.router.navigate(["main", "job", "u", "view"])
      this.store.setLoading(false)
    }, 1500)
  }
}
