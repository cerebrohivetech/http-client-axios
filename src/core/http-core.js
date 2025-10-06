const axios = require('axios').default

const { HttpResponse } = require('./http-response')
const { HttpError } = require('./http-error')
const { HTTP_AUTH_STRATEGY } = require('./http-auth-strategy')
const { HTTP_METHOD } = require('./http-method')

const DEFAULT_HTTP_REQUEST_TIMEOUT_IN_SECONDS = 60

class HttpCore {
  constructor(entity) {
    this.__entity = entity
    this.__options = {}
    this.__httpConfig = {}
  }

  __setOptions() {
    this.__options.timeout = this.__httpConfig.timeout || DEFAULT_HTTP_REQUEST_TIMEOUT_IN_SECONDS * 1000
    this.__setBaseUrl()
    this.__setHeaders()
  }

  __setAuthStrategy() {
    if (this.__httpAuthStrategy === HTTP_AUTH_STRATEGY.BASIC) {
      this.__setBasicAuthStrategy()
    } else if (this.__httpAuthStrategy === HTTP_AUTH_STRATEGY.API_KEY) {
      this.__setApiKeyAuthStrategy()
    }
  }

  __setBaseUrl() {
    const { baseUrl, baseURL } = this.__httpConfig
    if (!baseUrl && !baseURL) {
      throw new Error('Cannot find `baseUrl` or `baseURL` in httpConfig')
    }
    this.__options.baseURL = this.__httpConfig.baseUrl || this.__httpConfig.baseURL
  }

  __setHeaders() {
    this.__options.headers = {
      'Content-Type': 'application/json',
      'X-Entity': this.__entity
    }
    this.__options.headers = Object.assign(this.__options.headers, this.__httpConfig.headers || {})
  }

  __setBasicAuthStrategy() {
    const { username, password } = this.__httpConfig
    if (!(username && password)) {
      throw new Error('Cannot find `username` and `password` in httpConfig for BASIC Auth Strategy')
    }
    this.__options.auth = { username, password }
  }

  __setApiKeyAuthStrategy() {
    if (!this.__httpConfig.apiKey) {
      throw new Error('Cannot find `apiKey` in httpConfig for API_KEY Auth Strategy')
    }
    this.__options.headers['X-Api-Key'] = this.__httpConfig.apiKey
  }

  setHttpConfig(httpConfig) {
    this.__httpConfig = httpConfig
    this.__setOptions()
  }

  setHttpAuthStrategy(httpAuthStrategy) {
    this.__httpAuthStrategy = httpAuthStrategy
    this.__setAuthStrategy()
  }

  setMethodOptions(method, path, data) {
    this.__options.method = method
    this.__options.url = path
    if (method === HTTP_METHOD.GET) {
      this.__options.params = data
      delete this.__options.data
    } else {
      this.__options.data = data
      delete this.__options.params
    }
  }

  async makeRequest() {
    try {
      const axiosResponse = await axios.request(this.__options)
      return new HttpResponse(axiosResponse)
    } catch (axiosError) {
      throw new HttpError(axiosError)
    }
  }
}

module.exports = {
  HttpCore
}
