import { AfterViewInit, Component } from '@angular/core';

const sleep = (msToWait: number) =>
  new Promise((res) => setTimeout(res, msToWait));

const backgroundWithDeg = (deg: number = 0): string => {
  return `conic-gradient(from ${deg}deg, red, blue, green, yellow, magenta, cyan)`;
};
const BORDER_ROTATIONS_IN_SECOND = 2;
const ELEMENT_WITH_BORDER_SELECTOR = ".spinning-card";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
})
export class HomeComponent implements AfterViewInit {
  stoppedSpinning: boolean = false;
  currentAngle: number = 0;

  ngAfterViewInit(): void {
    this.borderMovingAnimation(BORDER_ROTATIONS_IN_SECOND);
  }

  async borderMovingAnimation(rotationsInSecond: number): Promise<void> {
    const waitBetweenFrames = rotationsInSecond / 36000;
    const elementWithBorder: HTMLElement = document.querySelector(`app-home ${ELEMENT_WITH_BORDER_SELECTOR}`)!;

    while (!this.stoppedSpinning) {
      elementWithBorder.style.background = backgroundWithDeg(this.currentAngle);

      await sleep(waitBetweenFrames);
      this.currentAngle = (this.currentAngle + 1) % 360;
    }
  }

  toggleBorderSpinning(): void {
    this.stoppedSpinning = !this.stoppedSpinning;

    if (!this.stoppedSpinning) {
      this.borderMovingAnimation(BORDER_ROTATIONS_IN_SECOND);
    }
  }
}
