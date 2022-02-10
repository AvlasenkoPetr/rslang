import { appendFooter } from '../../footer/footer';
import './main-page.scss';
export class MainPage {
  MAIN_WRAPPER: HTMLElement | null;

  constructor() {
    this.MAIN_WRAPPER = document.querySelector('.main__wrapper');
  }
}
