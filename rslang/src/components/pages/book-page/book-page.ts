import { Fetch } from '../../Fetch/fetch';
import { isUserExists } from '../../Helpers/helpers';
import {
  IAggregatedWord,
  IAggregatedWords,
  IUserWord,
  IWord,
} from '../../Interfaces/interfaces';
import appendFooter from '../../Reusable-components/footer/footer';
import { Spinner } from '../../Reusable-components/spinner/spinner';
import { AudioCall } from '../games/audiocall/audioCallGame';
import { Sprint } from '../games/sprint/sprint';
import './book-page.scss';

export class BookPage {
  MAIN_WRAPPER: HTMLElement;
  BOOK_PAGE: HTMLElement;
  WORDS_CONTAINER: HTMLElement;
  LEVEL: string;
  LEVEL_NAMES: Array<string>;
  AUDIO;
  FETCH;

  constructor(level: string) {
    this.MAIN_WRAPPER = document.querySelector('.main__wrapper') as HTMLElement;

    this.BOOK_PAGE = document.createElement('main');
    this.BOOK_PAGE.className = 'book-page page';
    this.BOOK_PAGE.addEventListener('click', this.processClick);

    this.WORDS_CONTAINER = document.createElement('div');
    this.WORDS_CONTAINER.className = 'words-container';

    this.LEVEL = level;
    this.LEVEL_NAMES = ['a1', 'a2', 'b1', 'b2', 'c1', 'c2', 'hard'];

    this.AUDIO = new Audio();

    this.FETCH = new Fetch();
  }

  processClick = async (e: MouseEvent): Promise<void> => {
    if (!(e.target instanceof HTMLElement)) return;

    const clickedButton: HTMLElement = e.target;
    if (
      !clickedButton.dataset.book ||
      clickedButton.classList.contains('disabled')
    )
      return;

    const clickedButtonDataset: string = clickedButton.dataset.book;

    const pageCounter: HTMLInputElement | null = document.getElementById(
      'counter'
    ) as HTMLInputElement;
    const pageNum: string = pageCounter
      ? String(Number(pageCounter?.value) - 1)
      : '';

    const spinner = new Spinner();

    switch (clickedButtonDataset) {
      case 'audiocall':
        savePageData()
        spinner.startTimer(() => {
          new AudioCall(this.LEVEL, pageNum).startGame();
        });
        return;

      case 'sprint':
        savePageData()
        spinner.startTimer(() => {
          new Sprint(this.LEVEL, pageNum).startGame();
        });
        return;

      case 'prev':
        this.toPrevPage(clickedButton);
        return;

      case 'next':
        this.toNextPage(clickedButton);
        return;

      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
        if (clickedButton.classList.contains('active')) return;

        this.LEVEL = clickedButtonDataset;
        this.renderBookPage();
        return;
    }
  };

  processWordClick = async (e: MouseEvent, word: IWord | IAggregatedWord) => {
    if (!(e.target instanceof HTMLElement)) return;

    const clickedButton: HTMLElement = e.target;
    if (!clickedButton.dataset.word || clickedButton.classList.contains('disabled')) return;

    const clickedButtonDataset: string = clickedButton.dataset.word;

    switch (clickedButtonDataset) {
      case 'play':
        const isThisAlreadyPlaying =
          clickedButton.classList.contains('playing');
        if (isThisAlreadyPlaying) {
          clickedButton.classList.remove('playing');
          this.AUDIO.pause();
          return;
        }

        const currentlyPlayingSomewhere: HTMLElement | null =
          document.querySelector('.playing');
        if (currentlyPlayingSomewhere) {
          currentlyPlayingSomewhere.classList.remove('playing');
          this.AUDIO.pause();
        }

        clickedButton.classList.add('playing');
        this.playAudioChain(
          clickedButton,
          word.audio,
          word.audioMeaning,
          word.audioExample
        );
        return;

      case 'hard':
      case 'easy':
        const wordItem: HTMLElement | null = clickedButton.closest(
          '.words-container__item'
        );
        if (!wordItem) return;
        const wordId: string = word._id ? word._id : word.id;

        if (wordItem.classList.contains(`${clickedButtonDataset}`)) {
          await this.FETCH.UPDATE_USER_WORDS_BY_ID(wordId, {
            difficulty: 'string',
          });

          if (this.LEVEL === '6') {
            wordItem.remove();
            return;
          }
          wordItem.classList.remove(`${clickedButtonDataset}`);
          this.isPageLearned()
          return;
        }

        if (
          wordItem.classList.contains('easy') ||
          wordItem.classList.contains('hard')
        ) {
          await this.FETCH.UPDATE_USER_WORDS_BY_ID(wordId, {
            difficulty: `${clickedButtonDataset}`,
          });

          if (this.LEVEL === '6') {
            wordItem.remove();
            return;
          }
          wordItem.classList.remove(
            `${wordItem.classList[wordItem.classList.length - 1]}`
          );
          wordItem.classList.add(`${clickedButtonDataset}`);
          this.isPageLearned()
          return;
        }

        await this.FETCH.GET_USER_WORDS_BY_ID(word.id)
          .then(() =>
            this.FETCH.UPDATE_USER_WORDS_BY_ID(word.id, {
              difficulty: `${clickedButtonDataset}`,
            })
          )
          .catch(() =>
            this.FETCH.CREATE_USER_WORDS(word.id, {
              difficulty: `${clickedButtonDataset}`,
            })
          );

        wordItem.classList.add(`${clickedButtonDataset}`);
        this.isPageLearned()
        return;
    }
  };

  renderBookPage = async (page?: string) => {
    this.MAIN_WRAPPER.innerHTML = '';

    this.BOOK_PAGE.innerHTML = this.bookMenuContent(page);
    this.BOOK_PAGE.append(this.WORDS_CONTAINER);
    appendFooter(this.BOOK_PAGE);

    this.MAIN_WRAPPER.append(this.BOOK_PAGE);
    await this.renderWordsContainer();

    this.setActiveLevel();
  };

  renderWordsContainer = async (): Promise<void> => {
    this.WORDS_CONTAINER.innerHTML = '';

    const pageCounter: HTMLInputElement | null = document.getElementById(
      'counter'
    ) as HTMLInputElement;
    const pageNum: string = String(Number(pageCounter?.value) - 1);

    const wordsData: Array<IWord> | Array<IAggregatedWord> =
      await this.getWordsToRender(pageNum);
    const userWordsData: Array<IUserWord> | undefined =
      await this.getUserWords();

    for (let word of wordsData) {
      const wordItem: HTMLElement = document.createElement('div');
      wordItem.className = `words-container__item ${
        this.LEVEL_NAMES[Number(this.LEVEL)]
      }`;

      const userWord = userWordsData?.find(
        (userWord) => userWord.wordId === word.id
      );
      if (userWord && userWord.difficulty !== 'string') {
        wordItem.classList.add(`${userWord.difficulty}`);
      }

      wordItem.innerHTML = `${this.wordItemContent(word, userWord)}`;
      
      wordItem.addEventListener('click', async (e: MouseEvent) =>
        this.processWordClick(e, word)
      );

      this.WORDS_CONTAINER.append(wordItem);
    }
    this.isPageLearned()
  };

  getWordsToRender = async (
    pageNum?: string
  ): Promise<IWord[] | IAggregatedWord[]> => {
    let wordsData: Array<IWord> | Array<IAggregatedWord>;
    if (this.LEVEL !== '6') {
      wordsData = await this.FETCH.GET_WORDS(this.LEVEL, pageNum);
    } else {
      const hardWordsData: IAggregatedWords =
        await this.FETCH.GET_AGGREGATED_WORDS({
          filter: `{"userWord.difficulty":"hard"}`,
        });
      wordsData = hardWordsData[0].paginatedResults;
      console.log(hardWordsData);
    }
    console.log(wordsData);
    return wordsData;
  };

  getUserWords = async (): Promise<IUserWord[] | undefined> => {
    let userWordsData: Array<IUserWord> | undefined;
    if (isUserExists()) {
      userWordsData = await this.FETCH.GET_USER_WORDS();
      console.log(userWordsData);
    }
    return userWordsData;
  };

  async toNextPage(button: HTMLElement): Promise<void> {
    const pageCounter = button.previousElementSibling as HTMLInputElement;
    if (pageCounter.value === '30') return;

    this.toggleDisabled('.book-page__pagination-container_button')
    pageCounter.stepUp();

    await this.renderWordsContainer();
    this.toggleDisabled('.book-page__pagination-container_button')
  }

  async toPrevPage(button: HTMLElement): Promise<void> {
    const pageCounter = button.nextElementSibling as HTMLInputElement;
    if (pageCounter.value === '1') return;

    this.toggleDisabled('.book-page__pagination-container_button')
    pageCounter.stepDown();

    await this.renderWordsContainer();
    this.toggleDisabled('.book-page__pagination-container_button')
  }

  toggleDisabled = (selector: string, func?: string) => {
    const elements = document.querySelectorAll(`${selector}`)
    if (func === 'add') {
      elements.forEach((el) => el.classList.add('disabled'))
    } else if (func === 'remove') {
      elements.forEach((el) => el.classList.remove('disabled'))
    } else {
      elements.forEach((el) => el.classList.toggle('disabled'))
    }
  }

  setActiveLevel = (): void => {
    const currentLevelButton: HTMLElement | null = document.querySelector(
      `[data-book="${this.LEVEL}"]`
    );
    const activeLevelButton =
      currentLevelButton?.parentElement?.querySelector('.active');
    if (activeLevelButton) {
      activeLevelButton.classList.remove('active');
    }
    currentLevelButton?.classList.add('active');
  };

  isPageLearned = () => {
    const learnedWords = this.WORDS_CONTAINER.querySelectorAll('.easy')
    const hardWords = this.WORDS_CONTAINER.querySelectorAll('.hard')
    const words = this.WORDS_CONTAINER.querySelectorAll('.words-container__item')

    if (learnedWords.length > 0 && 
    (learnedWords.length + hardWords.length) === words.length) {
      this.BOOK_PAGE.classList.add('learned')
      this.toggleDisabled('.book-page__games-menu_button', 'add')
      
    } else {
      this.BOOK_PAGE.classList.remove('learned')
      this.toggleDisabled('.book-page__games-menu_button', 'remove')
    }
  }

  playAudioChain = (button: HTMLElement, ...args: Array<string>): void => {
    if (args.length === 0) {
      this.AUDIO.pause();
      button.classList.remove('playing');
      return;
    }

    this.AUDIO.src = `https://rss21q3-rslang.herokuapp.com/${args[0]}`;
    this.AUDIO.play();
    this.AUDIO.onended = () => this.playAudioChain(button, ...args.slice(1));
  };

  bookMenuContent = (page: string | undefined): string => {
    return ` 
    <div class="book-page__menu-wrapper">
      <h2>Электронный учебник</h2>

      <div class="book-page__games-menu">
        <button class="book-page__games-menu_button" data-book="sprint">Спринт</button>
        <button class="book-page__games-menu_button" data-book="audiocall">Аудиовызов</button>
      </div>

      <div class="book-page__menu-row">

        ${this.LEVEL !== '6' ? this.paginationBlockContent(page) : '<div></div>'}

        <div class="book-page__level-container">
          <button class="book-page__level-container_button" data-book="0">A1</button>
          <button class="book-page__level-container_button" data-book="1">A2</button>
          <button class="book-page__level-container_button" data-book="2">B1</button>
          <button class="book-page__level-container_button" data-book="3">B2</button>
          <button class="book-page__level-container_button" data-book="4">C1</button>
          <button class="book-page__level-container_button" data-book="5">C2</button>
          ${
            isUserExists()
              ? '<button class="book-page__level-container_button" data-book="6">H</button>'
              : ''
          }
        </div>

      </div>
    </div>
    `;
  };

  paginationBlockContent = (page: string | undefined): string => {
    return `
    <div class="book-page__pagination-container">
      <button class="book-page__pagination-container_button" data-book="prev"></button>
      <input type="number" min="1" max="30" value="${page ? page : 1}" class="book-page__pagination-container_counter" id="counter" readonly></input>
      <button class="book-page__pagination-container_button" data-book="next"></button>
    </div>
    `;
  };

  wordControllsContent = (
    userWord: IUserWord | undefined
  ): string => {
    const wrongAnswers = userWord?.optional?.wrong
    const correctAnswers = userWord?.optional?.correct
    return `
    <div class="difficulty-cotrolls__block">
      <button class="difficulty-cotrolls__button" data-word="hard" title="Пометить слово как сложное"></button>
      <button class="difficulty-cotrolls__button" data-word="easy" title="Пометить слово как изученное"></button>
    </div>

    <div class="answers-counter__block">
      <input class="answers-counter__wrong" type="number" value="${
        wrongAnswers ? wrongAnswers : 0
      }" readonly>
      <input class="answers-counter__correct" type="number" value="${
        correctAnswers ? correctAnswers : 0
      }" readonly>
    </div>
    `;
  };

  wordItemContent = (word: IWord, userWord?: IUserWord): string => {
    return `
    <div class="words-container__item_image-block">
      <img src="https://rss21q3-rslang.herokuapp.com/${word.image}">
    </div>

    <div class="words-container__item_info-block">
      <div class="info-block_title">
        ${word.word[0].toUpperCase()}${word.word.slice(1)} -
        ${word.transcription} - 
        ${word.wordTranslate}
      </div>

      <div class="info-block_description">
        ${word.textMeaning}<br>${word.textMeaningTranslate}
      </div>

      <div class="info-block_description">
        ${word.textExample}<br>${word.textExampleTranslate}
      </div>
    </div>

    <div class="words-container__item_controlls-block">
      <button class="sound-button" data-word="play"></button>
      ${
        isUserExists()
          ? this.wordControllsContent(userWord)
          : ''
      }
    </div> 
    `;
  };
}

window.addEventListener('beforeunload', () => {
  if (document.querySelector('.book-page')) {
    savePageData()

  } else {
    localStorage.removeItem('lastBookLevel')
    localStorage.removeItem('lastBookPage')
  }
})

function savePageData() {
  const pageCounter: HTMLInputElement | null = document.getElementById(
    'counter'
  ) as HTMLInputElement;
  const pageNum: string = pageCounter?.value;
  localStorage.setItem('lastBookPage', pageNum)

  const levels = document.querySelectorAll('.book-page__level-container_button')
  levels.forEach((level, index) => {
    if (level.classList.contains('active')) {
      localStorage.setItem('lastBookLevel', String(index))
    }
  })
}