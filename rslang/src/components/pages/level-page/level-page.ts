/* eslint-disable class-methods-use-this */
import './level-page.scss';
import { getUserInfo, isUserExists } from '../../Helpers/helpers';
import { Sprint } from '../games/sprint/sprint';
import { AudioCall } from '../games/audiocall/audioCallGame';
import appendFooter from '../../Reusable-components/footer/footer';
import { BookPage } from '../book-page/book-page';
import { Spinner } from '../../Reusable-components/spinner/spinner';

class LevelPage {
  MAIN_WRAPPER: HTMLElement;

  LEVEL_PAGE: HTMLElement;

  target: 'book' | 'sprint' | 'audiocall';

  constructor(target: 'book' | 'sprint' | 'audiocall') {
    this.MAIN_WRAPPER = document.querySelector('.main__wrapper') as HTMLElement;

    this.LEVEL_PAGE = document.createElement('section');
    this.LEVEL_PAGE.className = 'level-page page';

    this.target = target
    localStorage.setItem('currentGame', this.target)
  }

  processClick = (e: MouseEvent): void => {
    if (e.target instanceof HTMLElement) {
      let clickedButton = e.target as HTMLElement;

      if (
        clickedButton.className === 'level-item' ||
        clickedButton.className === 'label'
      ) {
        const levelItems: Array<HTMLElement> = Array.from(
          document.querySelectorAll('.level-item')
        );
        if (clickedButton.className === 'label')
          clickedButton = clickedButton.offsetParent as HTMLElement;

        const level = String(levelItems.indexOf(clickedButton));

        const target = document.querySelector(
          '.navigation .active'
        ) as HTMLElement;

        this.renderPageByAttr(this.target, level);
        // if (target.dataset.navigation) {
        //   const targetAttr: string = target.dataset.navigation;
      }
    }
  };

  renderPageByAttr = (targetAttr: string, level: string): void => {
    const spinner = new Spinner();

    switch (targetAttr) {
      case 'book':
        const bookPage = new BookPage(level);
        bookPage.renderBookPage();
        break;

      case 'sprint':
        spinner.startTimer(() => {
          new Sprint(level).startGame();
        });
        break;

      case 'audiocall':
        spinner.startTimer(() => {
          new AudioCall(level).startGame();
        });
        break;

      default:
        break;
    }
  };

  renderLevelPage(): void {
    this.MAIN_WRAPPER.innerHTML = '';
    // <h1 class="title">Выберите уровень сложности</h1>
    this.LEVEL_PAGE.innerHTML = `
      <div class="wrapper">
      <div class="level-page__content">
        <div class="levels">
          <div class="level-item">
            <div class="label">A1</div>
            <span class="label-title">Elementary</span>
          </div>
          <div class="level-item">
            <div class="label">A2</div>
            <span class="label-title">Pre-Intermediate</span>
          </div>
          <div class="level-item">
            <div class="label">B1</div>
            <span class="label-title">Intermediate</span>
          </div>
          <div class="level-item">
            <div class="label">B2</div>
            <span class="label-title">Upper-Intermediate</span>
          </div>
          <div class="level-item">
            <div class="label">C1</div>
            <span class="label-title">Advanced</span>
          </div>
          <div class="level-item">
            <div class="label">C2</div>
            <span class="label-title">Proficiency</span>
          </div>
        </div>
      </div>
      </div>`;
    this.MAIN_WRAPPER.append(this.LEVEL_PAGE);
    appendFooter(this.MAIN_WRAPPER);

    this.LEVEL_PAGE.addEventListener('click', this.processClick);

    const target = document.querySelector('.navigation .active') as HTMLElement;
    // const userInfo = getUserInfo();
    // const auth = userInfo.token === '1' ? false : true;

    if (target.dataset.navigation) {
      const targetAttr: string = target.dataset.navigation;
      if (targetAttr === 'book') {
        const levelsWrapper = document.querySelector('.levels') as HTMLElement;
        levelsWrapper.insertAdjacentHTML(
          'afterend',
          `
          <div class="level-page__description_wrapper">
            <div class="level-page__description">
              <p class="subtitle">
              <span>Электронный учебник</span> - библиотека из 3600 часто встречающихся слов. 
              Слова в коллекции отсортированы от более простых и известных к более сложным.
              Авторизированные пользователи могут отмечать слова как "сложные" и "изученные"!
              Сложные слова будут доступны в отдельном разделе, для отдельного их повторения. 
              Изученные слова не будут участвовать в играх, запущенных со страниц учебника.
              </p>
            </div>
            
            <img
            src="./assets/images/background-guys/man-reading-newspaper.svg"
            class="level-img"
            alt="img"
            />
          </div>
        `
        );

        if (isUserExists()) {
          levelsWrapper.insertAdjacentHTML(
            'beforeend',
            `
            <div class="level-item">
            <div class="label">HARD</div>
            <span class="label-title">Hard words</span>
            </div>
            `
          );
        }
      }
      // if (targetAttr === 'sprint') {
      //   const subtitle = document.querySelector('.subtitle') as HTMLElement;
      //   subtitle.innerHTML =
      //     '<span>Спринт</span> - выберите соответсвует ли перевод предложенному слову';
      // }
      // if (targetAttr === 'audiocall') {
      //   const subtitle = document.querySelector('.subtitle') as HTMLElement;
      //   subtitle.innerHTML =
      //     '<span>Аудиовызов</span> - выберите из предложенных вариантов ответа правильный перевод слова, который услышите';
      // }
    }
  }
}

export default LevelPage;
