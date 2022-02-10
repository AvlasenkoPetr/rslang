interface IData {
  url: string,
  method: string,
  body?: null | string,
  token: null | string
}

interface IUSER_BODY {
  name: string,
  email: string,
  password: string
}

export interface ICREATE_USER_WORD {
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

interface IUserInfo {
  token: string,
  userId: string
}

const getUserInfo = (): IUserInfo => {
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

class Fetch {

  //-------------------------- WORDS ---------------------------------------------

  async GET_WORDS<T>(group: string = '0', page: string = '0'): Promise<T> {
    const data: IData = {
      url: `words?group=${group}&page=${page}`,
      method: 'GET',
      token: null
    }
    return await this.sendRequest(data)
  }

  async GET_WORD_BY_ID<T>(wordId: string): Promise<T> {
    const data: IData = {
      url: `words/${wordId}`,
      method: 'GET',
      token: null
    }
    return await this.sendRequest(data)
  }

  //-------------------------- USERS ----------------------------------------------

  async GET_USER<T>(): Promise<T> {
    const data: IData = {
      url: `users/${getUserInfo().userId}`,
      method: 'GET',
      token: getUserInfo().token
    }
    return await this.sendRequest(data)
  }

  async CREATE_USER<T>(body: IUSER_BODY): Promise<T> {
    const data: IData = {
      url: `users`,
      method: 'POST',
      token: null,
      body: JSON.stringify({
        name: body.name,
        email: body.email,
        password: body.password
      })
    }
    return await this.sendRequest(data)
  }

  async UPDATE_USER<T>(body: IUSER_BODY): Promise<T> {
    const data: IData = {
      url: `users/${getUserInfo().userId}`,
      method: 'PUT',
      token: getUserInfo().token,
      body: JSON.stringify({
        email: body.email,
        password: body.password
      })
    }
    return await this.sendRequest(data)
  }

  async DELETE_USER<T>(): Promise<T> {
    const data: IData = {
      url: `users/${getUserInfo().userId}`,
      method: 'DELETE',
      token: getUserInfo().token
    }
    return await this.sendRequest(data)
  }

  async GET_USER_TOKENS<T>(): Promise<T> {
    const data: IData = {
      url: `users/${getUserInfo().userId}/tokens`,
      method: 'GET',
      token: getUserInfo().token
    }
    return await this.sendRequest(data)
  }

  //------------------------- Users/Words -----------------------------------------

  async GET_USER_WORDS<T>(): Promise<T> {
    const data: IData = {
      url: `users/${getUserInfo().userId}/words`,
      method: 'GET',
      token: getUserInfo().token
    }
    return await this.sendRequest(data)
  }

  async CREATE_USER_WORDS<T>(wordId: string, body: ICREATE_USER_WORD): Promise<T> {
    const data: IData = {
      url: `users/${getUserInfo().userId}/words/${wordId}`,
      method: 'POST',
      token: getUserInfo().token,
      body: JSON.stringify(body)
    }
    return await this.sendRequest(data)
  }

  async GET_USER_WORDS_BY_ID<T>(wordId: string,): Promise<T> {
    const data: IData = {
      url: `users/${getUserInfo().userId}/words/${wordId}`,
      method: 'GET',
      token: getUserInfo().token
    }
    return await this.sendRequest(data)
  }

  async UPDATE_USER_WORDS_BY_ID<T>(wordId: string, body: ICREATE_USER_WORD): Promise<T> {
    const data: IData = {
      url: `users/${getUserInfo().userId}/words/${wordId}`,
      method: 'PUT',
      token: getUserInfo().token,
      body: JSON.stringify(body)
    }
    return await this.sendRequest(data)
  }

  async DELETE_USER_WORDS_BY_ID<T>(wordId: string,): Promise<T> {
    const data: IData = {
      url: `users/${getUserInfo().userId}/words/${wordId}`,
      method: 'DELETE',
      token: getUserInfo().token
    }
    return await this.sendRequest(data)
  }

  //------------------------- Users/AggregatedWords -------------------------------

  async GET_AGGREGATED_WORDS<T>(): Promise<T> {
    const data: IData = {
      url: `users/${getUserInfo().userId}/aggregatedWords`,
      method: 'GET',
      token: getUserInfo().token,

    }
    return await this.sendRequest(data)
  };

  //------------------------- Users/Statistic -------------------------------------

  async GET_STATISTICS<T>(): Promise<T> {
    const data: IData = {
      url: `users/${getUserInfo().userId}/statistics`,
      method: 'GET',
      token: getUserInfo().token,
    }
    return await this.sendRequest(data)
  };

  async UPDATE_STATISTICS<T>(body: IUPDATE_STATISTICS): Promise<T> {
    const data: IData = {
      url: `users/${getUserInfo().userId}/statistics`,
      method: 'PUT',
      token: getUserInfo().token,
      body: JSON.stringify(body)
    }
    return await this.sendRequest(data)
  };

  //------------------------- Users/Setting ---------------------------------------

  async GET_USER_SETTINGS<T>(): Promise<T> {
    const data: IData = {
      url: `users/${getUserInfo().userId}/settings`,
      method: 'GET',
      token: getUserInfo().token,
    }
    return await this.sendRequest(data)
  };

  async UPDATE_USER_SETTINGS<T>(body: IUPDATE_SETTINGS): Promise<T> {
    const data: IData = {
      url: `users/${getUserInfo().userId}/settings`,
      method: 'PUT',
      token: getUserInfo().token,
      body: JSON.stringify(body)
    }
    return await this.sendRequest(data)
  };

  //------------------------- Sign In ---------------------------------------------

  async SIGN_IN<T>(body: IUSER_BODY): Promise<T> {
    const data: IData = {
      url: `signin`,
      method: 'POST',
      token: null,
      body: JSON.stringify({
        email: body.email,
        password: body.password
      })
    }
    return await this.sendRequest(data)
  };


  async sendRequest<T>(data: IData): Promise<T> {
    const response = await fetch(`https://rss21q3-rslang.herokuapp.com/${data.url}`, {
      method: data.method,
      headers: {
        ['Authorization']: `Bearer ${data.token}`,
        ['Content-Type']: 'application/json',
        ['Accept']: 'application/json',
      },
      body: data.body
    })
    try {
      return await response.json()
    }
    catch {
      throw {
        url: response.url,
        status: response.status,
        statusText: response.statusText
      }
    }
  }
}

export { Fetch }