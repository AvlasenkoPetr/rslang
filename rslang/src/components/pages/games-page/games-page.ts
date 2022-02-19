import appendFooter from '../../Reusable-components/footer/footer';
import LevelPage from '../level-page/level-page';
import './games-page.scss'


class GamesPage {
    MAIN_WRAPPER: HTMLElement;
  
    GAMES_PAGE: HTMLElement;
  
    constructor() {
      this.MAIN_WRAPPER = document.querySelector('.main__wrapper') as HTMLElement;
  
      this.GAMES_PAGE = document.createElement('main');
      this.GAMES_PAGE.className = 'games-page page';
      this.GAMES_PAGE.addEventListener('click', this.processClick)
    }

    processClick = (e: MouseEvent) => {
      if (!(e.target instanceof HTMLElement)) return
      const clickedElement = e.target as HTMLElement

      const closestButton: HTMLElement | null = clickedElement.closest('[data-games]')
      if (!closestButton) return
      
      const clickedDataset: string | undefined = closestButton.dataset.games
      if (clickedDataset 
        && (clickedDataset === 'audiocall'
        || clickedDataset === 'sprint')) {
          console.log(clickedDataset);
           
          const levelPage = new LevelPage(clickedDataset)
          levelPage.renderLevelPage()
        }
    }

    renderGamesPage = () => {
      this.MAIN_WRAPPER.innerHTML = ''
      this.GAMES_PAGE.innerHTML = this.gamesPageContent()

      this.MAIN_WRAPPER.append(this.GAMES_PAGE)
      appendFooter(this.MAIN_WRAPPER)
    }

    gamesPageContent = (): string => {
      return `
      <div class="games-page__container">

        <div class="games-card" data-games="sprint">
        <img src="../../../assets/images/navigation/sprint-black.svg">
        <h2>Спринт</h2>
        <p>Описание игры</p>
        </div>

        <div class="games-card" data-games="audiocall">
        <img src="../../../assets/images/navigation/audiocall-black.svg">
        <h2>Аудиовызов</h2>
        <p>Описание игры</p>
        </div>

      </div>
      `
    }
}

export default GamesPage