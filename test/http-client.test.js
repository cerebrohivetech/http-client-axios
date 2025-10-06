const axios = require('axios').default
jest.mock('axios')

const { HttpClient } = require('../src/api/http-client')
const { HTTP_AUTH_STRATEGY } = require('../src/core/http-auth-strategy')
const { logHttpError } = require('../src/core/http-error')

const mockNoAuthHttpConfig = {
  baseUrl: 'http://localhost:3000'
}

const mockNoBaseUrlConfig = {
  timeout: 60000
}

const mockBasicHttpConfig = {
  baseUrl: 'http://localhost:3000',
  username: 'username',
  password: 'password'
}

const mockApiKeyHttpConfig = {
  baseURL: 'http://localhost:3000',
  apiKey: 'test-api-key'
}

const entity = 'NG'
let httpClient

describe('HttpClient', () => {
  beforeAll(async () => {
    axios.request.mockResolvedValue({
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
      data: { success: true, message: 'Successful' }
    })
  })

  describe('HttpClient::getForEntity', () => {
    it('should THROW when no entity is received', async () => {
      const fn = () => HttpClient.getForEntity()
      expect(fn).toThrow(Error)
      expect(fn).toThrow(/^`entity` can not be null\/empty$/)
    })

    it('should NOT THROW when no entity is received but forceEntity is false', async () => {
      const httpClient = HttpClient.getForEntity(null, false)
      expect(httpClient.constructor.name).toEqual('HttpClient')
    })

    it('should NOT THROW when entity is received', async () => {
      const httpClient = HttpClient.getForEntity(entity)
      expect(httpClient.constructor.name).toEqual('HttpClient')
    })
  })

  describe('HttpClient::setHttpConfig', () => {
    beforeEach(() => {
      httpClient = HttpClient.getForEntity(entity)
    })

    it('should THROW when no http config is received', async () => {
      const fn = () => httpClient.setHttpConfig()
      expect(fn).toThrow(Error)
      expect(fn).toThrow(/^HttpClient missing `httpConfig`$/)
    })

    it('should THROW when empty http config is received', async () => {
      const fn = () => httpClient.setHttpConfig({})
      expect(fn).toThrow(Error)
      expect(fn).toThrow(/^HttpClient received emtpy config$/)
    })

    it('should THROW when non-object http config is received', async () => {
      const fn = () => httpClient.setHttpConfig('holla')
      expect(fn).toThrow(Error)
      expect(fn).toThrow(/^HttpClient received invalid config, config must be an Object$/)
    })

    it('should THROW when http config received has no base url', async () => {
      const fn = () => httpClient.setHttpConfig(mockNoBaseUrlConfig)
      expect(fn).toThrow(Error)
      expect(fn).toThrow(/^Cannot find `baseUrl` or `baseURL` in httpConfig$/)
    })
  })

  describe('HttpClient::setHttpAuthStrategy', () => {
    beforeEach(() => {
      httpClient = HttpClient.getForEntity(entity)
      httpClient.setHttpConfig(mockNoAuthHttpConfig)
    })

    it('should THROW when type of auth strategy received is not a string', async () => {
      const fn = () => httpClient.setHttpAuthStrategy({})
      expect(fn).toThrow(Error)
      expect(fn).toThrow(/^`httpAuthStrategy` must be a string$/)
    })

    it('should THROW when invalid auth strategy received', async () => {
      const fn = () => httpClient.setHttpAuthStrategy('INVALID')
      expect(fn).toThrow(Error)
      expect(fn).toThrow(/^Invalid `httpAuthStrategy` received$/)
    })

    it('should NOT THROW when NO_AUTH strategy received', async () => {
      const fn = () => httpClient.setHttpAuthStrategy(HTTP_AUTH_STRATEGY.NO_AUTH)
      expect(fn).not.toThrow()
    })

    it('should THROW when BASIC strategy is set but no matching params in http config', async () => {
      const fn = () => httpClient.setHttpAuthStrategy(HTTP_AUTH_STRATEGY.BASIC)
      expect(fn).toThrow(/^Cannot find `username` and `password` in httpConfig for BASIC Auth Strategy$/)
    })

    it('should NOT THROW when BASIC strategy is set and has matching params in http config', async () => {
      httpClient.setHttpConfig(mockBasicHttpConfig)
      const fn = () => httpClient.setHttpAuthStrategy(HTTP_AUTH_STRATEGY.BASIC)
      expect(fn).not.toThrow()
    })

    it('should THROW when API_KEY strategy is set but no matching params in http config', async () => {
      const fn = () => httpClient.setHttpAuthStrategy(HTTP_AUTH_STRATEGY.API_KEY)
      expect(fn).toThrow(/^Cannot find `apiKey` in httpConfig for API_KEY Auth Strategy$/)
    })

    it('should NOT THROW when API_KEY strategy is set and has matching params in httpConfig', async () => {
      httpClient.setHttpConfig(mockApiKeyHttpConfig)
      const fn = () => httpClient.setHttpAuthStrategy(HTTP_AUTH_STRATEGY.API_KEY)
      expect(fn).not.toThrow()
    })
  })

  describe('HttpClient Method Calls', () => {
    beforeEach(() => {
      httpClient = HttpClient.getForEntity(entity)
      httpClient.setHttpConfig(mockNoAuthHttpConfig)
    })

    it('should set entity in header', async () => {
      const httpResponse = await httpClient.get('/', { foo: 'bar' })
      expect(httpClient.__getCore().__options.headers['X-Entity']).toEqual('NG')
    })

    it('should use correct method for GET call and set query params', async () => {
      const httpResponse = await httpClient.get('/', { foo: 'bar' })
      expect(httpClient.__getCore().__options.method).toEqual('GET')
      expect(httpClient.__getCore().__options.params.foo).toBeDefined
      expect(httpClient.__getCore().__options.params.foo).toEqual('bar')
    })

    it('should use correct method for PUT call and set data body', async () => {
      const httpResponse = await httpClient.put('/', { john: 'doe' })
      expect(httpClient.__getCore().__options.method).toEqual('PUT')
      expect(httpClient.__getCore().__options.data.foo).toBeDefined
      expect(httpClient.__getCore().__options.data.john).toEqual('doe')
    })

    it('should use correct method for POST call and set data body', async () => {
      const httpResponse = await httpClient.post('/', { name: 'Jane' })
      expect(httpClient.__getCore().__options.method).toEqual('POST')
      expect(httpClient.__getCore().__options.data.name).toBeDefined
      expect(httpClient.__getCore().__options.data.name).toEqual('Jane')
    })

    it('should use correct method for PATCH call and set data body', async () => {
      const httpResponse = await httpClient.patch('/', { id: 'random123' })
      expect(httpClient.__getCore().__options.method).toEqual('PATCH')
      expect(httpClient.__getCore().__options.data.id).toBeDefined
      expect(httpClient.__getCore().__options.data.id).toEqual('random123')
    })

    it('should use correct method for DELETE call and set data body', async () => {
      const httpResponse = await httpClient.delete('/', { userId: 'abc123' })
      expect(httpClient.__getCore().__options.method).toEqual('DELETE')
      expect(httpClient.__getCore().__options.data.userId).toBeDefined
      expect(httpClient.__getCore().__options.data.userId).toEqual('abc123')
    })
  })

  describe('HttpClient Successful Response', () => {
    it('should return http response of type `HttpResponse`, with with methods returning correct values', async () => {
      const httpClient = HttpClient.getForEntity(entity)
      httpClient.setHttpConfig(mockNoAuthHttpConfig)

      const httpResponse = await httpClient.get('/', { foo: 'bar' })

      expect(httpResponse.constructor.name).toEqual('HttpResponse')
      expect(httpResponse.getStatus()).toEqual(200)
      expect(httpResponse.getStatusCode()).toEqual(200)
      expect(httpResponse.getStatusText()).toEqual('OK')
      expect(httpResponse.getHeaders()).toEqual({ 'content-type': 'application/json' })
      expect(httpResponse.getData().success).toEqual(true)
      expect(httpResponse.getData().message).toEqual('Successful')
    })
  })

  describe('HttpClient Error Response', () => {
    it('should throw 400 error', async () => {
      axios.request.mockRejectedValue({
        response: {
          status: 400,
          statusText: 'BAD REQUEST',
          headers: { 'content-type': 'application/json' },
          data: { success: false, message: 'Unsuccessful' }
        }
      })
      const httpClient = HttpClient.getForEntity(entity)
      httpClient.setHttpConfig(mockNoAuthHttpConfig)

      try {
        await httpClient.get('/', { foo: 'bar' })
      } catch (httpError) {
        logHttpError(httpError)
        expect(httpError.getStatus()).toEqual(400)
        expect(httpError.getStatusCode()).toEqual(400)
        expect(httpError.getStatusText()).toEqual('BAD REQUEST')
        expect(httpError.getHeaders()).toEqual({ 'content-type': 'application/json' })
        expect(httpError.getData().success).toEqual(false)
        expect(httpError.getData().message).toEqual('Unsuccessful')
      }
    })
  })
})
