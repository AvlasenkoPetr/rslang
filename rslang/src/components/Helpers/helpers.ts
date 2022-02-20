import { Fetch } from '../Fetch/fetch';
import { BookPage } from '../pages/book-page/book-page';
import { Router } from '../router/router';
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

function getTodayDate(): string {
  const date = new Date()
  const dateStr = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`
  console.log(dateStr);
  return dateStr
}

export async function makeEmptyStats() {
  console.log('makeemptystats');
  const date = getTodayDate()

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
      },
      date: date
    },
  };
  await new Fetch().UPDATE_STATISTICS(body);
}

export async function checkStatsDay() {
  console.log('checstats');
  
  const fetch = new Fetch()
  try {
    const oldStats: IStatisticResponse = await fetch.GET_STATISTICS()
    if (oldStats?.optional?.date !== getTodayDate()) {
      await makeEmptyStats()
    }
  } catch {
    await makeEmptyStats()
  }
  return
}

export function renderBookWithLS() {
  if (localStorage.getItem('lastBookLevel') && localStorage.getItem('lastBookPage')) {
    const lastBookLevel = localStorage.getItem('lastBookLevel') || '0'
    const lastBookPage = localStorage.getItem('lastBookPage') || '0'
    const bookPage = new BookPage(lastBookLevel)
    bookPage.renderBookPage(lastBookPage)
  }
}

export function getLastPage() {
  const router = new Router()
  const page = localStorage.getItem('lastPage');
  if (page) {
    if (page === 'book') { 
      router.renderPage(page);
      renderBookWithLS()

    } else {
      router.renderPage(page);
    }

  } else {
    router.renderPage();
  }
}