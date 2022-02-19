import './sprint.scss';
import { setRandomNumber } from '../../../Helpers/helpers';
import {
  IWord,
  IResult,
  IAnswer,
  IAggregatedWord,
  IAggregatedWords,
  IUserWord,
} from '../../../Interfaces/interfaces';
import { Fetch } from '../../../Fetch/fetch';
import { GameResult } from '../../../Reusable-components/GameResult/gameResult';

const fetch = new Fetch();

interface IStats {
  words?: IAggregatedWords;
  newWords: number;
  accurancy: number;
  inrow: number;
}
export class Sprint {
  timerCount: number;
  words: any;
  points: number;
  countPoints: number;
  progress: number;
  inrow: number;
  maxrow: number;
  answers: number;
  rightAnswers: number;
  mistakes: number;
  currentWord!: any;
  word!: string;
  translate!: string;
  rightAnswersArr: Array<IAnswer>;
  mistakesArr: Array<IAnswer>;
  MAIN_WRAPPER: HTMLElement;
  group: string;
  page: string;
  audio: HTMLAudioElement;
  fromBook: boolean;

  constructor(group: string, page?: string) {
    this.MAIN_WRAPPER = document.querySelector('.main__wrapper') as HTMLElement;

    this.group = group;
    if (page) {
      this.page = page;
      this.fromBook = true;
    } else {
      this.page = String(setRandomNumber(29));
      this.fromBook = false;
    }

    this.timerCount = 60;

    this.words = [];
    this.points = 0;
    this.countPoints = 10;
    this.progress = 0;

    this.inrow = 0;
    this.maxrow = 0;

    this.answers = 0;
    this.rightAnswers = 0;
    this.mistakes = 0;

    this.rightAnswersArr = [];
    this.mistakesArr = [];

    this.audio = new Audio();
  }

  async startGame() {
    let aggregatedWords: IAggregatedWords;
    let aggregatedWordsResults: Array<IAggregatedWord>;
    let extraPage: number = Number(this.page);
    if (this.fromBook) {
      do {
        aggregatedWords = await fetch.GET_AGGREGATED_WORDS({
          filter: `{"$and":[{"group": ${this.group}, "page": ${extraPage}}]}`,
          wordsPerPage: '20',
        });

        aggregatedWordsResults = aggregatedWords[0].paginatedResults.filter(
          (wordInfo) => wordInfo.userWord?.difficulty !== 'easy'
        );

        extraPage -= 1;
        if (extraPage < 0) {
          this.words = aggregatedWordsResults;
          break;
        }

        aggregatedWords = await fetch.GET_AGGREGATED_WORDS({
          filter: `{"$and":[{"group": ${this.group}, "page": ${extraPage}}]}`,
          wordsPerPage: '20',
        });

        let extraAggregatedWordsResults: Array<IAggregatedWord> =
          aggregatedWords[0].paginatedResults.filter(
            (wordInfo) => wordInfo.userWord?.difficulty !== 'easy'
          );
        if (this.words.length === 0) {
          this.words = aggregatedWordsResults.concat(
            extraAggregatedWordsResults
          );
        } else {
          this.words = this.words.concat(extraAggregatedWordsResults);
        }
      } while (this.words.length < 20);
      if (this.words.length > 20) {
        this.words = this.words.reverse();
        this.words.length = 20;
      }
    } else {
      this.words = await fetch.GET_WORDS(this.group, this.page);
    }
    this.words.forEach((wordInfo: IAggregatedWord) => {
      if (!wordInfo.userWord) {
        wordInfo.userWord = {
          difficulty: 'string',
        };
      }
      if (!wordInfo.userWord.optional) {
        wordInfo.userWord.optional = {
          correct: 0,
          wrong: 0,
          inRow: 0,
          notNew: true,
        };
      }
    });
    console.log(this.words);
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

    const wordInfo = this.words[setRandomNumber(this.words.length - 1)];
    let randomWord = wordInfo.word;
    let randomTranslate =
      this.words[setRandomNumber(this.words.length - 1)].wordTranslate;
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

  volume() {
    const btn = document.querySelector('.audio-btn') as HTMLElement;

    btn.addEventListener('click', () => {
      if (btn.classList.contains('active')) {
        btn.classList.remove('active');
        this.audio.muted = false;
        btn.style.background =
          "url('../../../../assets/images/sprint/audio-on.svg')";
      } else {
        btn.classList.add('active');
        this.audio.muted = true;
        btn.style.background =
          "url('../../../../assets/images/sprint/audio-off.svg')";
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

    const userWord = this.currentWord.userWord;
    if (state) {
      this.points += this.countPoints;
      this.progress += 1;
      this.rightAnswers += 1;
      this.inrow += 1;
      userWord.optional.correct += 1;
      userWord.optional.inRow += 1;

      if (
        (userWord.difficulty === 'string' && userWord.optional.inRow === 3) ||
        (userWord.difficulty === 'hard' && userWord.optional.inRow === 5)
      )
        userWord.difficulty = 'easy';

      if (this.progress === 4) {
        this.progress = 0;
        if (this.countPoints !== 80) {
          this.countPoints *= 2;
          progressItems.forEach((el) => {
            el.classList.remove('complete');
          });
          countPointsContainer.style.animation = `progress 1s linear forwards`;
          countPointsContainer.addEventListener('animationend', () => {
            countPointsContainer.style.animation = ``;
          });
        }
      }

      pointsContainer.innerHTML = String(this.points);
      countPointsContainer.innerHTML = `+${this.countPoints} points`;
      for (let i = 0; i < this.progress; i += 1) {
        progressItems[i].classList.add('complete');
      }
    } else {
      this.progress = 0;
      this.mistakes += 1;
      this.inrow = 0;

      userWord.optional.wrong += 1;
      userWord.optional.inRow = 0;
      if (userWord.difficulty === 'easy') userWord.difficulty = 'string';

      if (this.countPoints !== 10) {
        this.countPoints = 10;
        countPointsContainer.style.animation = `progress 1s linear forwards`;
        countPointsContainer.addEventListener('animationend', () => {
          countPointsContainer.style.animation = ``;
        });
      }
      countPointsContainer.innerHTML = `+${this.countPoints} points`;
      progressItems.forEach((el) => {
        el.classList.remove('complete');
      });
    }
    if (this.inrow > this.maxrow) {
      this.maxrow = this.inrow;
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

  game() {
    this.renderGame();
    const rightBtn = document.querySelector('.right') as HTMLElement;
    const wrongBtn = document.querySelector('.wrong') as HTMLElement;

    this.timer();
    this.round();
    this.fullscreen();
    this.volume();

    const rightAnswer = () => {
      this.updatePointsInfo(true);
      this.audio.src = '../../../../assets/sounds/correct.mp3';
      this.audio.play();
      if (
        this.rightAnswersArr.find(
          (wordInfo) => wordInfo.info === this.currentWord
        ) === undefined
      ) {
        this.rightAnswersArr.push({ info: this.currentWord, isRight: 'true' });
      }
    };

    const wrongAnswer = () => {
      this.updatePointsInfo(false);
      this.audio.src = '../../../../assets/sounds/incorrect.mp3';
      this.audio.play();
      if (
        this.mistakesArr.find(
          (wordInfo) => wordInfo.info === this.currentWord
        ) === undefined
      ) {
        this.mistakesArr.push({ info: this.currentWord, isRight: 'false' });
      }
    };

    const right = () => {
      const rightTranslate = this.words.find(
        (wordInfo: IAggregatedWord) => wordInfo.word === this.word
      )?.wordTranslate;
      if (this.translate === rightTranslate) {
        rightAnswer();
      } else {
        wrongAnswer();
      }
      this.round();
    };

    const wrong = () => {
      const rightTranslate = this.words.find(
        (wordInfo: IAggregatedWord) => wordInfo.word === this.word
      )?.wordTranslate;
      if (this.translate !== rightTranslate) {
        rightAnswer();
      } else {
        wrongAnswer();
      }
      this.round();
    };

    rightBtn.addEventListener('click', right);
    wrongBtn.addEventListener('click', wrong);

    this.MAIN_WRAPPER.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowLeft') right();
    });
    this.MAIN_WRAPPER.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowRight') wrong();
    });
  }

  stopGame() {
    const gameArea = document.querySelector('.game-area') as HTMLElement;

    gameArea.innerHTML = '';

    const result: IResult = {
      group: this.group,
      points: this.points,
      total: this.answers,
      inRow: this.maxrow,
      rightCount: this.rightAnswers,
      wrongCount: this.mistakes,
      answersArr: this.rightAnswersArr.concat(this.mistakesArr),
    };

    let newWordsCount = 0;
    this.words.forEach((wordInfo: IAggregatedWord) => {
      if (wordInfo.userWord?.optional?.notNew) newWordsCount += 1;
    });

    const sprintStatistic = {
      words: this.words,
      newWords: newWordsCount,
      accurancy: Math.round((this.rightAnswers / this.answers) * 100),
      inrow: this.maxrow,
    };

    console.log(sprintStatistic);
    new GameResult(result).render(this.MAIN_WRAPPER);
  }
}
