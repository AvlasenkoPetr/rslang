import './spint.sass';

interface IWord {
  id: string;
  group: number;
  page: number;
  word: string;
  image: string;
  audio: string;
  audioMeaning: string;
  audioExample: string;
  textMeaning: string;
  textExample: string;
  transcription: string;
  wordTranslate: string;
  textMeaningTranslate: string;
  textExampleTranslate: string;
}

const app = document.querySelector('body') as HTMLElement;

let timerCount: number = 30;

let words: Array<IWord>;
let points = 0;
let countPoints = 10;
let progress = 0;

let answers = 0;
let rightAnswers = 0;
let mistakes = 0;

let currentWord: IWord;
let word: string;
let translate: string;

const rightAnswersArr: Array<IWord> = [];
const mistakesArr: Array<IWord> = [];

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
}

function renderResultsAnswer(ans: IWord, wrapper: HTMLElement) {
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

function renderResults() {
  let accurancy = Math.round((rightAnswers / answers) * 100);
  if (Number.isNaN(accurancy)) accurancy = 0;

  app.insertAdjacentHTML(
    'beforeend',
    `
    <div class="results">
      <p class="result-points">Вы набрали ${points} очков</p>
      <p class="accurancy">Accurancy ${accurancy}%</p>
      <p class="right-answ-count">Правильных ответов: ${rightAnswers}</p>
      <p class="mistakes-count">Ошибок: ${mistakes}</p>
      <p class="repeated">Всего слов: ${answers}</p>
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

  rightAnswersArr.forEach((ans) => {
    renderResultsAnswer(ans, rightAnswersUl);
  });

  mistakesArr.forEach((ans) => {
    renderResultsAnswer(ans, mistakeAnswersUl);
  });
}

function stopGame() {
  const gameArea = document.querySelector('.game-area') as HTMLElement;

  gameArea.style.display = 'none';
  renderResults();
}

function timer() {
  const timerContainer = document.querySelector('.timer') as HTMLElement;

  const timerId = setInterval(() => {
    timerCount -= 1;
    timerContainer.innerHTML = String(timerCount);
    if (timerCount === 0) {
      clearInterval(timerId);
      stopGame();
    }
  }, 1000);
}

function round() {
  const wordContainer = document.querySelector('.word') as HTMLElement;
  const translateContainer = document.querySelector(
    '.translate-word'
  ) as HTMLElement;

  const wordInfo = words[getRandomInt(0, 19)];
  let randomWord = wordInfo.word;
  let randomTranslate = words[getRandomInt(0, 19)].wordTranslate;
  const random = Boolean(getRandomInt(0, 2));

  if (random) {
    // wordInfo = words[getRandomInt(0, 19)];
    randomWord = wordInfo.word;
    randomTranslate = wordInfo.wordTranslate;
  }

  currentWord = wordInfo;

  wordContainer.innerHTML = randomWord;
  translateContainer.innerHTML = randomTranslate;

  word = wordContainer.innerText;
  translate = translateContainer.innerText;
}

function updatePointsInfo(state: boolean) {
  answers += 1;
  const pointsContainer = document.querySelector('.points') as HTMLElement;
  const countPointsContainer = document.querySelector(
    '.count-points'
  ) as HTMLElement;
  const progressItems =
    document.querySelectorAll<HTMLElement>('.progress-item');

  if (state) {
    points += countPoints;
    progress += 1;
    rightAnswers += 1;

    if (progress === 4) {
      progress = 0;
      countPoints *= 2;
      progressItems.forEach((el) => {
        el.classList.remove('complete');
      });
    }

    pointsContainer.innerHTML = String(points);
    countPointsContainer.innerHTML = `+${countPoints} points`;
    for (let i = 0; i < progress; i += 1) {
      progressItems[i].classList.add('complete');
    }
  } else {
    progress = 0;
    countPoints = 10;
    mistakes += 1;
    countPointsContainer.innerHTML = `+${countPoints} points`;
    progressItems.forEach((el) => {
      el.classList.remove('complete');
    });
  }
}

function renderGame() {
  app.insertAdjacentHTML(
    'beforeend',
    `
    <div class="game-area">
      <span class="points">0</span>
      <span class="count-points">+10 points</span>
      <div class="progress">
        <div class="progress-item"></div>
        <div class="progress-item"></div>
        <div class="progress-item"></div>
      </div>

      <div class="main-window">
        <span class="word"></span>
        <span class="translate-word"></span>
        <div class="main-buttons">
          <button class="right">right</button>
          <button class="wrong">wrong</button>
        </div>
      </div>

      <span class="timer">${timerCount}</span>
    </div>
  `
  );
}

function game() {
  renderGame();
  const right = document.querySelector('.right') as HTMLElement;
  const wrong = document.querySelector('.wrong') as HTMLElement;

  timer();
  round();

  right.addEventListener('click', () => {
    const rightTranslate = words.find(
      (wordInfo) => wordInfo.word === word
    )?.wordTranslate;

    if (translate === rightTranslate) {
      updatePointsInfo(true);
      if (
        rightAnswersArr.find((wordInfo) => wordInfo === currentWord) ===
        undefined
      ) {
        rightAnswersArr.push(currentWord);
      }
    } else {
      updatePointsInfo(false);
      if (
        mistakesArr.find((wordInfo) => wordInfo === currentWord) === undefined
      ) {
        mistakesArr.push(currentWord);
      }
    }

    round();
  });

  wrong.addEventListener('click', () => {
    const rightTranslate = words.find(
      (wordInfo) => wordInfo.word === word
    )?.wordTranslate;

    if (translate !== rightTranslate) {
      updatePointsInfo(true);
      if (
        rightAnswersArr.find((wordInfo) => wordInfo === currentWord) ===
        undefined
      ) {
        rightAnswersArr.push(currentWord);
      }
    } else {
      updatePointsInfo(false);
      if (
        mistakesArr.find((wordInfo) => wordInfo === currentWord) === undefined
      ) {
        mistakesArr.push(currentWord);
      }
    }

    round();
  });
}

async function getWords() {
  const randomPage = getRandomInt(0, 29);
  const res = await fetch(
    `https://rss21q3-rslang.herokuapp.com/words?group=1&page=${randomPage}`
  );
  words = await res.json();
  game();
}
getWords();
