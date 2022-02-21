import './sprint.scss';
import {
  getTodayDate,
  getUserInfo,
  setRandomNumber,
} from '../../../Helpers/helpers';
import {
  IWord,
  IResult,
  IAnswer,
  IAggregatedWord,
  IAggregatedWords,
  IUserWord,
  IAudioCallStatistic,
  IStatisticResponse,
} from '../../../Interfaces/interfaces';
import { Fetch } from '../../../Fetch/fetch';
import { GameResult } from '../../../Reusable-components/GameResult/gameResult';

const fetch = new Fetch();
export class Sprint {
  TIMER_COUNT: number;
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
  page!: string;
  audio: HTMLAudioElement;
  fromBook!: boolean;
  private _words: any;
  auth: boolean;
  sprintStatistic: IAudioCallStatistic;

  constructor(group: string, page?: string) {
    this.MAIN_WRAPPER = document.querySelector('.main__wrapper') as HTMLElement;
    this.auth = getUserInfo().token === '1' ? false : true;
    this.sprintStatistic = {
      newWords: 0,
    };

    this.group = group;

    if (group === '6') {
      this.fromBook = true;
      if (!page) {
        this.page = '0';
      }
    } else if (page) {
      this.page = page;
      this.fromBook = true;
    } else {
      this.page = String(setRandomNumber(29));
      this.fromBook = false;
    }

    this.TIMER_COUNT = 60;

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
    window.addEventListener('removeEventListeners', this.remove.bind(this));
    document.body.addEventListener('keyup', this.keyUp);
  }

  remove() {
    document.body.removeEventListener('keyup', this.keyUp, false);
  }

  rightAnswer = () => {
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

  wrongAnswer = () => {
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

  right = () => {
    const rightTranslate = this.words.find(
      (wordInfo: IAggregatedWord) => wordInfo.word === this.word
    )?.wordTranslate;
    if (this.translate === rightTranslate) {
      this.rightAnswer();
    } else {
      this.wrongAnswer();
    }
    this.round();
  };

  wrong = () => {
    const rightTranslate = this.words.find(
      (wordInfo: IAggregatedWord) => wordInfo.word === this.word
    )?.wordTranslate;
    if (this.translate !== rightTranslate) {
      this.rightAnswer();
    } else {
      this.wrongAnswer();
    }
    this.round();
  };

  keyUp = async (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') this.right();
    if (e.key === 'ArrowRight') this.wrong();
  };

  async startGame() {
    let extraPage: string = this.page;
    let data: Array<IWord>;
    if (this.auth) {
      let res: IAggregatedWords;
      if (this.group === '6') {
        res = await fetch.GET_AGGREGATED_WORDS({
          wordsPerPage: '3600',
          page: extraPage,
          filter: `{"userWord.difficulty":"hard"}`,
        });
        data = res[0].paginatedResults;
      } else {
        res = await fetch.GET_AGGREGATED_WORDS({
          wordsPerPage: '20',
          filter: `{"$and":[{"group": ${this.group}, "page": ${extraPage}}]}`,
        });
        res[0].paginatedResults = res[0].paginatedResults.filter(
          (item) => item.userWord?.difficulty !== 'easy'
        );
        while (res[0].paginatedResults.length < 20) {
          extraPage = '' + (+extraPage - 1);
          if (+extraPage < 0) break;
          const res2: IAggregatedWords = await fetch.GET_AGGREGATED_WORDS({
            wordsPerPage: '20',
            filter: `{"$and":[{"group": ${this.group}, "page": ${extraPage}}]}`,
          });
          res2[0].paginatedResults = res2[0].paginatedResults.filter(
            (item) => item.userWord?.difficulty !== 'easy'
          );
          res[0].paginatedResults.push(...res2[0].paginatedResults);
        }
        data = res[0].paginatedResults.slice(0, 20);
      }
      data.forEach((item) => {
        item.id = item._id!;
        delete item._id;
      });
    } else {
      data = await fetch.GET_WORDS(this.group, extraPage);
    }

    this.words = data;

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
        };
      }
    });
    this.MAIN_WRAPPER.innerHTML = '';
    this.game();
  }

  timer() {
    const timerContainer = document.querySelector('.timer') as HTMLElement;

    const timerId = setInterval(() => {
      this.TIMER_COUNT -= 1;
      timerContainer.innerHTML = String(this.TIMER_COUNT);
      if (this.TIMER_COUNT === 0) {
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

    let wordInfo: IWord;
    let randomWord: string;
    let randomTranslate: string;

    if (this.words.length < 20) {
      if (this._words === undefined) {
        this._words = this.words.slice();
      }
      const randNum = setRandomNumber(this._words.length);
      if (this._words.length === 0) {
        this.TIMER_COUNT = 0;
        this.stopGame();
      } else {
        wordInfo = this._words[randNum];

        randomWord = wordInfo.word;
        randomTranslate =
          this._words[setRandomNumber(this._words.length)].wordTranslate;
        this._words.splice(randNum, 1);
      }
    } else {
      const randNum = setRandomNumber(this.words.length);
      wordInfo = this.words[randNum];

      randomWord = wordInfo.word;
      randomTranslate =
        this.words[setRandomNumber(this.words.length)].wordTranslate;

      const random = Boolean(setRandomNumber(2));

      if (random) {
        randomWord = wordInfo!.word;
        randomTranslate = wordInfo!.wordTranslate;
      }
    }

    this.currentWord = wordInfo!;

    wordContainer.innerHTML = randomWord!;
    translateContainer.innerHTML = randomTranslate!;

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
    if (userWord.optional.notNew === undefined) {
      this.sprintStatistic.newWords! += 1;
      userWord.optional.notNew = true;
    }
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
      ) {
        userWord.difficulty = 'easy';
        userWord.optional.learnDate = getTodayDate();
      }

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
      if (userWord.difficulty === 'easy') {
        userWord.difficulty = 'string';
        userWord.optional.learnDate = getTodayDate();
      }

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
        <span class="timer">${this.TIMER_COUNT}</span>
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
    this.timer();
    this.fullscreen();
    this.volume();
    this.round();
    const rightBtn = document.querySelector('.right') as HTMLElement;
    const wrongBtn = document.querySelector('.wrong') as HTMLElement;

    rightBtn.addEventListener('click', this.right);
    wrongBtn.addEventListener('click', this.wrong);

    const nav = document.querySelector('.navigation') as HTMLElement;
    nav.addEventListener('click', (e) => {
      const target = e.target as HTMLLIElement;
      if (target.dataset.navigation) {
        if (target.dataset.navigation !== 'games') {
          this.TIMER_COUNT = 1;
        }
      }
    });
  }

  async updateStatistics() {
    try {
      const response: IStatisticResponse = await new Fetch().GET_STATISTICS();
      delete response.id;
      if (response.optional) {
        if (response.optional.sprint) {
          response.optional.sprint.correct! += this.sprintStatistic.correct!;
          response.optional.sprint.wrong! += this.sprintStatistic.wrong!;
          response.optional.sprint.newWords! += this.sprintStatistic.newWords!;
          if (
            response.optional.sprint.maxRow! <= this.sprintStatistic.maxRow!
          ) {
            response.optional.sprint.maxRow! = this.sprintStatistic.maxRow!;
          }
        } else {
          Object.defineProperty(response.optional, 'sprint', {
            value: {
              correct: this.sprintStatistic.correct!,
              wrong: this.sprintStatistic.wrong!,
              newWords: this.sprintStatistic.newWords!,
              maxRow: this.sprintStatistic.maxRow!,
            },
          });
        }
      } else {
        Object.defineProperty(response, 'optional', {
          value: {
            sprint: {
              correct: this.sprintStatistic.correct!,
              wrong: this.sprintStatistic.wrong!,
              newWords: this.sprintStatistic.newWords!,
              maxRow: this.sprintStatistic.maxRow!,
            },
          },
        });
      }
      await new Fetch().UPDATE_STATISTICS(response);
    } catch {
      const body: IStatisticResponse = {
        learnedWords: 0,
        optional: {
          sprint: {
            newWords: this.sprintStatistic.newWords!,
            correct: this.sprintStatistic.correct!,
            wrong: this.sprintStatistic.wrong!,
            maxRow: this.sprintStatistic.maxRow!,
          },
        },
      };
      await new Fetch().UPDATE_STATISTICS(body);
    }
  }

  async stopGame() {
    const wrapper = document.querySelector('.sprint-wrapper') as HTMLElement;
    const gameArea = document.querySelector('.game-area') as HTMLElement;
    if (gameArea) gameArea.innerHTML = '';

    const result: IResult = {
      group: this.group,
      page: this.page,
      points: this.points,
      total: this.answers,
      inRow: this.maxrow,
      rightCount: this.rightAnswers,
      wrongCount: this.mistakes,
      answersArr: this.rightAnswersArr.concat(this.mistakesArr),
      gameName: 'sprint',
    };

    this.remove();
    if (wrapper) {
      if (this.auth) {
        this.words.forEach(async (wordInfo: IAggregatedWord) => {
          const wordId = wordInfo._id ? wordInfo._id : wordInfo.id;
          let getWord: Array<IAggregatedWord> =
            await fetch.GET_AGGREGATED_WORDS_BY_ID(wordId);
          if (getWord[0].userWord) {
            await fetch.UPDATE_USER_WORDS_BY_ID(wordId, wordInfo.userWord!);
          } else {
            await fetch.CREATE_USER_WORDS(wordId, wordInfo.userWord!);
          }
        });
        this.sprintStatistic.correct = this.rightAnswers;
        this.sprintStatistic.wrong = this.mistakes;
        this.sprintStatistic.maxRow = this.maxrow;
        this.updateStatistics();
      }
      new GameResult(result).render(this.MAIN_WRAPPER);
    }
  }
}
