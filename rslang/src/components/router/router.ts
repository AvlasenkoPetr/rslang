import { LoginPage } from '../pages/login-page/login-page'
import './router.scss'

export class Router {
  NAV_BLOCK: HTMLElement

  constructor() {
    this.NAV_BLOCK = document.querySelector('.aside') as HTMLElement
  }

  setListener(): void {
    window.addEventListener('click', this.processClick)
  }

  processClick = (e: MouseEvent): void => {
    if (!(e.target instanceof HTMLElement)) return
    
    const clickedButton: HTMLElement = e.target
    if (!clickedButton.dataset.navigation) return

    const clickedDataset: string = clickedButton.dataset.navigation

    if (clickedDataset === 'open') {
      this.openMenu()
      return
    }

    // вынести в отдельную ф-цию (снимаем класс эктив в нав блоке)
    const currentlyActiveButton: HTMLElement | null = this.NAV_BLOCK.querySelector('.active')
    if (currentlyActiveButton) {
      if (currentlyActiveButton.dataset.navigation === clickedDataset) return
      currentlyActiveButton.classList.remove('active')
    }
    
    // вынести в отдельную ф-цию (разбираемся был ли клик в нав блоке и вешаем класс эктив на нужную кнопку)
    if (clickedButton.closest('aside')) {
      clickedButton.classList.add('active')
    } else {
      const navClickedButton: HTMLElement | null = this.NAV_BLOCK.querySelector(`[data-navigation=${clickedDataset}]`)
      navClickedButton?.classList.add('active')
    }

    // Работает через дата-атрибуты
    // прим.: кнопка для переклчения на страницу книги имеет атрибут data-navigation='book', т.е.
    // пишем: case 'book': ${метод рендера у класса страницы книги} return

    switch (clickedDataset) {
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

  openMenu = (): void => {
    this.NAV_BLOCK.classList.toggle('opened')
    this.NAV_BLOCK.querySelector('.button-open')?.classList.toggle('opened')
  }
}