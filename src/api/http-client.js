const { HttpResponse } = require('../core/http-response')
const { HTTP_METHOD } = require('../core/http-method')
const { HttpCore } = require('../core/http-core')
const { Validator } = require('../utility/validator')

class HttpClient {
  /**
   *
   * @param {HttpConfig} httpConfig Http connection configuration
   * @param {HttpAuthStrategy} httpAuthStrategy Strategy to use for authentication
   */
  constructor(entity) {
    let __core = new HttpCore(entity)
    this.__getCore = () => __core
  }

  /**
   * Get HttpClient by country
   *
   * @param {String} entity Country
   * @returns {HttpClient} an `HttpClient` instance
   */
  static getForEntity = (entity, forceEntity = true) => {
    if (!entity && forceEntity) {
      throw new Error('`entity` can not be null/empty')
    }

    return new HttpClient(entity)
  }

  /**
   * Set the http configuration for this client
   *
   * @param {HttpConfig} httpConfig Http connection configuration
   */
  setHttpConfig(httpConfig) {
    Validator.validateHttpConfig(httpConfig)
    this.__getCore().setHttpConfig(httpConfig)
  }

  /**
   * Set the http authentication strategy for this client
   *
   * @param {HttpAuthStrategy} httpAuthStrategy Strategy to use for authentication
   */
  setHttpAuthStrategy(httpAuthStrategy) {
    Validator.validateHttpAuthStrategy(httpAuthStrategy)
    this.__getCore().setHttpAuthStrategy(httpAuthStrategy)
  }

  /**
   * Makes an HTTP GET request
   *
   * @param {String} path URL sub path to make request to, with beginning forward slash
   * @param {Object} queryParams Query parameters object
   * @returns{HttpResponse}
   */
  async get(path, queryParams = {}) {
    this.__getCore().setMethodOptions(HTTP_METHOD.GET, path, queryParams)
    return this.__getCore().makeRequest()
  }

  /**
   * Makes an HTTP POST request
   *
   * @param {String} path URL sub path to make request to, with beginning forward slash
   * @param {Object} body Request body object
   * @returns {HttpResponse}
   */
  async post(path, body = {}) {
    this.__getCore().setMethodOptions(HTTP_METHOD.POST, path, body)
    return this.__getCore().makeRequest()
  }

  /**
   * Makes an HTTP PUT request
   *
   * @param {String} path URL sub path to make request to, with beginning forward slash
   * @param {Object} body Request body object
   * @returns {HttpResponse}
   */
  async put(path, body = {}) {
    this.__getCore().setMethodOptions(HTTP_METHOD.PUT, path, body)
    return this.__getCore().makeRequest()
  }

  /**
   * Makes an HTTP PATCH request
   *
   * @param {String} path URL sub path to make request to, with beginning forward slash
   * @param {Object} body Request body object
   * @returns {HttpResponse}
   */
  async patch(path, body = {}) {
    this.__getCore().setMethodOptions(HTTP_METHOD.PATCH, path, body)
    return this.__getCore().makeRequest()
  }

  /**
   * Makes an HTTP DELETE request
   *
   * @param {String} path URL sub path to make request to, with beginning forward slash
   * @param {Object} body Request body object
   * @returns {HttpResponse}
   */
  async delete(path, body = {}) {
    this.__getCore().setMethodOptions(HTTP_METHOD.DELETE, path, body)
    return this.__getCore().makeRequest()
  }
}

module.exports = {
  HttpClient
}
