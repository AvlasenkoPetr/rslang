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

    }
}