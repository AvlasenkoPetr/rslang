import { setRandomNumber } from './utilities';
import { GamePage } from './gamePage';
import { IState, INewState, IWord, IAnswer } from './interfaces';
import { StartPage } from './startPage';
import './audioCall.scss'
import { Fetch } from '../../../Fetch/fetch';

const PAGES = 30
const ROUNDS_AMOUNT = 20
enum Actions {
  SET_GROUP_VALUE = 'SET-GROUP-VALUE',
  SET_DATA = 'SET-DATA',
  SET_NEXT_PAGE = 'SET-NEXT-PAGE',
  SHOW_ANSWER = 'SHOW-ANSWER',
  BACK_TO_START_PAGE = 'BACK_TO_START_PAGE',
  SET_ANSWERS = 'SET-ANSWERS',
  SET_WORD = 'SET-WORD',
  SET_DISABLED_BUTTONS = 'SET-DISABLED-BUTTONS',
  SET_FULL_SCREEN = 'SET-FULL-SCREEN'
}

class AudioCall {

  public state: IState = {
    data: null,
    group: '4',
    currentPage: 0,
    isAnswerHide: true,
    currentAnswers: [],
    words: [],
    disabledButtons: false,
    fullScreen: false
  }

  public startPage = new StartPage()
  public gamePage = new GamePage()

  _initStartPage() {
    this.startPage.render()
    const startGameButton = document.querySelector('#startAudioCallGame') as HTMLButtonElement
    const gameLevel = document.querySelector('#gameLevel') as HTMLSelectElement
    
    startGameButton.addEventListener('click', this.startGame.bind(this))
    gameLevel.addEventListener('change', this.setGroupValueActionCreator.bind(this))
  }

  async setFullScreen(e: Event) {
    const target = e.currentTarget as HTMLElement
    const audioCallMainElement = document.querySelector('#audioCallMainElement') as HTMLElement
    this.setFullScreenActionCreator()
    if(this.state.fullScreen){
      await audioCallMainElement.requestFullscreen()
      target.innerHTML = ' <img src="../../../../assets/images/audioCall/fullScreen1.svg">'
    }
    else{
      await document.exitFullscreen();
      target.innerHTML = ' <img src="../../../../assets/images/audioCall/fullScreen.svg">'
    }
  }

  _initGamePage() {
    const nextPageButton = document.querySelector('#nextPageButton') as HTMLButtonElement
    const dontKnowButton = document.querySelector('#dontKnowButton') as HTMLButtonElement
    const answersWrapper = document.querySelector('#answersWrapper') as HTMLElement
    const fullscreenButton = document.querySelector('#fullscreenButton') as HTMLButtonElement
    fullscreenButton.addEventListener('click', this.setFullScreen.bind(this))
    answersWrapper.addEventListener('click', this.handleClickShowAnswers.bind(this))
    nextPageButton.addEventListener('click', this.setNextPageActionCreator.bind(this))
    dontKnowButton.addEventListener('click', this.showAnswer.bind(this))
    this._initPlay()
  }

  showAnswer() {
    let newWord: IAnswer = {
      info: this.state.data![this.state.currentPage],
      isRight: 'false'
    }
    this.state.words.push(newWord)
    this.showAnswerActionCreator()
  }

  _initPlay() {
    const playAudioButton = document.querySelectorAll('.audioCall__audio-button') as NodeList
    playAudioButton.forEach(button => {
      (button as HTMLElement).addEventListener('click', this.playAudio.bind(this))
    })
  }

  playAudio(e: Event) {
    (((e.target as HTMLElement).closest('.audioCall__audio-button') as HTMLButtonElement).nextElementSibling as HTMLAudioElement).play()
  }

  handleClickShowAnswers(e: Event) {
    if (!this.state.disabledButtons) {
      const target = (e.target) as HTMLElement
      if (target.hasAttribute('isRight')) {
        if (target.getAttribute('isRight') === 'true') {
          target.classList.add('right-answer')
          this.setWordActionCreator(this.state.data![this.state.currentPage], 'true')
        }
        else if (target.getAttribute('isRight') === 'false') {
          target.classList.add('bad-answer')
          this.setWordActionCreator(this.state.data![this.state.currentPage], 'false');
          ((target.closest('.answers__wrapper') as HTMLElement).querySelector('[isRight="true"]')as HTMLElement).classList.add('right-answer')
        }
      }
    }
  }

  async startGame() {
    const page = '' + setRandomNumber(PAGES)
    const group = this.state.group
    const data: Array<IWord> = await new Fetch().GET_WORDS(group, page)
    this.gamePage.render()
    this.setDataActionCreator(data)
    this.gamePage.renderWords(this.state)
    this.setAnswers(data, this.state.currentPage)
    this._initGamePage()
  }

  setAnswers(data: Array<IWord>, currentPage: number) {
    const shuffleData = [...data].filter(item => item.id !== data[currentPage].id).sort(() => Math.random() - 0.5)
    const answersArray = [...shuffleData.slice(0, 3)]
    answersArray.push(data[currentPage])
    this.setAnswersActionCreator(answersArray)
    this.gamePage.renderAnswers(this.state.currentAnswers!, this.state.data![this.state.currentPage])
  }

  setFullScreenActionCreator(){
    const action: INewState = {
      type: Actions.SET_FULL_SCREEN
    }
    this.setState(action)
  }

  backToStartPageActionCreator() {
    const action: INewState = {
      type: Actions.BACK_TO_START_PAGE
    }
    this.setState(action)
    this._initStartPage()
  }

  setNextPageActionCreator() {
    const action: INewState = {
      type: Actions.SET_NEXT_PAGE,
      currentPage: this.state.currentPage += 1
    }
    if (this.state.currentPage < ROUNDS_AMOUNT) {
      this.setState(action)
      this.gamePage.renderWords(this.state)
      this.setAnswers(this.state.data!, this.state.currentPage)
      this.setDisabledButtons(false)
      this._initPlay()
    }
    else {

    }

  }

  setDataActionCreator(data: Array<IWord>) {
    const action: INewState = {
      type: Actions.SET_DATA,
      data: data.sort(() => Math.random() - 0.5)
    }
    this.setState(action)
  }

  setGroupValueActionCreator(e: Event) {
    const action: INewState = {
      type: Actions.SET_GROUP_VALUE,
      group: (e.target as HTMLSelectElement).value
    }
    this.setState(action)
  }

  showAnswerActionCreator() {
    const action: INewState = {
      type: Actions.SHOW_ANSWER,
    }
    this.setState(action)
    this.gamePage.renderWords(this.state)
    this._initPlay()
  }

  setAnswersActionCreator(data: Array<IWord>) {
    const action: INewState = {
      type: Actions.SET_ANSWERS,
      currentAnswers: data.sort(() => Math.random() - 0.5)
    }
    this.setState(action)
  }

  setWordActionCreator(word: IWord, isRight: string) {
    const action: INewState = {
      type: Actions.SET_WORD,
      word: {
        info: word,
        isRight: isRight
      }
    }
    this.setState(action)
    this.showAnswerActionCreator()
    this.setDisabledButtons(true)
  }

  setDisabledButtons(isDisabled: boolean) {
    const action: INewState = {
      type: Actions.SET_DISABLED_BUTTONS,
      disabledButtons: isDisabled
    }
    this.setState(action)
  }

  setState(newState: INewState) {
    switch (newState.type) {
      case Actions.SET_GROUP_VALUE:
        this.state = { ...this.state, group: newState.group! }
        break
      case Actions.SET_DATA:
        this.state = { ...this.state, data: newState.data! }
        break
      case Actions.SET_NEXT_PAGE:
        this.state = { ...this.state, currentPage: newState.currentPage!, isAnswerHide: true }
        break
      case Actions.SHOW_ANSWER:
        this.state = { ...this.state, isAnswerHide: false }
        break
      case Actions.BACK_TO_START_PAGE:
        this.state = { ...this.state, isAnswerHide: true, currentPage: 19, currentAnswers: [], words: [], disabledButtons: false }
        break
      case Actions.SET_ANSWERS:
        this.state = { ...this.state, currentAnswers: newState.currentAnswers }
        break
      case Actions.SET_WORD:
        this.state = { ...this.state, words: [...this.state.words, newState.word!] }
        break
      case Actions.SET_DISABLED_BUTTONS:
        this.state = { ...this.state, disabledButtons: newState.disabledButtons! }
        break
      case Actions.SET_FULL_SCREEN:
        this.state = { ...this.state, fullScreen: this.state.fullScreen ? false : true }
        break
    }
  }
}

export { AudioCall }