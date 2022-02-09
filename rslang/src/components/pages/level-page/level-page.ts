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
  }
}

export default LevelPage;
