import { Fetch } from "../../Fetch/fetch"


export class BookPage {
  MAIN_WRAPPER: HTMLElement
  BOOK_PAGE: HTMLElement
  FETCH

  constructor() {
      this.MAIN_WRAPPER = document.querySelector('.main__wrapper') as HTMLElement

      this.BOOK_PAGE = document.createElement('main')
      this.BOOK_PAGE.className = 'login-page page'
      this.BOOK_PAGE.addEventListener('click', this.processClick)
      
      this.FETCH = new Fetch
  }

  processClick = async (e: MouseEvent) => {
    if (!(e.target instanceof HTMLElement)) return
    
    const clickedButton: HTMLElement = e.target
    if (!clickedButton.dataset.book) return

    const clickedButtonDataset: string = clickedButton.dataset.book
  }

  renderBookPage = () => {
    
  }
}