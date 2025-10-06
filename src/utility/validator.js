const { HTTP_AUTH_STRATEGY } = require('../core/http-auth-strategy')

class Validator {
  static validateHttpConfig(httpConfig) {
    if (!httpConfig) {
      throw new Error('HttpClient missing `httpConfig`')
    }

    if (typeof httpConfig !== 'object') {
      throw new Error('HttpClient received invalid config, config must be an Object')
    }

    const jsonStringifiedConfig = JSON.stringify(httpConfig)
    if (jsonStringifiedConfig === '{}') {
      throw new Error('HttpClient received emtpy config')
    }
  }

  static validateHttpAuthStrategy(httpAuthStrategy) {
    if (typeof httpAuthStrategy !== 'string') {
      throw new Error('`httpAuthStrategy` must be a string')
    }

    const VALID_STRATEGIES = Object.values(HTTP_AUTH_STRATEGY)
    if (!VALID_STRATEGIES.includes(httpAuthStrategy)) {
      throw new Error('Invalid `httpAuthStrategy` received')
    }
  }
}

module.exports = {
  Validator
}
