import { Fetch } from "../../Fetch/fetch"
import { isUserExists } from "../../Helpers/helpers"
import { IWord } from "../../Interfaces/interfaces"
import appendFooter from "../../Reusable-components/footer/footer"
import './book-page.scss'

export class BookPage {
  MAIN_WRAPPER: HTMLElement
  BOOK_PAGE: HTMLElement
  WORDS_CONTAINER: HTMLElement
  LEVEL: string
  LEVEL_NAMES: Array<string>
  FETCH

  constructor(level: string) {
      this.MAIN_WRAPPER = document.querySelector('.main__wrapper') as HTMLElement
      
      this.BOOK_PAGE = document.createElement('main')
      this.BOOK_PAGE.className = 'book-page page'
      this.BOOK_PAGE.addEventListener('click', this.processClick)

      this.WORDS_CONTAINER = document.createElement('div')
      this.WORDS_CONTAINER.className = 'words-container'
      
      this.LEVEL = level
      this.LEVEL_NAMES = ['a1', 'a2', 'b1', 'b2', 'c1', 'c2', 'hard']

      this.FETCH = new Fetch
  }

  processClick = async (e: MouseEvent): Promise<void> => {
    if (!(e.target instanceof HTMLElement)) return
    
    const clickedButton: HTMLElement = e.target
    if (!clickedButton.dataset.book || clickedButton.classList.contains('disabled')) return

    const clickedButtonDataset: string = clickedButton.dataset.book

    switch(clickedButtonDataset) {
      case 'prev':
        this.toPrevPage(clickedButton)
        return
        
      case 'next':
        this.toNextPage(clickedButton)
        return

      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
        if (clickedButton.classList.contains('active')) return
        
        const pageCounter: HTMLInputElement = document.getElementById('counter') as HTMLInputElement
        pageCounter.value = '1'

        this.LEVEL = clickedButtonDataset
        this.setActiveLevel()
        this.renderWordsContainer()
        return
    }
  }

  renderBookPage = async () => {
    this.MAIN_WRAPPER.innerHTML = ''

    this.BOOK_PAGE.innerHTML = this.bookMenuContent()
    this.MAIN_WRAPPER.append(this.BOOK_PAGE)
    
    await this.renderWordsContainer()
    this.BOOK_PAGE.append(this.WORDS_CONTAINER)

    appendFooter(this.BOOK_PAGE)

    this.setActiveLevel()
  }

  renderWordsContainer = async () => {
    this.WORDS_CONTAINER.innerHTML = ''

    const pageCounter: HTMLInputElement = document.getElementById('counter') as HTMLInputElement
    const pageNum: string = String( Number(pageCounter.value) - 1 )

    const wordsData: Array<IWord> = await this.FETCH.GET_WORDS( this.LEVEL, pageNum)
    console.log(wordsData);
    
    for (let word of wordsData) {
      const wordItem: HTMLElement = document.createElement('div')
      wordItem.className = `words-container__item ${this.LEVEL_NAMES[ Number(this.LEVEL) ]}`
      wordItem.innerHTML = `
      <div class="words-container__item_image-block">
        <img src="https://rss21q3-rslang.herokuapp.com/${word.image}">
      </div>

      <div class="words-container__item_info-block">
        <div class="info-block_title">
          ${word.word[0].toUpperCase()}${word.word.slice(1)} - ${word.transcription} - ${word.wordTranslate}
        </div>

        <div class="info-block_description">
          ${word.textMeaning}<br>${word.textMeaningTranslate}
        </div>

        <div class="info-block_description">
          ${word.textExample}<br>${word.textExampleTranslate}
        </div>
      </div>

      <div class="words-container__item_controlls-block">

      </div>
      ` 
      this.WORDS_CONTAINER.append(wordItem)      
    }
  }

  toNextPage(button: HTMLElement) {
    const pageCounter = button.previousElementSibling as HTMLInputElement
    if (pageCounter.value === '30') return
    pageCounter.stepUp()
    this.renderWordsContainer()
  }

  toPrevPage(button: HTMLElement) {
    const pageCounter = button.nextElementSibling as HTMLInputElement
    if (pageCounter.value === '1') return
    pageCounter.stepDown()
    this.renderWordsContainer()
  }

  setActiveLevel = (): void => {
    const currentLevelButton: HTMLElement | null = document.querySelector(`[data-book="${this.LEVEL}"]`)
    const activeLevelButton = currentLevelButton?.parentElement?.querySelector('.active')
    if (activeLevelButton) {
      activeLevelButton.classList.remove('active')
    }
    currentLevelButton?.classList.add('active')
  }

  bookMenuContent = (): string => {
    return ` 
    <div class="book-page__menu-wrapper">
      <h2>Электронный учебник</h2>

      <div class="book-page__games-menu">
        <button class="book-page__games-menu_button">Audiocall</button>
        <button class="book-page__games-menu_button">Sprint</button>
      </div>

      <div class="book-page__menu-row">

        ${this.paginationBlockContent()}

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
    </div>
    `
  }

  paginationBlockContent = (): string => {
    return `
    <div class="book-page__pagination-container">
      <button class="book-page__pagination-container_button" data-book="prev"></button>
      <input type="number" min="1" max="30" value="1" class="book-page__pagination-container_counter" id="counter" readonly></input>
      <button class="book-page__pagination-container_button" data-book="next"></button>
    </div>
    `
  }
}