import { AfterViewInit, Component } from '@angular/core';

const sleep = (msToWait: number) =>
  new Promise((res) => setTimeout(res, msToWait));

const backgroundWithDeg = (deg: number = 0): string => {
  return `conic-gradient(from ${deg}deg, red, blue, green, yellow, magenta, cyan)`;
};
const BORDER_ROTATIONS_IN_SECOND = 2;
const ELEMENT_WITH_BORDER_SELECTOR = ".spinning-card";

interface Route {
  isInApp?: boolean;
  url: string;
}

interface Icon extends Route {
  src: string;
  fileType: string;
  classes?: string;
}


const routesForShuffle: Route[] = [
  { isInApp: true, url: 'asdasd' }, //for the not found
  { url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
  { url: 'https://g.co/kgs/mxQksQ' },
  { url: "https://vuejsxo.netlify.app/" },
  { url: "https://www.tutorialspoint.com/execute_brainfk_online.php" },
  { url: "https://www.youtube.com/watch?v=v78KN3wZmNo" },
];

const shuffleRoute = (): Icon => {
  const index = Math.floor(Math.random() * routesForShuffle.length - 0.01);
  
  return {
    ...routesForShuffle[index],
    fileType: 'svg',
    src: 'assets/dice-random.svg',
    classes: 'random'
  };
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
})
export class HomeComponent implements AfterViewInit {
  stoppedSpinning: boolean = false;
  currentAngle: number = 0;
  /**Hehe socialist */
  socialList: Icon[] = [
    { src: 'assets/github.svg', fileType: 'svg', url: "https://github.com/ALONUCLEAR", },
    { ...shuffleRoute() },
    { src: 'assets/itch-io.svg', fileType: 'svg', url: "https://alonuclear.itch.io/", },
  ]

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
