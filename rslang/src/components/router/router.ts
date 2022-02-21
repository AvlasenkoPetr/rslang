import { MainPage } from './../pages/main-page/main-page';
import { LoginPage } from '../pages/login-page/login-page';
import LevelPage from '../pages/level-page/level-page';
import './router.scss';

import { BookPage } from '../pages/book-page/book-page';
import { isUserExists } from '../Helpers/helpers';
import GamesPage from '../pages/games-page/games-page';
import StatsPage from '../pages/stats-page/stats-page';
import TeamPage from '../pages/team-page/team-page';
import ErrorPage from '../pages/error-page/error-page';

export class Router {
  NAV_BLOCK: HTMLElement;

  constructor() {
    this.NAV_BLOCK = document.querySelector('.aside') as HTMLElement;
  }

  setListener(): void {
    this.NAV_BLOCK.addEventListener('click', this.processClick);
  }

  processClick = (e: MouseEvent): void => {
    if (!(e.target instanceof HTMLElement)) return;

    const clickedButton: HTMLElement = e.target;
    if (!clickedButton.dataset.navigation) return;

    const clickedButtonDataset: string = clickedButton.dataset.navigation;

    if (clickedButtonDataset === 'open') {
      this.openMenu();
      return;
    }

    if (clickedButtonDataset === 'alter') {
      const body = document.body
      body.classList.toggle('alter')
      return
    }

    if (clickedButtonDataset === 'logout') {
      localStorage.removeItem('UserInfo');
      clickedButton.dataset.navigation = 'login';
      clickedButton.innerHTML = 'Войти';
      window.location.reload()
      return;
    }

    // вынести в отдельную ф-цию (снимаем класс эктив в нав блоке)
    const currentlyActiveButton: HTMLElement | null =
      this.NAV_BLOCK.querySelector('.active');
    if (currentlyActiveButton) {
      if (currentlyActiveButton.dataset.navigation === clickedButtonDataset)
        return;
      currentlyActiveButton.classList.remove('active');
    }

    // вынести в отдельную ф-цию (разбираемся был ли клик в нав блоке и вешаем класс эктив на нужную кнопку)
    if (clickedButton.closest('aside')) {
      clickedButton.classList.add('active');
    } else {
      const navClickedButton: HTMLElement | null = this.NAV_BLOCK.querySelector(
        `[data-navigation=${clickedButtonDataset}]`
      );
      navClickedButton?.classList.add('active');
    }

    this.renderPage(clickedButtonDataset);
  };

  openMenu = (): void => {
    this.NAV_BLOCK.classList.toggle('opened');
    this.NAV_BLOCK.querySelector('.button-open')?.classList.toggle('opened');
  };

  setLastPageToLocalStorage(page: string) {
    localStorage.setItem('lastPage', page);
  }

  setActivePage(currentPage: string) {
    const navigation = document.querySelector('.navigation') as HTMLElement;
    const pages = navigation.querySelectorAll('li') as NodeList;
    pages.forEach((item) => {
      if ((item as HTMLElement).dataset.navigation === currentPage) {
        (item as HTMLElement).classList.add('active');
      } else {
        (item as HTMLElement).classList.remove('active');
      }
    });
  }

  renderPage = (buttonDataset: string = 'main'): void => {
    // Работает через дата-атрибуты
    // прим.: кнопка для переклчения на страницу книги имеет атрибут data-navigation='book', т.е.
    // пишем: case 'book': ${метод рендера у класса страницы книги} return
    this.setLastPageToLocalStorage(buttonDataset);
    this.setActivePage(buttonDataset);

    const EVENT = new CustomEvent('removeEventListeners')
    window.dispatchEvent(EVENT)

    switch (buttonDataset) {
      case 'main':
        const main = new MainPage();
        main.renderMainPage();
        return;

      case 'book':
        const levelPage = new LevelPage(buttonDataset);
        levelPage.renderLevelPage();
        return;

      case 'book-hard': {
        this.setActivePage('book')

        if (!isUserExists()) {
          const errorPage = new ErrorPage()
          errorPage.renderErrorPage()
          return
        }

        const bookPage = new BookPage('6')
        bookPage.renderBookPage()
        return;
      }

      case 'games':
        const gamesPage = new GamesPage()
        gamesPage.renderGamesPage()
        return

      case 'stats':
        const statsPage = new StatsPage()
        statsPage.renderStatsPage()
        return;

      case 'team':
        const teamPage = new TeamPage()
        teamPage.renderTeamPage()
        return;

      case 'login':
        const loginPage = new LoginPage();
        loginPage.renderLoginPage();
        return;
    }
  };
}
