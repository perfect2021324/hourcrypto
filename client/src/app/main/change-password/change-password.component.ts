import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  constructor() { }

  oldPwd!:FormControl
  newPwd!:FormControl
  newPwd2!:FormControl
  pwdValidatorList = [Validators.required, Validators.minLength(8)]
  errors!:[String]
  ngOnInit(): void {
    this.oldPwd = new FormControl("", this.pwdValidatorList)
    this.newPwd = new FormControl("", this.pwdValidatorList)
    this.newPwd2 = new FormControl("", this.pwdValidatorList)

    this.errors = [""]
  }
  validatePassword(){
    //vaildate based on pattern
    this.errors.pop()
    if(this.newPwd.invalid) this.errors.push("Ivalid valid password")
    if(this.newPwd.value !== this.newPwd2.value) this.errors.push("Password missmatch")
  }

  savePassword(){
    
  }


}
