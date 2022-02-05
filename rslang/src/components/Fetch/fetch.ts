interface IData {
  url: string,
  method: string,
  body?: null | string,
  token: null | string
}

interface IUSER_BODY {
  name?: string,
  email: string,
  password: string
}

export interface ICREATE_USER_WORD {
  difficulty: string,
  optional?: {
    testFieldString: string,
    testFieldBoolean?: boolean
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


class Fetch {

  //-------------------------- WORDS ---------------------------------------------

  async GET_WORDS<T>(group: string, page: string): Promise<T> {
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

  async GET_USER<T>(userId: string, token: string): Promise<T> {
    const data: IData = {
      url: `users/${userId}`,
      method: 'GET',
      token: token
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

  async UPDATE_USER<T>(id: string, token: string, body: IUSER_BODY): Promise<T> {
    const data: IData = {
      url: `users/${id}`,
      method: 'PUT',
      token: token,
      body: JSON.stringify({
        email: body.email,
        password: body.password
      })
    }
    return await this.sendRequest(data)
  }

  async DELETE_USER<T>(id: string, token: string): Promise<T> {
    const data: IData = {
      url: `users/${id}`,
      method: 'DELETE',
      token: token
    }
    return await this.sendRequest(data)
  }

  async GET_USER_TOKENS<T>(id: string, token: string): Promise<T> {
    const data: IData = {
      url: `users/${id}/tokens`,
      method: 'GET',
      token: token
    }
    return await this.sendRequest(data)
  }

  //------------------------- Users/Words -----------------------------------------

  async GET_USER_WORDS<T>(id: string, token: string): Promise<T> {
    const data: IData = {
      url: `users/${id}/words`,
      method: 'GET',
      token: token
    }
    return await this.sendRequest(data)
  }

  async CREATE_USER_WORDS<T>(id: string, wordId: string, token: string, body: ICREATE_USER_WORD): Promise<T> {
    const data: IData = {
      url: `users/${id}/words/${wordId}`,
      method: 'POST',
      token: token,
      body: JSON.stringify(body)
    }
    return await this.sendRequest(data)
  }

  async GET_USER_WORDS_BY_ID<T>(id: string, wordId: string, token: string,): Promise<T> {
    const data: IData = {
      url: `users/${id}/words/${wordId}`,
      method: 'GET',
      token: token
    }
    return await this.sendRequest(data)
  }

  async UPDATE_USER_WORDS_BY_ID<T>(id: string, wordId: string, token: string, body: ICREATE_USER_WORD): Promise<T> {
    const data: IData = {
      url: `users/${id}/words/${wordId}`,
      method: 'PUT',
      token: token,
      body: JSON.stringify(body)
    }
    return await this.sendRequest(data)
  }

  async DELETE_USER_WORDS_BY_ID<T>(id: string, wordId: string, token: string,): Promise<T> {
    const data: IData = {
      url: `users/${id}/words/${wordId}`,
      method: 'DELETE',
      token: token
    }
    return await this.sendRequest(data)
  }

  //------------------------- Users/AggregatedWords -------------------------------

  //------------------------- Users/Statistic -------------------------------------

  async GET_STATISTICS<T>(id: string, token: string): Promise<T> {
    const data: IData = {
      url: `users/${id}/statistics`,
      method: 'GET',
      token: token,
    }

    return await this.sendRequest(data)
  };

  async UPDATE_STATISTICS<T>(id: string, token: string, body: IUPDATE_STATISTICS): Promise<T> {
    const data: IData = {
      url: `users/${id}/statistics`,
      method: 'PUT',
      token: token,
      body: JSON.stringify(body)
    }

    return await this.sendRequest(data)
  };

  //------------------------- Users/Setting ---------------------------------------

  async GET_USER_SETTINGS<T>(id: string, token: string): Promise<T> {
    const data: IData = {
      url: `users/${id}/settings`,
      method: 'GET',
      token: token,
    }

    return await this.sendRequest(data)
  };

  async UPDATE_USER_SETTINGS<T>(id: string, token: string, body: IUPDATE_SETTINGS): Promise<T> {
    const data: IData = {
      url: `users/${id}/settings`,
      method: 'PUT',
      token: token,
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