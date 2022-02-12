import { Fetch } from "../../Fetch/fetch"
import { isUserExists } from "../../Helpers/helpers"
import appendFooter from "../../Reusable-components/footer/footer"
import './book-page.scss'

export class BookPage {
  MAIN_WRAPPER: HTMLElement
  BOOK_PAGE: HTMLElement
  WORDS_CONTAINER: HTMLElement
  LEVEL: number
  FETCH

  constructor(level: number) {
      this.MAIN_WRAPPER = document.querySelector('.main__wrapper') as HTMLElement
      
      this.BOOK_PAGE = document.createElement('main')
      this.BOOK_PAGE.className = 'book-page page'
      this.BOOK_PAGE.addEventListener('click', this.processClick)

      this.WORDS_CONTAINER = document.createElement('div')
      this.WORDS_CONTAINER.className = ''
      
      this.LEVEL = level

      this.FETCH = new Fetch
  }

  processClick = async (e: MouseEvent) => {
    if (!(e.target instanceof HTMLElement)) return
    
    const clickedButton: HTMLElement = e.target
    if (!clickedButton.dataset.book) return

    const clickedButtonDataset: string = clickedButton.dataset.book
  }

  renderBookPage = async () => {
    this.MAIN_WRAPPER.innerHTML = ''
    this.BOOK_PAGE.innerHTML = `
    ${this.bookMenuContent()}
    `

    this.MAIN_WRAPPER.append(this.BOOK_PAGE)
    appendFooter(this.MAIN_WRAPPER)

    const currentLevelButton: HTMLElement | null = document.querySelector(`[data-book="${this.LEVEL}"]`)
    currentLevelButton?.classList.add('active')
  }

  bookMenuContent = (): string => {
    return `
    <h2>Электронный учебник</h2>

    <div class="book-page__games-menu">
      <button class="book-page__games-menu_button">Audiocall</button>
      <button class="book-page__games-menu_button">Sprint</button>
    </div>

    <div class="book-page__menu-row">

      <div class="book-page__pagination-container">
        <button class="book-page__pagination-container_button" data-book="prev"></button>
        <div class="book-page__pagination-container_counter">1</div>
        <button class="book-page__pagination-container_button" data-book="next"></button>
      </div>

      <div class="book-page__level-container">
        <button class="book-page__level-container_button" data-book="0">A1</button>
        <button class="book-page__level-container_button" data-book="1">A2</button>
        <button class="book-page__level-container_button" data-book="2">B1</button>
        <button class="book-page__level-container_button" data-book="3">B2</button>
        <button class="book-page__level-container_button" data-book="4">C1</button>
        <button class="book-page__level-container_button" data-book="5">C2</button>
        ${isUserExists() ? '<button class="book-page__level-container_button" data-book="6">H</button>' : ''}
      </div>

    </div>
    `
  }
}