import appendFooter from '../../Reusable-components/footer/footer';
import { LoginPage } from '../login-page/login-page';
import './error-page.scss'

class ErrorPage {
  MAIN_WRAPPER: HTMLElement;

  ERROR_PAGE: HTMLElement;

  constructor() {
    this.MAIN_WRAPPER = document.querySelector('.main__wrapper') as HTMLElement;

    this.ERROR_PAGE = document.createElement('main');
    this.ERROR_PAGE.className = 'error-page page';
  }

  renderErrorPage = () => {
    this.MAIN_WRAPPER.innerHTML = ''

    this.ERROR_PAGE.innerHTML = `
    <h1>Упс...</h1>
    <h2>Похоже этот раздел вам недоступен</h2>
    <h3>Может, попробуете <span data-error="login">авторизироваться</span>?</h3>
    `
    this.ERROR_PAGE.addEventListener('click', this.processClick)

    this.MAIN_WRAPPER.append(this.ERROR_PAGE)
    appendFooter(this.MAIN_WRAPPER)
  }

  processClick = (e: MouseEvent) => {
    if (!(e.target instanceof HTMLElement)) return;

    const clickedButton: HTMLElement = e.target;
    if (!clickedButton.dataset.error) return;

    const navigation = document.querySelector('.aside')
    const currentlyActive = navigation?.querySelector('.active')
    currentlyActive?.classList.remove('active')

    if (clickedButton.dataset.error === 'login') {
      const button = navigation?.querySelector(`[data-navigation=${clickedButton.dataset.error}]`) as HTMLElement
      button.classList.add('active')

      const loginPage = new LoginPage();
      loginPage.renderLoginPage();
      return;
    }
  }
}

export default ErrorPage