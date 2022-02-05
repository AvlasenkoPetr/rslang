interface IData {
  url: string,
  method: string,
  body?: null | string,
  credentials: boolean,
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

class Fetch {

  //-------------------------- WORDS ---------------------------------------------

  async GET_WORDS<T>(group: string, page: string): Promise<T> {
    const data: IData = {
      url: `words?group=${group}&page=${page}`,
      method: 'GET',
      credentials: false,
      token: null
    }
    return await this.sendRequest(data)
  }

  async GET_WORD_BY_ID<T>(wordId: string): Promise<T> {
    const data: IData = {
      url: `words/${wordId}`,
      method: 'GET',
      credentials: false,
      token: null
    }
    return await this.sendRequest(data)
  }

  //-------------------------- USERS ----------------------------------------------

  async GET_USER<T>(userId: string, token: string): Promise<T> {
    const data: IData = {
      url: `users/${userId}`,
      method: 'GET',
      credentials: false,
      token: token
    }
    return await this.sendRequest(data)
  }

  async CREATE_USER<T>(body: IUSER_BODY): Promise<T> {
    const data: IData = {
      url: `users`,
      method: 'POST',
      credentials: false,
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
      credentials: false,
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
      credentials: false,
      token: token
    }
    return await this.sendRequest(data)
  }

  async GET_USER_TOKENS<T>(id: string, token: string): Promise<T> {
    const data: IData = {
      url: `users/${id}/tokens`,
      method: 'GET',
      credentials: false,
      token: token
    }
    return await this.sendRequest(data)
  }

  //------------------------- Users/Words -----------------------------------------

  async GET_USER_WORDS<T>(id: string, token: string): Promise<T> {
    const data: IData = {
      url: `users/${id}/words`,
      method: 'GET',
      credentials: false,
      token: token
    }
    return await this.sendRequest(data)
  }

  async CREATE_USER_WORDS<T>(id: string, wordId: string, token: string, body: ICREATE_USER_WORD): Promise<T> {
    const data: IData = {
      url: `users/${id}/words/${wordId}`,
      method: 'POST',
      credentials: false,
      token: token,
      body: JSON.stringify(body)
    }
    return await this.sendRequest(data)
  }

  async GET_USER_WORDS_BY_ID<T>(id: string, wordId: string, token: string,): Promise<T> {
    const data: IData = {
      url: `users/${id}/words/${wordId}`,
      method: 'GET',
      credentials: false,
      token: token
    }
    return await this.sendRequest(data)
  }

  async UPDATE_USER_WORDS_BY_ID<T>(id: string, wordId: string, token: string, body: ICREATE_USER_WORD): Promise<T> {
    const data: IData = {
      url: `users/${id}/words/${wordId}`,
      method: 'PUT',
      credentials: false,
      token: token,
      body: JSON.stringify(body)
    }
    return await this.sendRequest(data)
  }

  async DELETE_USER_WORDS_BY_ID<T>(id: string, wordId: string, token: string,): Promise<T> {
    const data: IData = {
      url: `users/${id}/words/${wordId}`,
      method: 'DELETE',
      credentials: false,
      token: token
    }
    return await this.sendRequest(data)
  }

  //------------------------- Users/AggregatedWords -------------------------------

  //------------------------- Users/Statistic -------------------------------------

  //------------------------- Users/Setting ---------------------------------------

  //------------------------- Sign In ---------------------------------------------

  async SIGN_IN<T>(body: IUSER_BODY): Promise<T> {
    const data: IData = {
      url: `signin`,
      method: 'POST',
      credentials: false,
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
      credentials: data.credentials ? 'include' : 'omit',
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