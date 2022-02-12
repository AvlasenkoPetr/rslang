import appendFooter from '../../Reusable-components/footer/footer';
import './main-page.scss';

export class MainPage {

  render(){
    const mainWrapper = document.querySelector('.main__wrapper') as HTMLElement;
    mainWrapper.innerHTML = ''
    const mainPage = document.createElement('main')
    mainPage.className = 'main-page page'
    mainPage.innerHTML = this.content()
    mainWrapper.append(mainPage)
    appendFooter(mainWrapper)
  }

  content() {
    return `
        <div class="main-page__title">
          <p>Добро пожаловать в</p>
          <h1><span>RS</span>Lang</h1>
          <p>лучшее место для изучения английского языка!</p>
        </div>
        <div class="main-page__features">
          <h3>Особенности нашего приложения</h3>
          <div class="main-page__cards">
            <div class="main-page__card">
              <div class="card-img__wrapper">
                <img src="./assets/images/mainPage/0.png" alt="" />
              </div>
              <h3 class="card__title">Запоминай</h3>
              <p class="card__text">
                Для лучшего запонимания сложных слов отмечай их и повторяй
                отдельно
              </p>
            </div>
            <div class="main-page__card">
              <div class="card-img__wrapper">
                <img src="./assets/images/mainPage/0.png" alt="" />
              </div>
              <h3 class="card__title">Запоминай</h3>
              <p class="card__text">
                Для лучшего запонимания сложных слов отмечай их и повторяй
                отдельно
              </p>
            </div>
            <div class="main-page__card">
              <div class="card-img__wrapper">
                <img src="./assets/images/mainPage/0.png" alt="" />
              </div>
              <h3 class="card__title">Запоминай</h3>
              <p class="card__text">
                Для лучшего запонимания сложных слов отмечай их и повторяй
                отдельно
              </p>
            </div>
            <div class="main-page__card">
              <div class="card-img__wrapper">
                <img src="./assets/images/mainPage/0.png" alt="" />
              </div>
              <h3 class="card__title">Запоминай</h3>
              <p class="card__text">
                Для лучшего запонимания сложных слов отмечай их и повторяй
                отдельно
              </p>
            </div>
          </div>
        </div>
    `
  }
}
