import { IUserInfo } from './../Interfaces/interfaces';


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