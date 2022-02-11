export interface IData {
  url: string,
  method: string,
  body?: null | string,
  token: null | string
}

export interface IUSER_BODY {
  name?: string,
  email: string,
  password: string
}

export  interface ICREATE_USER_WORD {
  difficulty: 'hard' | 'easy',
  optional?: {
    name: string,
    
  }
}

export interface IUPDATE_STATISTICS {
  learnedWords: number,
  optional?: {
  }
}

export interface IUPDATE_SETTINGS {
  wordsPerDay: number,
  optional?: {
  }
}

export interface IUserInfo {
  token: string,
  userId: string
}

export interface ISIGN_IN_RESPONSE {
  token: string,
  userId: string,
  message:string,
  name: string,
  refreshToken: string
}

export interface IGET_AGGREGATED_WORDS {
 page?: string,
 group?:string,
 wordsPerPage?:string,
 filter?:string
}

export interface IResult{
  points?:number | string,
  total: number | string,
  inRow: number | string,
  answersArr: Array<IAnswersArr>
}

export interface IAnswersArr{
  info: IWord,
  isRight: boolean
}

interface IWord {
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