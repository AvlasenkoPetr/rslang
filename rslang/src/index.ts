import './styles.sass';

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

let words: Array<IWord>;
let points = 0;
let countPoints = 10;
let progress = 0;

let word: string;
let translate: string;

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
}

function timer() {
  const timerContainer = document.querySelector('.timer') as HTMLElement;
  let timerCount: number = 60;

  const timerId = setInterval(() => {
    timerCount -= 1;
    timerContainer.innerHTML = String(timerCount);
    if (timerCount === 0) clearInterval(timerId);
  }, 1000);
}

function round() {
  const wordContainer = document.querySelector('.word') as HTMLElement;
  const translateContainer = document.querySelector(
    '.translate-word'
  ) as HTMLElement;

  let randomWord = words[getRandomInt(0, 19)].word;
  let randomTranslate = words[getRandomInt(0, 19)].wordTranslate;
  const random = Boolean(getRandomInt(0, 2));

  if (random) {
    const wordInfo = words[getRandomInt(0, 19)];
    randomWord = wordInfo.word;
    randomTranslate = wordInfo.wordTranslate;
  }

  wordContainer.innerHTML = randomWord;
  translateContainer.innerHTML = randomTranslate;

  word = wordContainer.innerText;
  translate = translateContainer.innerText;

  console.log(points, countPoints, progress, random);
}

function updatePointsInfo(state: boolean) {
  const pointsContainer = document.querySelector('.points') as HTMLElement;
  const countPointsContainer = document.querySelector(
    '.count-points'
  ) as HTMLElement;
  const progressItems =
    document.querySelectorAll<HTMLElement>('.progress-item');

  if (state) {
    points += countPoints;
    progress += 1;
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
    countPointsContainer.innerHTML = `+${countPoints} points`;
    progressItems.forEach((el) => {
      el.classList.remove('complete');
    });
  }
}

function game() {
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
    } else {
      updatePointsInfo(false);
    }

    round();
  });

  wrong.addEventListener('click', () => {
    const rightTranslate = words.find(
      (wordInfo) => wordInfo.word === word
    )?.wordTranslate;

    if (translate !== rightTranslate) {
      updatePointsInfo(true);
    } else {
      updatePointsInfo(false);
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
