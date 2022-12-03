import { Directive, ElementRef, Input } from "@angular/core";

@Directive({
  selector: "[autofocus]"
})
export class AutoFocusDirective {

  @Input() set autofocus(condition: boolean) { this.focus = condition !== false; }
  private focus = true;

  constructor(private el: ElementRef) { }

  ngOnInit() {
    if (this.focus) {
      //Otherwise Angular throws error: Expression has changed after it was checked.
      setTimeout(() => {
        this.el.nativeElement.focus(); //For SSR (server side rendering) this is not safe.
      });
    }
  }

}
