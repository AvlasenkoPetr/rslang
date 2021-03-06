import fullScreen from '../../../../assets/images/audioCall/fullScreen.svg';
import audioButton from '../../../../assets/images/audioCall/audio-button.svg';
import appendFooter from '../../../Reusable-components/footer/footer';
import { IAnswer, IState, IWord } from '../../../Interfaces/interfaces';

class GamePage {
  public MAIN_WRAPPER: HTMLElement;
  constructor() {
    this.MAIN_WRAPPER = document.querySelector('.main__wrapper') as HTMLElement;
  }

  renderWords(state: IState) {
    const wordWrapper = document.querySelector('#wordWrapper') as HTMLElement;
    const audioWrapper = document.querySelector('#audioWrapper') as HTMLElement;
    const nextPageButton = document.querySelector(
      '#nextPageButton'
    ) as HTMLElement;
    const data = state.data!;
    const currentPage = state.currentPage;
    this.renderCurrentPage(currentPage);
    this.renderAllPages(data.length);
    audioWrapper.innerHTML = `<img class="answer-img" src="https://rss21q3-rslang.herokuapp.com/${data[currentPage].image}">`;
    wordWrapper.innerHTML = this.pageContent(data[currentPage]);
    const hiddenWord = document.querySelector('#hiddenWord') as HTMLElement;
    if (state.isAnswerHide === false) {
      hiddenWord.classList.add('visible');
      nextPageButton.classList.remove('hide');
      (nextPageButton.nextElementSibling as HTMLElement).classList.add('hide');
    } else if (state.isAnswerHide === true) {
      hiddenWord.classList.remove('visible');
      nextPageButton.classList.add('hide');
      (nextPageButton.nextElementSibling as HTMLButtonElement).classList.remove(
        'hide'
      );
    }
  }

  renderCurrentPage(currentPage: number) {
    const audioCallCurrentPage = document.querySelector(
      '#audioCallCurrentPage'
    ) as HTMLSpanElement;
    audioCallCurrentPage.innerHTML = `${(currentPage += 1)}`;
  }

  renderAllPages(pages: number) {
    const audioCallAllPages = document.querySelector(
      '#audioCallAllPages'
    ) as HTMLSpanElement;
    audioCallAllPages.innerHTML = `${pages}`;
  }

  renderAnswers(data: Array<IWord>, currentPage: IWord) {
    const answersWrapper = document.querySelector(
      '#answersWrapper'
    ) as HTMLElement;
    const audioWrapper = document.querySelector('#audioWrapper') as HTMLElement;
    audioWrapper.innerHTML = this.audioContent(currentPage, true);
    answersWrapper.innerHTML = '';
    data.forEach((item) => {
      const button = document.createElement('button');
      if (item.id === currentPage.id) {
        button.setAttribute('isRight', 'true');
      } else button.setAttribute('isRight', 'false');
      button.textContent = item.wordTranslate;
      button.setAttribute('id', item.id);
      button.classList.add('answer');
      button.classList.add('btn');
      answersWrapper.append(button);
    });
  }

  render() {
    this.MAIN_WRAPPER.innerHTML = this.gamePageContent();
  }

  resultsContent(rightAnswers: Array<IAnswer>, worthAnswers: Array<IAnswer>) {
    return `
    <div class="overlay">
      <div class="modal-window__wrapper">
        <h2 class="modal-window__title>????????????????????</h2>
        <div class="modal-window__content">
          <h3 class="rightContent__title">?? ???????? <span id="rightAnswersCounter" class="right-answers_counter">${
            rightAnswers.length
          }</span></h3>        
          <div id="rightContentBody" class="rightContent__body">
          ${rightAnswers
            .map((answer: IAnswer) => {
              return `
      <div>${answer.info.word} - ${answer.info.wordTranslate}</div>
      `;
            })
            .join('')}
          </div>
          <h3 class="worthContent__title">?? ???? ???????? <span id="worthAnswersCounter" class="worth-answers_counter">${
            worthAnswers.length
          }</span></h3>        
          <div id="worthContentBody" class="worthContent__body">
          ${worthAnswers
            .map((answer: IAnswer) => {
              return `
            <div>${answer.info.word} - ${answer.info.wordTranslate}</div>
            `;
            })
            .join('')}</div>
          <button id="closeModalWindow" class="close-modal-window">??????????????</button>
        </div>
      </div>
    </div>
    `;
  }

  audioContent(data: IWord, isAutoPlay: boolean) {
    return `
    <button class="audioCall__audio-button">
      <span class="internal-img">
        <img src="${audioButton}" alt="audio-button">
      </span>
    </button>
    <audio ${
      isAutoPlay ? 'autoplay' : ''
    } src="https://rss21q3-rslang.herokuapp.com/${data.audio}"></audio>
    `;
  }

  pageContent(data: IWord) {
    return `
      <div id="hiddenWord" class="word">
        <p>${data.word}</p>
        ${this.audioContent(data, false)}
      </div>
    `;
  }

  gamePageContent() {
    return `
      <main id="audioCallMainElement" class="audioCall-page page">
        <div class="container">
          <div class="audioCall__header">
            <div class="current-answer"><span id="audioCallCurrentPage"></span> / <span id="audioCallAllPages"></span></div>
            <div class="fullScreen-btn__wrapper">
              <button id="fullscreenButton" class="fullScreen-btn">
                <img src="${fullScreen}">
              </button>
            </div>
          </div>  
          <div class="audio__wrapper">
            <div class="audioButton__wrapper" id="audioWrapper"></div>
            <div class="word__wrapper" id="wordWrapper"></div>
          </div>
          <div class="answers__wrapper" id="answersWrapper"></div>
          <div class="btn__wrapper">
            <button class="btn next-page__btn hide" id="nextPageButton">??????????</button>
            <button class="btn dont-know__button" id="dontKnowButton">???? ????????</button>
          </div>
        </div>
      </main>
    `;
  }
}

export { GamePage };
