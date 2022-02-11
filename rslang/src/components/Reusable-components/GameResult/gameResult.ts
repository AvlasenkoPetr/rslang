import { IResult } from './../../Interfaces/interfaces';
import './gameResult.scss'

class GameResult{
  private points
  private total
  private inRow
  private correctAnswers
  private correctAnswersCounter
  private wrongAnswers
  private wrongAnswersCounter
  private accuracy
  constructor(data: IResult){
    if(data.points) this.points = data.points
    this.total = data.total
    this.inRow = data.inRow
    this.correctAnswers = data.answersArr.filter(item => item.isRight === true)
    this.correctAnswersCounter = this.correctAnswers.length
    this.wrongAnswers = data.answersArr.filter(item => item.isRight === false)
    this.wrongAnswersCounter = this.wrongAnswers.length
    this.accuracy = Math.round(this.correctAnswersCounter / +this.total * 100)
    document.body.style.setProperty('--p', `${this.accuracy}`)
  }

  _initButtons(){
    const modal = document.querySelector('#gameResultModalWindow') as HTMLElement
    const modalResults = document.querySelector('#modalResults') as HTMLElement
    const closeWindowBtn = document.querySelector('#closeWindowBtn') as HTMLElement
    const restartGame = document.querySelector('#restartGame') as HTMLElement
    modalResults.addEventListener('click', (e) => {
        const audio = (e.target as HTMLElement).closest('button') as HTMLElement
        if(audio){
          (audio.nextElementSibling as HTMLAudioElement).play()
        }
    })
    closeWindowBtn.addEventListener('click', () => modal.remove())
    restartGame.addEventListener('click', () => modal.remove())
  }

  render(){
    const modal:HTMLElement = document.createElement('div')
    modal.className = 'gameResult-modalWindow'
    modal.id = 'gameResultModalWindow'
    modal.innerHTML = this.content()
    document.body.append(modal)
    this._initButtons()
  }

  content(){
    return `
      <div id="modalContent" class="modal__content">
        <div class="close-window-button__wrapper">
          <button id="closeWindowBtn" class="close-window-button">
            <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.3477 10.7673L19.5075 3.67044C19.821 3.35893 19.9972 2.93644 19.9972 2.4959C19.9972 2.05536 19.821 1.63286 19.5075 1.32135C19.1939 1.00984 18.7687 0.834839 18.3253 0.834839C17.8819 0.834839 17.4566 1.00984 17.1431 1.32135L10 8.4348L2.8569 1.32135C2.54337 1.00984 2.11812 0.834839 1.67471 0.834839C1.2313 0.834839 0.806058 1.00984 0.492521 1.32135C0.178985 1.63286 0.00284159 2.05536 0.00284159 2.4959C0.00284158 2.93644 0.178985 3.35893 0.492521 3.67044L7.65227 10.7673L0.492521 17.8643C0.336458 18.018 0.212588 18.201 0.128055 18.4026C0.0435221 18.6042 0 18.8204 0 19.0388C0 19.2572 0.0435221 19.4734 0.128055 19.675C0.212588 19.8766 0.336458 20.0596 0.492521 20.2133C0.64731 20.3684 0.831467 20.4915 1.03437 20.5755C1.23727 20.6594 1.4549 20.7027 1.67471 20.7027C1.89452 20.7027 2.11215 20.6594 2.31505 20.5755C2.51796 20.4915 2.70211 20.3684 2.8569 20.2133L10 13.0999L17.1431 20.2133C17.2979 20.3684 17.482 20.4915 17.6849 20.5755C17.8878 20.6594 18.1055 20.7027 18.3253 20.7027C18.5451 20.7027 18.7627 20.6594 18.9656 20.5755C19.1685 20.4915 19.3527 20.3684 19.5075 20.2133C19.6635 20.0596 19.7874 19.8766 19.8719 19.675C19.9565 19.4734 20 19.2572 20 19.0388C20 18.8204 19.9565 18.6042 19.8719 18.4026C19.7874 18.201 19.6635 18.018 19.5075 17.8643L12.3477 10.7673Z" fill="black"/>
            </svg>
          </button>
        </div>
        <div class="modal__container">
          <h3 class="modal__title">Результат</h3>
          <p class="points">${this.points ? `Вы набрали ${this.points} очков` : ''}</p>
          <div class="modal__accuracy">
            <div class="accuracy__diagram animate">${this.accuracy}%</div>
            <div class="accuracy__description">Ваша точность</div>
          </div>
          <div id="modalResults" class="modal__results">
            <p>
              Всего слов:
              <span id="totalResultCounter" class="total-result words-count"
                >${this.total}</span
              >
            </p>
            <p>
              Угадано слов подряд:
              <span id="guessedInRow" class="guessed-in-row words-count"
                >${this.inRow}</span
              >
            </p>
            <div class="answers__wrapper">
              <h4 class="">
                Правильные ответы:
                <span
                  id="correctAnswersCounter"
                  class="correct-answers words-count"
                  >${this.correctAnswersCounter}</span
                >
              </h4>
              <div class="answers__list">
              ${this.correctAnswers.map(item => {
                return `
                  <div class="answer">
                    <div class="answer-audio__wrapper">
                      <button class="audio__btn">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M8.75 13.7842L3.31975 10.2622H0V4.39214H3.31975L8.75 0.870117V13.7842ZM3.5 4.97387V9.68047L8.16667 12.7076V1.94668L3.5 4.97387ZM11.7997 2.49729C13.1571 3.66485 14 5.39827 14 7.32775C14 9.25782 13.1571 10.9912 11.8008 12.1582L11.3878 11.7426C12.6338 10.6913 13.4167 9.10051 13.4167 7.32717C13.4167 5.55383 12.6338 3.96304 11.3878 2.91172L11.7997 2.49729ZM10.0911 4.21663C10.9783 4.95449 11.5354 6.07567 11.5354 7.32717C11.5354 8.57866 10.9783 9.69984 10.0911 10.4377L9.67925 10.0233C10.4557 9.39929 10.9521 8.42134 10.9521 7.32834C10.9521 6.23475 10.4557 5.2568 9.67808 4.63223L10.0911 4.21663ZM2.91667 4.97915H0.583333V9.67518H2.91667V4.97915Z" fill="black"/>
                      </svg>
                      </button>
                      <audio src="https://rss21q3-rslang.herokuapp.com/${item.info.audio}"></audio>
                    </div>
                    <p><span class="word_en">${item.info.word}</span> - <span class="word_ru">${item.info.wordTranslate}</span></p>
                  </div>
                `
              }).join('')}
              </div>
            </div>
            <div class="answers__wrapper">
            <h4 class="">
            Неправильные ответы:
                <span
                  id="wrongAnswersCounter"
                  class="wrong-answers words-count"
                  >${this.wrongAnswersCounter}</span
                >
              </h4>
              <div class="answers__list">
              ${this.wrongAnswers.map(item => {
                return `
                  <div class="answer">
                    <div class="answer-audio__wrapper">
                      <button class="audio__btn">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M8.75 13.7842L3.31975 10.2622H0V4.39214H3.31975L8.75 0.870117V13.7842ZM3.5 4.97387V9.68047L8.16667 12.7076V1.94668L3.5 4.97387ZM11.7997 2.49729C13.1571 3.66485 14 5.39827 14 7.32775C14 9.25782 13.1571 10.9912 11.8008 12.1582L11.3878 11.7426C12.6338 10.6913 13.4167 9.10051 13.4167 7.32717C13.4167 5.55383 12.6338 3.96304 11.3878 2.91172L11.7997 2.49729ZM10.0911 4.21663C10.9783 4.95449 11.5354 6.07567 11.5354 7.32717C11.5354 8.57866 10.9783 9.69984 10.0911 10.4377L9.67925 10.0233C10.4557 9.39929 10.9521 8.42134 10.9521 7.32834C10.9521 6.23475 10.4557 5.2568 9.67808 4.63223L10.0911 4.21663ZM2.91667 4.97915H0.583333V9.67518H2.91667V4.97915Z" fill="black"/>
                      </svg>
                      </button>
                      <audio src="https://rss21q3-rslang.herokuapp.com/${item.info.audio}"></audio>
                    </div>
                    <p><span class="word_en">${item.info.word}</span> - <span class="word_ru">${item.info.wordTranslate}</span></p>
                  </div>
                `
              }).join('')}
              </div>
            </div>
          </div>
          <div class="restart-game-btn__wrapper">
            <button id="restartGame" class="restart-game">Начать заново</button>
          </div>
        </div>
      </div>
    `
  }
}

export { GameResult }