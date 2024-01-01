import { Directive, ElementRef, Input, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appMoveBackground]'
})
export class MoveBackgroundDirective {
  public el: HTMLImageElement;

  constructor(el: ElementRef) {
    this.el = el.nativeElement;
  }

  @Input('backgroundSrc') backgroundSrc: string;
  @Input('xPos') xPos: number;
  @Input('yPos') yPos: number;

  ngOnInit(){
    this.el.style.backgroundImage = this.buildBackground(this.backgroundSrc);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.xPos && this.yPos && this.backgroundSrc) {
      this.el.style.backgroundPosition = this.buildPosition(this.xPos, this.yPos)
    };
  }

  buildPosition(xPos: number, yPos: number): string {
    return xPos + "% " + yPos + "%";
  }

  buildBackground(src: string): string {
    return "url(" + src + ")";
  }

}

