interface IData {
  url: string,
  method: string,
  body?: null | string
}

interface IUSER_BODY {
  name?: string,
  email: string,
  password: string
}

class Fetch {

  //-------------------------- WORDS ---------------------------------------------

  async GET_WORDS<T>(group: string, page: string): Promise<T> {
    const data: IData = {
      url: `words?group=${group}&page=${page}`,
      method: 'GET'
    }
    return await this.sendRequest(data)
  }

  async GET_WORD_BY_ID<T>(id: string): Promise<T> {
    const data: IData = {
      url: `words/${id}`,
      method: 'GET'
    }
    return await this.sendRequest(data)
  }

  //-------------------------- USERS ----------------------------------------------

  async GET_USER<T>(id: string): Promise<T> {
    const data: IData = {
      url: `users/${id}`,
      method: 'GET'
    }
    return await this.sendRequest(data)
  }

  async POST_USER<T>(body: IUSER_BODY): Promise<T> {
    const data: IData = {
      url: `users`,
      method: 'POST',
      body: JSON.stringify({
        name: body.name,
        email: body.email,
        password: body.password
      })
    }
    return await this.sendRequest(data)
  }

  async UPDATE_USER<T>(id: string, body: IUSER_BODY): Promise<T> {
    const data: IData = {
      url: `users/${id}`,
      method: 'UPDATE',
      body: JSON.stringify({
        email: body.email,
        password: body.password
      })
    }
    return await this.sendRequest(data)
  }

  //------------------------- Users/Words -----------------------------------------

  //------------------------- Users/AggregatedWords -------------------------------

  //------------------------- Users/Statistic -------------------------------------

  //------------------------- Users/Setting ---------------------------------------

  //------------------------- Sign In ---------------------------------------------

  async sendRequest<T>(data: IData): Promise<T> {
    try {
      const response = await fetch(`https://rss21q3-rslang.herokuapp.com/${data.url}`, {
        method: data.method,
        headers: {
          'Content-Type': 'text/plain;charset=UTF-8'
        },
        body: data.body
      })
      return await response.json()
    }
    catch {
      throw new Error('')
    }
  }
}

export { Fetch }