import './spinner.scss';

export class Spinner {
  FULL_DASH_ARRAY: number;
  TIME_LIMIT: number;
  timePassed: number;
  timeLeft: number;
  MAIN__WRAPPER: HTMLElement;
  constructor() {
    this.MAIN__WRAPPER = document.querySelector(
      '.main__wrapper'
    ) as HTMLElement;
    this.FULL_DASH_ARRAY = 283;
    this.TIME_LIMIT = 5;
    this.timePassed = 0;
    this.timeLeft = this.TIME_LIMIT;
  }

  renderTimer() {
    this.MAIN__WRAPPER.innerHTML = `
    <div class="wrapper-spinner">
    <div class="base-timer">
      <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g class="base-timer__circle">
          <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
          <path
            id="base-timer-path-remaining"
            stroke-dasharray="283"
            class="base-timer__path-remaining purple"
            d="
              M 50, 50
              m -45, 0
              a 45,45 0 1,0 90,0
              a 45,45 0 1,0 -90,0
            "
          ></path>
        </g>
      </svg>
      <span id="base-timer-label" class="base-timer__label">${this.timeLeft}</span>
    </div>
    </div>
    `;
  }

  startTimer(func: void) {
    this.renderTimer();
    const baseTimer = document.getElementById(
      'base-timer-label'
    ) as HTMLElement;

    const timerInterval = setInterval(() => {
      this.timePassed = this.timePassed += 1;
      this.timeLeft = this.TIME_LIMIT - this.timePassed;
      baseTimer.innerHTML = String(this.timeLeft);
      this.setCircleDasharray();

      if (this.timeLeft === 0) {
        clearInterval(timerInterval);
        func;
      }
    }, 1000);
  }

  calculateTimeFraction() {
    const rawTimeFraction = this.timeLeft / this.TIME_LIMIT;
    return rawTimeFraction - (1 / this.TIME_LIMIT) * (1 - rawTimeFraction);
  }

  setCircleDasharray() {
    const timerPath = document.getElementById(
      'base-timer-path-remaining'
    ) as HTMLElement;
    const count = Number(
      (this.calculateTimeFraction() * this.FULL_DASH_ARRAY).toFixed(0)
    );
    if (count < 0) timerPath.style.opacity = '0';
    const circleDasharray = `${count} 283`;
    timerPath.setAttribute('stroke-dasharray', circleDasharray);
  }
}
