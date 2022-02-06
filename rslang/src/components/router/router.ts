import './router.scss'

export class Router {
  NAV_BLOCK: HTMLElement | null
  MAIN_WRAPPER: HTMLElement | null

  constructor() {
    this.NAV_BLOCK = document.querySelector('.aside'),
    this.MAIN_WRAPPER = document.querySelector('.main__wrapper')
  }

  setListener(): void {
    if (!this.NAV_BLOCK) return

    this.NAV_BLOCK.addEventListener('click', this.renderPage)
  }

  renderPage = (e: MouseEvent): void => {
    if (!(e.target instanceof HTMLElement)) return
    if (!this.NAV_BLOCK || !this.MAIN_WRAPPER) return

    const clickedButton: HTMLElement = e.target

    if (clickedButton.dataset.navigation === 'open') {
      this.NAV_BLOCK.classList.toggle('opened')
      return
    }
    // Работает через дата-атрибуты детей эл-та aside
    // прим.: кнопка для переклчения на страницу книги имеет атрибут 'book', т.е.
    // пишем: case 'book': ${метод рендера у класса страницы книги} return

    switch (clickedButton.dataset.navigation) {
      case 'book': // ф-ция рендера
        return
    }
  }
}