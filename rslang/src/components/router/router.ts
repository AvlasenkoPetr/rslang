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

    switch (clickedButton.dataset.navigation) {
      case 'open': this.NAV_BLOCK.classList.toggle('opened')
        return

      case 'book': 
        return
    }
  }
}