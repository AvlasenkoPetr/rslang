import { Fetch } from '../../Fetch/fetch'
import { IData, IUSER_BODY } from '../../Interfaces/interfaces'
import appendFooter from '../../footer/footer'
import './login-page.scss'
import { getUserInfo } from '../../Helpers/helpers'

export class LoginPage {
    MAIN_WRAPPER: HTMLElement
    LOGIN_PAGE: HTMLElement
    FETCH

    constructor() {
        this.MAIN_WRAPPER = document.querySelector('.main__wrapper') as HTMLElement

        this.LOGIN_PAGE = document.createElement('main')
        this.LOGIN_PAGE.className = 'login-page page'
        this.LOGIN_PAGE.addEventListener('click', this.processClick)
        
        this.FETCH = new Fetch
    }

    processClick = async (e: MouseEvent) => {
        if (!(e.target instanceof HTMLElement)) return
    
        const clickedButton: HTMLElement = e.target
        if (!clickedButton.dataset.login) return
 
        const clickedButtonDataset: string = clickedButton.dataset.login

        switch (clickedButtonDataset) {
            case 'render-signup':
                this.renderSignUpPage()
                return

            case 'render-login':
                this.renderLoginPage()
                return

            case 'signup':
                if (!this.isFormsEmpty()) {
                    const name = (document.querySelector('input[type="text"]') as HTMLInputElement).value
                    const email = (document.querySelector('input[type="email"]') as HTMLInputElement).value
                    const password = (document.querySelector('input[type="password"]') as HTMLInputElement).value

                    this.signUp(name, email, password)

                } else {
                    this.dropError()
                }
                return
      
            case 'login':
                if (!this.isFormsEmpty()) {
                    const email = (document.querySelector('input[type="email"]') as HTMLInputElement).value
                    const password = (document.querySelector('input[type="password"]') as HTMLInputElement).value

                    this.login(email, password)

                } else {
                    this.dropError()
                }
                return
      
        }
        return;
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

        <div class="login-page__button_wrapper">
            <button class="login-page__button" data-login="login">ВОЙТИ</button>
            <p>Еще нет аккаунта? Самое время <a data-login="render-signup">создать</a>!</p>
        </div>
        `
        this.MAIN_WRAPPER.prepend(this.LOGIN_PAGE)
        appendFooter(this.MAIN_WRAPPER)
    }

    renderSignUpPage = (): void => {
        this.MAIN_WRAPPER.innerHTML = ''
        this.LOGIN_PAGE.innerHTML = `
            <div class="login-page__title">
                <h2>Зарегистрируйтесь</h2>
                <p>и используйте возможности RSLang на максимум!</p>
            </div>

            <input class="login-page__input" type="text" placeholder="Введите имя">
            <input class="login-page__input" type="email" placeholder="Введите e-mail" autocomplete="off">
            <input class="login-page__input" type="password" placeholder="Введите пароль" autocomplete="off">
            <div class="login-page__button_wrapper">
                <button class="login-page__button" data-login="signup">СОЗДАТЬ АККАУНТ</button>
                <p>Уже есть аккаунт? Тогда стоит в него <a data-login="render-login">войти</a>!</p>
            </div>
        `
        this.MAIN_WRAPPER.prepend(this.LOGIN_PAGE)
        appendFooter(this.MAIN_WRAPPER)
    }

    signUp = async(name: string, email: string, password: string) => {
        const createUserBody: IUSER_BODY = {
            name: name,
            email: email,
            password: password
        }

        await this.FETCH.CREATE_USER(createUserBody)
        .then(() => this.login(email, password))
        .catch((error) => this.dropError(error.status));
    }

    login = async(email: string, password: string) => {
        const signInBody: IUSER_BODY = {
            email: email,
            password: password  
        }

        await this.FETCH.SIGN_IN(signInBody)
        .then((res) => localStorage.setItem('UserInfo', JSON.stringify(res)))
        .then(() => this.redirectToMain())
        .catch((error) => this.dropError(error.status));
        
    }

    redirectToMain = () => {
        const loginNavButton: HTMLElement | null = document.querySelector('.active')
        if (loginNavButton) {
            loginNavButton.dataset.navigation = 'logout'
            loginNavButton.innerHTML = 'Выйти'
        }
    }

    isFormsEmpty = (): boolean => {
        const pageForms = document.querySelectorAll('input')
        let result: boolean = false
        for (let form of pageForms) {
            if (!form.value) result = true
        }
        return result
    }

    dropError = (errorStatus?: number) => {
        const oldError: HTMLElement | null = document.querySelector('.error')
        if (oldError) oldError.remove()

        const error: HTMLElement = document.createElement('p')
        error.className = 'error'

        switch(errorStatus) {
            case 403: error.innerHTML = 'Неправильный пароль!'
                break;

            case 404: error.innerHTML = 'Такого пользователя нет!'
                break;

            case 417: error.innerHTML = 'Эта почта уже зарегистрирована!'
                break;
            
            default: error.innerHTML = 'Нужно заполнить все поля!'
                break;
        }

        const buttonWrapper: HTMLElement | null = document.querySelector('.login-page__button_wrapper')
        if (!buttonWrapper) return
        buttonWrapper.prepend(error)

        setTimeout(() => error.remove(), 5000)
    }
}
