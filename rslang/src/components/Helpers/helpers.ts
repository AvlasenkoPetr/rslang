import { Fetch } from '../Fetch/fetch';
import { BookPage } from '../pages/book-page/book-page';
import { IStatisticResponse, IUserInfo } from './../Interfaces/interfaces';


export const getUserInfo = (): IUserInfo => {
  let userInfo: IUserInfo
  if (localStorage.getItem('UserInfo') !== null) {
    userInfo = JSON.parse(localStorage.getItem('UserInfo')!)
  }
  else {
    userInfo = {
      token: '1',
      userId: '1'
    }
  }
  return userInfo
}

export const setRandomNumber = (number: number): number => {
  return Math.floor(Math.random() * number)
}

export const isUserExists = (): boolean => {
  return localStorage.getItem('UserInfo') ? true : false
}

export async function makeEmptyStats() {
  const body: IStatisticResponse = {
    learnedWords: 0,
    optional: {
      audioCall: {
        newWords: 0,
        correct: 0,
        wrong: 0,
        maxRow: 0,
      },
      sprint: {
        newWords: 0,
        correct: 0,
        wrong: 0,
        maxRow: 0,
      }
    },
  };
  await new Fetch().UPDATE_STATISTICS(body);
}

export function renderBookWithLS() {
  if (localStorage.getItem('lastBookLevel') && localStorage.getItem('lastBookPage')) {
    const lastBookLevel = localStorage.getItem('lastBookLevel') || '0'
    const lastBookPage = localStorage.getItem('lastBookPage') || '0'
    const bookPage = new BookPage(lastBookLevel)
    bookPage.renderBookPage(lastBookPage)
  }
}
