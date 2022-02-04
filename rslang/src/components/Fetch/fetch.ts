interface IData {
  url: string,
  method: string,
  body?: null
}

class Fetch {

  async GET_WORDS<T>(group: string, page: string): Promise<T> {
    const data: IData = {
      url: `words?group=${group}&page=${page}`,
      method: 'GET'
    }
    return await this.sendRequest(data)
  }

  async GET_WORDS_BY_ID<T>(id: string): Promise<T> {
    const data: IData = {
      url: `words/${id}`,
      method: 'GET'
    }
    return await this.sendRequest(data)
  }

  async GET_USER_BY_ID<T>(id: string): Promise<T> {
    const data: IData = {
      url: `users/${id}`,
      method: 'GET'
    }
    return await this.sendRequest(data)
  }

  async sendRequest<T>(data: IData): Promise<T> {
    const response = await fetch(`https://rss21q3-rslang.herokuapp.com/${data.url}`, {
      method: data.method,
      headers: {
        'Content-Type': 'text/plain;charset=UTF-8'
      },
      body: data.body
    })
    return await response.json()
  }
}

export { Fetch }