<<<<<<< HEAD
import { appendFooter } from '../../Footer/footer';
import './login-page.scss';
=======
import { appendFooter } from '../../footer/footer'
import './login-page.scss'
>>>>>>> 25ef291e53f2dc600fc953158ec9e0eafa1a0a6b

type signUpBody = {
  name: string;
  email: string;
  password: string;
};

export class LoginPage {
  MAIN_WRAPPER: HTMLElement;
  LOGIN_PAGE: HTMLElement;

  constructor() {
    this.MAIN_WRAPPER = document.querySelector('.main__wrapper') as HTMLElement;

    this.LOGIN_PAGE = document.createElement('main');
    this.LOGIN_PAGE.className = 'login-page page';
    this.LOGIN_PAGE.addEventListener('click', this.processClick);
  }

  processClick = (e: MouseEvent): void => {
    if (!(e.target instanceof HTMLElement)) return;

    const clickedButton: HTMLElement = e.target;
    if (!clickedButton.dataset.login) return;

    const clickedButtonDataset: string = clickedButton.dataset.login;

    switch (clickedButtonDataset) {
      case 'render-signup':
        this.renderSignUpPage();
        return;

      case 'render-login':
        this.renderLoginPage();
        return;

      case 'signup':
        if (!this.isFormsEmpty()) {
          const name = (
            document.querySelector('input[type="text"]') as HTMLInputElement
          ).value;
          const email = (
            document.querySelector('input[type="email"]') as HTMLInputElement
          ).value;
          const password = (
            document.querySelector('input[type="password"]') as HTMLInputElement
          ).value;

          this.signUp(name, email, password);
        } else {
          console.log('Поля не заполнены');
        }
        return;

      case 'login':
        if (!this.isFormsEmpty()) {
          const email = (
            document.querySelector('input[type="email"]') as HTMLInputElement
          ).value;
          const password = (
            document.querySelector('input[type="password"]') as HTMLInputElement
          ).value;

          this.login(email, password);
        } else {
          console.log('Поля не заполнены');
        }
        return;
    }
  };

  renderLoginPage = (): void => {
    this.MAIN_WRAPPER.innerHTML = '';
    this.LOGIN_PAGE.innerHTML = `
        <div class="login-page__title">
            <h2>Авторизируйтесь</h2>
            <p>и используйте возможности RSLang на максимум!</p>
        </div>

        <input class="login-page__input" type="email" placeholder="Введите e-mail">

        <input class="login-page__input" type="password" placeholder="Введите пароль">

        <button class="login-page__button" data-login="login">ВОЙТИ</button>
        <p>Еще нет аккаунта? Самое время <a data-login="render-signup">создать</a>!</p>
        `;
    this.MAIN_WRAPPER.prepend(this.LOGIN_PAGE);
    appendFooter(this.MAIN_WRAPPER);
  };

  renderSignUpPage = (): void => {
    this.MAIN_WRAPPER.innerHTML = '';
    this.LOGIN_PAGE.innerHTML = `
            <div class="login-page__title">
                <h2>Зарегистрируйтесь</h2>
                <p>и используйте возможности RSLang на максимум!</p>
            </div>

            <input class="login-page__input" type="text" placeholder="Введите имя">
            <input class="login-page__input" type="email" placeholder="Введите e-mail">
            <input class="login-page__input" type="password" placeholder="Введите пароль">
            <button class="login-page__button" data-login="signup">СОЗДАТЬ АККАУНТ</button>
            <p>Уже есть аккаунт? Тогда стоит в него <a data-login="render-login">войти</a>!</p>
        `;
    this.MAIN_WRAPPER.prepend(this.LOGIN_PAGE);
    appendFooter(this.MAIN_WRAPPER);
  };

  signUp = async (name: string, email: string, password: string) => {
    await fetch('https://rss21q3-rslang.herokuapp.com/users', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
      }),
    })
      .then(() => this.login(email, password))
      .catch(() => {});
  };

  login = async (email: string, password: string) => {
    const res = await fetch('https://rss21q3-rslang.herokuapp.com/signin', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    const data = await res.json();
    console.log(data);
  };

  isFormsEmpty = (): boolean => {
    const pageForms = document.querySelectorAll('input');
    let result: boolean = false;
    for (let form of pageForms) {
      if (!form.value) result = true;
    }
    return result;
  };
}
