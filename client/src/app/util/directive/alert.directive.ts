import { AfterContentChecked, AfterViewChecked, AfterViewInit, ChangeDetectorRef, Directive, DoCheck, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, Renderer2, SimpleChanges, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Alert } from 'src/types/Alert';
import Swal from 'sweetalert2';

@Directive({
  selector: '[appAlert]'
})
export class AlertDirective implements OnInit, OnChanges {

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


  constructor(private elementRef: ElementRef, private viewContainerRef: ViewContainerRef, private renderer: Renderer2) { }

  ngOnInit(): void {
    this.elementRef.nativeElement.style = "width: 25rem"
    this.elementRef.nativeElement.className = "d-block position-relative top-0 py-1 justify-content isolate z-index-1"
    console.debug({ alerts: this.alerts })
    if (this.alertMessage && this.alertType) this.alerts.push({ alertType: this.alertType, alertMessage: this.alertMessage })
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.showAlerts()
  }
  showAlerts() {
    console.count("showalerts")
    console.debug({ alerts: this.alerts })
    if (!this.alerts || this.alerts.length === 0) return
    while (this.alerts.length > 0) {
      let alert = this.alerts.shift()
      let type = alert?.alertType.valueOf()
      let message = alert?.alertMessage.valueOf()
      if (!type || !message) continue

      let newElem = this.renderer.createElement("div")
      this.renderer.addClass(newElem, "alert")
      this.renderer.addClass(newElem, `alert-${type}`)
      let text = this.renderer.createText(message)
      this.renderer.appendChild(newElem, text)
      this.renderer.appendChild(this.elementRef.nativeElement, newElem)
      this.autoDisappeareIn(newElem, 3000)
    }
    this.onComplete.emit([])
  }

  autoDisappeareIn(elm: any, sec: number) {
    let timeOut = setTimeout(() => {
      this.renderer.removeChild(this.elementRef.nativeElement, elm)
      clearTimeout(timeOut)
    }, sec)
  }
}
