import { LoginPage } from '../pages/login-page/login-page'
import './router.scss'

export class Router {
  NAV_BLOCK: HTMLElement | null

  constructor() {
    this.NAV_BLOCK = document.querySelector('.aside')
  }

  setListener(): void {
    if (!this.NAV_BLOCK) return

    this.NAV_BLOCK.addEventListener('click', this.renderPage)
  }

  renderPage = (e: MouseEvent): void => {
    if (!(e.target instanceof HTMLElement)) return
    if (!this.NAV_BLOCK) return

    const clickedButton: HTMLElement = e.target

    if (clickedButton.dataset.navigation === 'open') {
      this.NAV_BLOCK.classList.toggle('opened')
      return
    }

    const currentlyActiveButton: HTMLElement | null = this.NAV_BLOCK.querySelector('.active')
    if (currentlyActiveButton) {
      if (currentlyActiveButton.dataset.navigation === e.target.dataset.navigation) return
      currentlyActiveButton.classList.remove('active')
    }
    
    clickedButton.classList.add('active')

    // Работает через дата-атрибуты детей эл-та aside
    // прим.: кнопка для переклчения на страницу книги имеет атрибут data-navigation='book', т.е.
    // пишем: case 'book': ${метод рендера у класса страницы книги} return

    switch (clickedButton.dataset.navigation) {
      case 'main':  // ф-ция рендера
        return

      case 'book':
        return

      case 'games':
        return

      case 'stats':
        return

      case 'team':
        return

      case 'login':
        const loginPage = new LoginPage
        loginPage.render()
        return
    }
  }
}