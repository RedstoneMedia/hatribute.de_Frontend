import { Directive, ViewContainerRef, TemplateRef, ComponentFactoryResolver, ComponentRef, OnInit, Input } from '@angular/core';
import { PopUpWrapperComponent } from './pop-up-wrapper.component';
import { PopupData } from './pop-up-data';

@Directive({
  selector: '[appPopUpWrapper]'
})
export class PopUpWrapperDirective implements OnInit{
  @Input("appPopUpWrapper") popupData: PopupData;

  private wrapperContainer: ComponentRef<PopUpWrapperComponent>;

  constructor(
    private templateRef: TemplateRef<any>,
    public viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  ngOnInit() {
    const containerFactory = this.componentFactoryResolver.resolveComponentFactory(PopUpWrapperComponent);
    this.wrapperContainer = this.viewContainerRef.createComponent(containerFactory);
    this.wrapperContainer.instance.template = this.templateRef;
    this.wrapperContainer.instance.popupData = this.popupData;
  }

}
