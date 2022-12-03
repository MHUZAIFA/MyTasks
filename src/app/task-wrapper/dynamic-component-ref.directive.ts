import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[DynamicComponentRef]'
})
export class DynamicComponentRefDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
