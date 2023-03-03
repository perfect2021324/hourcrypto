import { Directive, OnInit, ElementRef, TemplateRef, AfterViewInit, DoCheck, ChangeDetectorRef } from '@angular/core';

@Directive({
  selector: '[clipboard]'
})
export class ClipboardDirective implements OnInit, AfterViewInit, DoCheck {

  clip!: string
  icon!: HTMLElement
  state !: { copied: boolean, class: string}
  constructor(private changeDetectorRef: ChangeDetectorRef, private elementRef: ElementRef) { }

  ngOnInit(): void {
    //console.debug(this.clipboard)
    // this.elementRef.nativeElement.classList.add("clipboard")
    this.state = { copied: false, class: "bi-clipboard"}
    this.icon = document.createElement("i")
    this.icon.className = this.state.class
    this.icon.style.cursor = "pointer"
    let span = document.createElement("span")
    span.appendChild(this.icon)
    span.addEventListener("click", () => {
      this.copyToClipboard()
      this.state.copied = true
    })
    this.elementRef.nativeElement.appendChild(span)
  }
  ngDoCheck(): void {
      if(this.state.copied && this.state.class === "bi-clipboard") {
        let icon = document.querySelector(`.${this.state.class}`)
        this.state.class = "bi-clipboard-checked"
        if(icon) icon.className = this.state.class
        this.changeDetectorRef.detectChanges()
      }
  }
  ngAfterViewInit(): void {
    this.clip = this.elementRef.nativeElement.textContent
  }

  async copyToClipboard() {
    console.debug(`copied to clipboard ${this.clip.toString()}`)
    await navigator.clipboard.writeText(this.clip)

  }
}
