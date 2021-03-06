import { Fetch } from '../../Fetch/fetch'
import { IData, IUSER_BODY } from '../../Interfaces/interfaces'
import appendFooter from '../../Reusable-components/footer/footer'

import './login-page.scss'
import { checkStatsDay, getUserInfo, isUserExists, makeEmptyStats } from '../../Helpers/helpers'
import { Router } from '../../router/router'

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
                    if(this.validateEmail(email)){
                      if(this.validatePassword(password)){
                        this.signUp(name, email, password)
                      }
                    }else{
                      this.dropError(464)
                    }
                } else {
                    this.dropError()
                }
                return
      
            case 'login':
                if (!this.isFormsEmpty()) {
                    const email = (document.querySelector('input[type="email"]') as HTMLInputElement).value
                    const password = (document.querySelector('input[type="password"]') as HTMLInputElement).value
                    if(this.validateEmail(email)){
                      if(this.validatePassword(password)){
                        this.login(email, password)
                      }
                    }else{
                      this.dropError(464)
                    }
                   
                } else {
                    this.dropError()
                }
                return
      
        }
        return;
  };
  
  validateEmail = (email: string) =>{
    var re = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    return re.test(String(email).toLowerCase());
  }

  validatePassword = (password: string) =>{
    const beginWithoutDigit = /^\D.*$/
    const withoutSpecialChars = /^[^-()=+/]*$/
    const minimum8Chars = /^.{8,}$/
    const withoutSpaces = /\s/
    if(beginWithoutDigit.test(password)) {
      if(withoutSpecialChars.test(password)) {
        if(minimum8Chars.test(password)) {
          if(!withoutSpaces.test(password)) {
            return true
          }else{
            this.dropError(463)
            return false
          }
        }else{
          this.dropError(462)
          return false
        }
      }else{
        this.dropError(461)
        return false
      }
    }else{
      this.dropError(460)
      return false
    }
  }


  renderLoginPage = (): void => {
    this.MAIN_WRAPPER.innerHTML = '';
    this.LOGIN_PAGE.innerHTML = `
        <div class="login-page__title">
            <h2>??????????????????????????????</h2>
            <p>?? ?????????????????????? ?????????????????????? RSLang ???? ????????????????!</p>
        </div>

        <input class="login-page__input" type="email" placeholder="?????????????? e-mail">

        <input class="login-page__input" type="password" placeholder="?????????????? ????????????">

        <div class="login-page__button_wrapper">
            <button class="login-page__button" data-login="login">??????????</button>
            <p>?????? ?????? ????????????????? ?????????? ?????????? <a data-login="render-signup">??????????????</a>!</p>
        </div>
        `
        this.MAIN_WRAPPER.prepend(this.LOGIN_PAGE)
        appendFooter(this.MAIN_WRAPPER)
    }

    renderSignUpPage = (): void => {
        this.MAIN_WRAPPER.innerHTML = ''
        this.LOGIN_PAGE.innerHTML = `
            <div class="login-page__title">
                <h2>??????????????????????????????????</h2>
                <p>?? ?????????????????????? ?????????????????????? RSLang ???? ????????????????!</p>
            </div>

            <input class="login-page__input" type="text" placeholder="?????????????? ??????">
            <input class="login-page__input" type="email" placeholder="?????????????? e-mail" autocomplete="off">
            <input class="login-page__input" type="password" placeholder="?????????????? ????????????" autocomplete="off">
            <div class="login-page__button_wrapper">
                <button class="login-page__button" data-login="signup">?????????????? ??????????????</button>
                <p>?????? ???????? ??????????????? ?????????? ?????????? ?? ???????? <a data-login="render-login">??????????</a>!</p>
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
        try {
            await this.FETCH.CREATE_USER(createUserBody)
            await this.login(email, password)
        } catch(error: any) {
            this.dropError(error.status)
        }
    }

    login = async(email: string, password: string) => {
        const signInBody: IUSER_BODY = {
            email: email,
            password: password  
        }

        try {
            const res = await this.FETCH.SIGN_IN(signInBody)
            localStorage.setItem('UserInfo', JSON.stringify(res))
            await checkStatsDay()
            this.redirectToMain()
        } catch(err: any) {
            this.dropError(err.status)
        }
    }

    redirectToMain = () => {
        const loginNavButton: HTMLElement | null = document.querySelector('[data-navigation="login"]')
        if (loginNavButton) {
            loginNavButton.dataset.navigation = 'logout'
            loginNavButton.innerHTML = '??????????'
            loginNavButton.classList.remove('active')

            document.querySelector('[data-navigation="main"]')?.classList.add('active')
            const router = new Router
            router.renderPage()
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
            case 403: error.innerHTML = '???????????????????????? ????????????!'
                break;

            case 404: error.innerHTML = '???????????? ???????????????????????? ??????!'
                break;

            case 417: error.innerHTML = '?????? ?????????? ?????? ????????????????????????????????!'
                break;

            case 460: error.innerHTML = '???????????? ???????????????? ???????????? ?? ??????????!'
                break;

            case 461: error.innerHTML = '?????????????????????? ??????????, ?????????? ?? ???????????? ??????????????????????????!'
                break;

            case 462: error.innerHTML = '?????????????????????? ?????????? 8 ????????????????!'
                break;

            case 463: error.innerHTML = '???????????? ???????????????????????? ??????????????!'
                break;

            case 464: error.innerHTML = '?????????????????????? email!'
                break;
            
            default: error.innerHTML = '?????????? ?????????????????? ?????? ????????!'
                break;
        }

        const buttonWrapper: HTMLElement | null = document.querySelector('.login-page__button_wrapper')
        if (!buttonWrapper) return
        buttonWrapper.prepend(error)

        setTimeout(() => error.remove(), 5000)
    }
}

// ?????????????????? ?????????????? ?????? ?????????????????? ?????????????????????????? ??????????
window.addEventListener('load', () => {
    if (isUserExists()) {
      const logoutButton = document.querySelector('[data-navigation="login"]') as HTMLElement
      logoutButton.dataset.navigation = 'logout'
      logoutButton.innerHTML = '??????????'
    }
})