import { appendFooter } from '../../footer/footer'
import './login-page.scss'

export class LoginPage {
    MAIN_WRAPPER: HTMLElement | null
    
    constructor() {
        this.MAIN_WRAPPER = document.querySelector('.main__wrapper')
    }

    render() {
        if (!this.MAIN_WRAPPER) return
        this.MAIN_WRAPPER.innerHTML = ''

        const loginPage: HTMLElement = document.createElement('main')
        loginPage.className = 'login-page'
        loginPage.innerHTML = `
        <div class="login-page__title">
        <p>Добро пожаловать в</p>
        <h1><span>RS</span>Lang</h1>
        <p>лучшее место для изучения английского языка!</p>
        </div>

        <input type="email" placeholder="Введите e-mail">

        <input type="password" placeholder="Введите пароль">

        <button class="login-page__button">ВОЙТИ</button>
        <p>Еще нет аккаунта? Самое время <a>создать</a>!</p>
        <button class="login-page__button light">Продолжить как гость</button>
        `
        // вешаем листенеры на логин пейдж
        this.MAIN_WRAPPER.append(loginPage)
        appendFooter(this.MAIN_WRAPPER)
    }
}