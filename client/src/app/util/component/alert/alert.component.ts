import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Alert } from 'src/types/Alert';

@Component({
  selector: 'app-alert',
  template: `
  <div #alertBox appAlert [alertType]="alertType" [alertMessage]="alertMessage" [alertDisappearIn]="alertDisappearIn"> </div>
  `,
  styles: [

  ]
})
export class AlertComponent implements OnInit {

  @Input("alertType") alertType!: String
  @Input("alertMessage") alertMessage!: String
  alertDisappearIn!: Number
  @Input("alertDisappearIn")
  set setAlertDisappearIn(alertDisappearIn: any) {
    this.alertDisappearIn = new Number(alertDisappearIn)
  }
  @Input("alerts")
  alerts: Alert[] = []
  @Output("onComplete") onComplete = new EventEmitter()

  constructor() { }

  ngOnInit(): void {
  }

}
