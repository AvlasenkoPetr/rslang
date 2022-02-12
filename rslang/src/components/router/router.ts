<<<<<<< HEAD
import { LoginPage } from '../pages/login-page/login-page';
import LevelPage from '../pages/level-page/level-page';
import './router.scss';
import { AudioCall } from '../pages/games/audiocall/audioCallGame';
=======
import { MainPage } from './../Pages/main-page/main-page';
import { LoginPage } from '../Pages/login-page/login-page';
import LevelPage from '../Pages/level-page/level-page';
import './router.scss';
>>>>>>> bce9854e33138f849343ea3c5fc697f742b602e1

export class Router {
  NAV_BLOCK: HTMLElement;

  constructor() {
    this.NAV_BLOCK = document.querySelector('.aside') as HTMLElement;
  }

  setListener(): void {
    window.addEventListener('click', this.processClick);
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

    if (clickedButtonDataset === 'logout') {
      localStorage.removeItem('UserInfo')
      clickedButton.dataset.navigation = 'login'
      return
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

  setLastPageToLocalStorage(page:string){
    localStorage.setItem('lastPage', page)
  }

  setActivePage(currentPage:string){
    const navigation = document.querySelector('.navigation') as HTMLElement
    const pages = navigation.querySelectorAll('li') as NodeList
    pages.forEach(item => {
     if((item as HTMLElement).dataset.navigation === currentPage){
      (item as HTMLElement).classList.add('active')
     }else{
      (item as HTMLElement).classList.remove('active')
     }
    })
  }

  renderPage = (buttonDataset: string = 'main'): void => {
    // Работает через дата-атрибуты
    // прим.: кнопка для переклчения на страницу книги имеет атрибут data-navigation='book', т.е.
    // пишем: case 'book': ${метод рендера у класса страницы книги} return
    this.setLastPageToLocalStorage(buttonDataset)
    this.setActivePage(buttonDataset)

    switch (buttonDataset) {
      case 'main': // ф-ция рендера
        const main = new MainPage()
        main.render()
        return;

      case 'book':
        const levelPage = new LevelPage();
        levelPage.renderLevelPage();
        return;

      case 'games':
        const gameLevelPage = new LevelPage();
        gameLevelPage.renderLevelPage();
        return;

      case 'stats':
        return;

      case 'team':
        return;

      case 'login':
<<<<<<< HEAD
        const loginPage = new LoginPage();
        loginPage.renderLoginPage();
        return;

      case 'logout':
        localStorage.removeItem('UserInfo');
        const logoutNavButton: HTMLElement | null = document.querySelector(
          `[data-navigation="${buttonDataset}"]`
        );
        if (logoutNavButton) {
          logoutNavButton.dataset.navigation = 'login';
        }
        return;
=======
        const loginPage = new LoginPage
        loginPage.renderLoginPage()
        return
>>>>>>> bce9854e33138f849343ea3c5fc697f742b602e1
    }
  };
}
