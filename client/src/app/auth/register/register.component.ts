import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CurrentUser } from '../../currentuser';
import { AccountDetails } from 'src/types/Account';
import { Alert } from 'src/types/Alert';
import { AlertService } from 'src/app/util/service/alert.service';
import { CustomErrorStateMatcher } from 'src/app/custom-error-state-matcher.service';
import { AppStore } from 'src/app/app.store';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(private router: Router, private fBuilder: FormBuilder, private auth: AuthService, private currentUser: CurrentUser, public errorState: CustomErrorStateMatcher, public store: AppStore) { }
  user: FormGroup = this.fBuilder.group({})
  ngOnInit(): void {
    this.user = this.fBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength]],
      cnfPassword: ["", [Validators.required, Validators.minLength]]
    })
  }
  async submitForm() {
    let formData = new FormData()
    formData.append("email", this.user.get("email")?.value)
    formData.append("password", this.user.get("password")?.value)

    this.store.setLoading(true)
    const res = await this.auth.register(formData)
    AlertService.toast(res.responseMessage, res.responseCode)
    const accountDetails: AccountDetails = res.payload
    if (accountDetails._id) this.currentUser.setCurrentUser(accountDetails)
    if (accountDetails.token) this.currentUser.setToken(accountDetails.token?.valueOf()) // for persistent login
    if (await this.currentUser.isLoggedIn())
      setTimeout(() => {
        this.store.setLoading(false)
        this.router.navigate(["main", "job", "view"])
      }, 2000)
  }
}
