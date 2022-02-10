/* eslint-disable class-methods-use-this */
import './level-page.scss';
import appendFooter from '../../footer/footer';

class LevelPage {
  MAIN_WRAPPER: HTMLElement;

  LEVEL_PAGE: HTMLElement;

  constructor() {
    this.MAIN_WRAPPER = document.querySelector('.main__wrapper') as HTMLElement;
    this.LEVEL_PAGE = document.createElement('section');
    this.LEVEL_PAGE.className = 'level-page page';
  }

  processClick(e: MouseEvent): void {
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

        const level = levelItems.indexOf(clickedButton);

        const target = document.querySelector(
          '.navigation .active'
        ) as HTMLElement;

        if (target.dataset.navigation) {
          const targetAttr: string = target.dataset.navigation;

          switch (targetAttr) {
            case 'book':
              console.log(level);
              // запускаем рендер книги
              break;
            case 'sprint':
              // запускаем рендер спринта
              break;
            case 'audiocall':
              // запускаем рендер аудиовызова
              break;
            default:
              break;
          }
        }
      }
    }
  }

  renderLevelPage(): void {
    this.MAIN_WRAPPER.innerHTML = '';
    this.LEVEL_PAGE.innerHTML = `
      <h1 class="title">Выберите уровень сложности</h1>
      <div class="level-page-content">
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
        <img
          src="./assets/images/background-guys/man-reading-newspaper.svg"
          class="level-img"
          alt="img"
        />
      </div>`;
    this.MAIN_WRAPPER.append(this.LEVEL_PAGE);
    appendFooter(this.MAIN_WRAPPER);
    this.LEVEL_PAGE.addEventListener('click', this.processClick);
  }
}

export default LevelPage;
