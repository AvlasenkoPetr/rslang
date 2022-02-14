export interface IData {
  url: string;
  method: string;
  body?: null | string;
  token: null | string;
}

export interface IUSER_BODY {
  name?: string;
  email: string;
  password: string;
}

export interface ICREATE_USER_WORD {
  difficulty: 'hard' | 'easy' | 'string';
  optional?: {
    name: string;
  };
}

export interface IUPDATE_STATISTICS {
  learnedWords: number;
  optional?: {};
}

export interface IUPDATE_SETTINGS {
  wordsPerDay: number;
  optional?: {};
}

export interface IUserInfo {
  token: string;
  userId: string;
}

export interface ISIGN_IN_RESPONSE {
  token: string;
  userId: string;
  message: string;
  name: string;
  refreshToken: string;
}

export interface IGET_AGGREGATED_WORDS {
  page?: string;
  group?: string;
  wordsPerPage?: string;
  filter?: string;
}

export interface IResult {
  group: string;
  points?: number;
  total: number;
  inRow: number;
  rightCount?: number;
  wrongCount?: number;
  answersArr: Array<IAnswer>;
}

export interface IWord {
  id: string;
  group: number;
  page: number;
  word: string;
  image: string;
  audio: string;
  audioMeaning: string;
  audioExample: string;
  textMeaning: string;
  textExample: string;
  transcription: string;
  textExampleTranslate: string;
  textMeaningTranslate: string;
  wordTranslate: string;
}

export interface IUserWord {
  id: string;
  wordId: string;
  difficulty: string;
  optional?: {};
}

export interface IState {
  data: null | Array<IWord>;
  group: string;
  currentPage: number;
  isAnswerHide: boolean;
  currentAnswers?: Array<IWord>;
  words: Array<IAnswer>;
  disabledButtons: boolean;
  fullScreen: boolean;
  inRow: number;
}

export interface INewState {
  type: string;
  group?: string;
  data?: Array<IWord>;
  currentPage?: number;
  isAnswerHide?: boolean;
  currentAnswers?: Array<IWord>;
  word?: IAnswer;
  disabledButtons?: boolean;
  fullScreen?: boolean;
  inRow?: number;
}

export interface IAnswer {
  info: IWord;
  isRight: string;
}
