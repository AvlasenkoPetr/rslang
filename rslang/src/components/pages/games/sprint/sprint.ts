import './sprint.scss';
import { setRandomNumber } from '../../../Helpers/helpers';
import { IWord } from '../../../Interfaces/interfaces';
import { Fetch } from '../../../Fetch/fetch';

const fetch = new Fetch();
export class Sprint {
  timerCount: number;
  words: Array<IWord>;
  points: number;
  countPoints: number;
  progress: number;
  answers: number;
  rightAnswers: number;
  mistakes: number;
  currentWord!: IWord;
  word!: string;
  translate!: string;
  rightAnswersArr: Array<IWord>;
  mistakesArr: Array<IWord>;
  MAIN_WRAPPER: HTMLElement;
  group: string;

  constructor(group: number) {
    this.MAIN_WRAPPER = document.querySelector('.main__wrapper') as HTMLElement;

    this.group = String(group);

    this.timerCount = 3010;

    this.words = [];
    this.points = 0;
    this.countPoints = 10;
    this.progress = 0;

    this.answers = 0;
    this.rightAnswers = 0;
    this.mistakes = 0;

    this.rightAnswersArr = [];
    this.mistakesArr = [];
  }

  async startGame() {
    const randomPage: string = String(setRandomNumber(29));
    this.words = await fetch.GET_WORDS(this.group, randomPage);
    this.MAIN_WRAPPER.innerHTML = '';
    this.game();
  }

  timer() {
    const timerContainer = document.querySelector('.timer') as HTMLElement;

    const timerId = setInterval(() => {
      this.timerCount -= 1;
      timerContainer.innerHTML = String(this.timerCount);
      if (this.timerCount === 0) {
        clearInterval(timerId);
        this.stopGame();
      }
    }, 1000);
  }

  round() {
    const wordContainer = document.querySelector('.word') as HTMLElement;
    const translateContainer = document.querySelector(
      '.translate-word'
    ) as HTMLElement;

    const wordInfo = this.words[setRandomNumber(19)];
    let randomWord = wordInfo.word;
    let randomTranslate = this.words[setRandomNumber(19)].wordTranslate;
    const random = Boolean(setRandomNumber(2));

    if (random) {
      randomWord = wordInfo.word;
      randomTranslate = wordInfo.wordTranslate;
    }

    this.currentWord = wordInfo;

    wordContainer.innerHTML = randomWord;
    translateContainer.innerHTML = randomTranslate;

    this.word = wordContainer.innerText;
    this.translate = translateContainer.innerText;
  }

  fullscreen() {
    const btn = document.querySelector('.fullscreen-btn') as HTMLElement;

    btn.addEventListener('click', () => {
      if (document.fullscreenElement?.classList.contains('main__wrapper')) {
        document.exitFullscreen();
      } else {
        this.MAIN_WRAPPER.requestFullscreen();
      }
    });
  }

  updatePointsInfo(state: boolean) {
    this.answers += 1;
    const pointsContainer = document.querySelector('.points') as HTMLElement;
    const countPointsContainer = document.querySelector(
      '.count-points'
    ) as HTMLElement;
    const progressItems =
      document.querySelectorAll<HTMLElement>('.progress-item');

    if (state) {
      this.points += this.countPoints;
      this.progress += 1;
      this.rightAnswers += 1;

      if (this.progress === 4) {
        this.progress = 0;
        this.countPoints *= 2;
        progressItems.forEach((el) => {
          el.classList.remove('complete');
        });
      }

      pointsContainer.innerHTML = String(this.points);
      countPointsContainer.innerHTML = `+${this.countPoints} points`;
      for (let i = 0; i < this.progress; i += 1) {
        progressItems[i].classList.add('complete');
      }
    } else {
      this.progress = 0;
      this.countPoints = 10;
      this.mistakes += 1;
      countPointsContainer.innerHTML = `+${this.countPoints} points`;
      progressItems.forEach((el) => {
        el.classList.remove('complete');
      });
    }
  }

  renderGame() {
    this.MAIN_WRAPPER.insertAdjacentHTML(
      'beforeend',
      `
      <div class="sprint-wrapper">
      <div class="game-buttons">
        <div class="fullscreen-btn"></div>
        <div class="audio-btn"></div>
      </div>
      <div class="game-area">
        <span class="timer">${this.timerCount}</span>

        <div class="main-window">
          <span class="points">0</span>
          <span class="count-points">+10 points</span>
          <div class="progress">
            <div class="progress-item"></div>
            <div class="progress-item"></div>
            <div class="progress-item"></div>
          </div>
          <span class="word"></span>
          <span class="translate-word"></span>
          <div class="main-buttons">
            <button class="right btn">right</button>
            <button class="wrong btn">wrong</button>
          </div>
        </div>
  
      </div>
      </div>
    `
    );
  }

  renderResultsAnswer(ans: IWord, wrapper: HTMLElement) {
    const li = document.createElement('li');
    li.className = 'answer';
    li.innerHTML = `${ans.word} - ${ans.wordTranslate}`;
    li.addEventListener('click', () => {
      const audio = new Audio(
        `https://rss21q3-rslang.herokuapp.com/${ans.audio}`
      );
      audio.play();
    });

    wrapper.append(li);
  }

  renderResults() {
    let accurancy = Math.round((this.rightAnswers / this.answers) * 100);
    if (Number.isNaN(accurancy)) accurancy = 0;

    this.MAIN_WRAPPER.insertAdjacentHTML(
      'beforeend',
      `
      <div class="results">
        <p class="result-points">Вы набрали ${this.points} очков</p>
        <p class="accurancy">Accurancy ${accurancy}%</p>
        <p class="right-answ-count">Правильных ответов: ${this.rightAnswers}</p>
        <p class="mistakes-count">Ошибок: ${this.mistakes}</p>
        <p class="repeated">Всего слов: ${this.answers}</p>
      </div>
    `
    );

    const results = document.querySelector('.results') as HTMLElement;
    results.insertAdjacentHTML(
      'beforeend',
      `
      <ul class="right-answers">Correct Answers</ul>
      <ul class="mistake-answers">Mistakes</ul>
    `
    );

    const rightAnswersUl = document.querySelector(
      '.right-answers'
    ) as HTMLElement;
    const mistakeAnswersUl = document.querySelector(
      '.mistake-answers'
    ) as HTMLElement;

    this.rightAnswersArr.forEach((ans) => {
      this.renderResultsAnswer(ans, rightAnswersUl);
    });

    this.mistakesArr.forEach((ans) => {
      this.renderResultsAnswer(ans, mistakeAnswersUl);
    });
  }

  game() {
    this.renderGame();
    const right = document.querySelector('.right') as HTMLElement;
    const wrong = document.querySelector('.wrong') as HTMLElement;

    this.timer();
    this.round();
    this.fullscreen();

    right.addEventListener('click', () => {
      const rightTranslate = this.words.find(
        (wordInfo) => wordInfo.word === this.word
      )?.wordTranslate;

      if (this.translate === rightTranslate) {
        this.updatePointsInfo(true);
        if (
          this.rightAnswersArr.find(
            (wordInfo) => wordInfo === this.currentWord
          ) === undefined
        ) {
          this.rightAnswersArr.push(this.currentWord);
        }
      } else {
        this.updatePointsInfo(false);
        if (
          this.mistakesArr.find((wordInfo) => wordInfo === this.currentWord) ===
          undefined
        ) {
          this.mistakesArr.push(this.currentWord);
        }
      }

      this.round();
    });

    wrong.addEventListener('click', () => {
      const rightTranslate = this.words.find(
        (wordInfo) => wordInfo.word === this.word
      )?.wordTranslate;

      if (this.translate !== rightTranslate) {
        this.updatePointsInfo(true);
        if (
          this.rightAnswersArr.find(
            (wordInfo) => wordInfo === this.currentWord
          ) === undefined
        ) {
          this.rightAnswersArr.push(this.currentWord);
        }
      } else {
        this.updatePointsInfo(false);
        if (
          this.mistakesArr.find((wordInfo) => wordInfo === this.currentWord) ===
          undefined
        ) {
          this.mistakesArr.push(this.currentWord);
        }
      }

      this.round();
    });
  }

  stopGame() {
    const gameArea = document.querySelector('.game-area') as HTMLElement;

    gameArea.style.display = 'none';
    this.renderResults();
  }
}
