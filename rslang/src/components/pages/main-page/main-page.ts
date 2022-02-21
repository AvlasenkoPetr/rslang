import appendFooter from '../../Reusable-components/footer/footer';
import { Router } from '../../router/router';
import './main-page.scss';

export class MainPage {
  MAIN_WRAPPER: HTMLElement
  MAIN_PAGE: HTMLElement

  constructor() {
    this.MAIN_WRAPPER = document.querySelector('.main__wrapper') as HTMLElement

    this.MAIN_PAGE = document.createElement('main')
    this.MAIN_PAGE.className = 'main-page page'
  }
 
  renderMainPage (){
    this.MAIN_WRAPPER.innerHTML = ''

    this.MAIN_PAGE.innerHTML = this.content()
    this.MAIN_WRAPPER.append(this.MAIN_PAGE)
    appendFooter(this.MAIN_WRAPPER)

    this.MAIN_PAGE.addEventListener('click', this.processClick)
  }
  
  processClick = (e: MouseEvent) => {
    if (!(e.target instanceof HTMLElement)) return
    
    const clickedButton: HTMLElement = e.target

    if (!clickedButton.closest('[data-main]' || !clickedButton.dataset.main)) return
    
    let clickedButtonDataset: string

    if (clickedButton.dataset.main) {
      clickedButtonDataset = clickedButton.dataset.main
    } else {
      const closestDataset: HTMLElement = clickedButton.closest('[data-main]') as HTMLElement
      clickedButtonDataset = closestDataset.dataset.main || 'main'
    }
    
    const router = new Router
    router.renderPage(clickedButtonDataset)
  }

  content() {
    return `
        <div class="main-page__title">
          <p>Добро пожаловать в</p>
          <h1><span>RS</span>Lang</h1>
          <p>лучшее место для изучения английского языка!</p>
        </div>
        <div class="main-page__cards">
          <div class="main-page__card" data-main="book">
            <div class="card-img__wrapper">
              <img src="./assets/images/mainPage/0.png" alt="" />
            </div>
            <h3 class="card__title">Изучай</h3>
            <p class="card__text">
              В вашем распоряжении коллеция, содержащая 3600 
              часто употребляемых английских слов.
            </p>
          </div>
          <div class="main-page__card" data-main="book-hard">
            <div class="card-img__wrapper">
              <img src="./assets/images/mainPage/1.png" alt="" />
            </div>
            <h3 class="card__title">Запоминай</h3>
            <p class="card__text">
              Для лучшего запонимания сложных слов отмечай их и повторяй
              отдельно
            </p>
          </div>
          <div class="main-page__card" data-main="games">
            <div class="card-img__wrapper">
              <img src="./assets/images/mainPage/2.png" alt="" />
            </div>
            <h3 class="card__title">Играй</h3>
            <p class="card__text">
              Упражняйся, играя в наши мини-игры и делись результатами с друзьями
            </p>
          </div>
          <div class="main-page__card" data-main="stats">
            <div class="card-img__wrapper">
              <img src="./assets/images/mainPage/3.png" alt="" />
            </div>
            <h3 class="card__title">Анализируй</h3>
            <p class="card__text">
              Подробная статистика твоих достижений, изученных слов и ошибок
            </p>
          </div>
        </div>
        
    `
  }
}