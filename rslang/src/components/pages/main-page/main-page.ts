import { Fetch } from '../../Fetch/fetch';
import './main-page.scss';

export class MainPage {
  MAIN_WRAPPER: HTMLElement | null;
  MAIN_PAGE: HTMLElement
  FETCH

  constructor() {
    this.MAIN_WRAPPER = document.querySelector('.main__wrapper') as HTMLElement;

    this.MAIN_PAGE = document.createElement('main')
    this.MAIN_PAGE.className = 'login-page page'
    // this.MAIN_PAGE.addEventListener('click', this.processClick)
    
    this.FETCH = new Fetch
  }

  renderMainPage = () => {
    
  }
}
