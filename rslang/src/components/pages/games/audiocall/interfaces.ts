export interface IState {
  data: null | Array<IWord>,
  group: string,
  currentPage: number,
  isAnswerHide: boolean,
  currentAnswers?: Array<IWord>,
  words: Array<IAnswer>,
  disabledButtons: boolean,
  fullScreen:boolean
}

export interface INewState {
  type: string,
  group?: string,
  data?: Array<IWord>,
  currentPage?: number,
  isAnswerHide?: boolean,
  currentAnswers?: Array<IWord>,
  word?: IAnswer,
  disabledButtons?: boolean,
  fullScreen?:boolean
}

export interface IAnswer {
  info: IWord,
  isRight: string
}

export interface IWord {
  id: string,
  group: number,
  page: number,
  word: string,
  image: string,
  audio: string,
  audioMeaning: string,
  audioExample: string,
  textMeaning: string,
  textExample: string,
  transcription: string,
  textExampleTranslate: string,
  textMeaningTranslate: string,
  wordTranslate: string
}