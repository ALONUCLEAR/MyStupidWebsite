import { Directive, ElementRef, EventEmitter, Input, OnInit, Output, } from '@angular/core';

@Directive({
  selector: '[touchClick]',
})
export class TouchClickDirective implements OnInit {
  @Input() maxDistance?: number;
  @Input() maxTime?: number;

  @Output() touchStart = new EventEmitter<void>();
  @Output() touchEnd = new EventEmitter<void>();

  start?: Touch;
  constructor(private elementRef: ElementRef) {}
  ngOnInit(): void {
    // Bind the touches event to the element
    this.bindTouchEvents();
  }

  bindTouchEvents() {
    this.elementRef.nativeElement.addEventListener(
      'touchstart',
      this.onTouchStart.bind(this),
      false
    );
    this.elementRef.nativeElement.addEventListener(
      'touchend',
      this.onTouchEnd.bind(this),
      false
    );
  }

  onTouchStart(e: TouchEvent) {
    e.preventDefault();
    // hold the touch start position
    this.start = e.touches[0];

    // clear the position after 2000 mil (could be set for less).
    this.touchStart.emit();
    if (this.maxTime) {
      setTimeout(() => {
        this.start = undefined;
      }, this.maxTime);
    }
  }

  onTouchEnd(e: TouchEvent) {
    e.preventDefault();
    // if the timeout was called, there will be no start position
    if (!this.start) {
      return;
    }

    // calculate the distance between start and end position
    const end = e.changedTouches[0],
      dx = Math.pow(this.start.pageX - end.pageX, 2),
      dy = Math.pow(this.start.pageY - end.pageY, 2),
      distance = Math.round(Math.sqrt(dx + dy));

    // if the distance is fairly small, fire
    // a click event. (default is 20 but you can override it through the constructor)
    if (this.maxDistance && distance <= this.maxDistance) {
      this.elementRef.nativeElement.click();
    }

    this.touchEnd.emit();
    // clear the start position again
    this.start = undefined;
  }
}