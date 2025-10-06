class HttpError extends Error {
  /**
   *
   * @param {Object} axiosError
   * @returns {HttpError}
   */
  constructor(axiosError) {
    super()

    let _axiosError = axiosError
    let _config = axiosError.config

    this.hasResponse = () => !!axiosError.response
    let _status = this.hasResponse() && axiosError.response.status
    let _statusText = this.hasResponse() && axiosError.response.statusText
    let _statusCode = this.hasResponse() && axiosError.response.status
    let _headers = this.hasResponse() && axiosError.response.headers
    let _data = this.hasResponse() && axiosError.response.data

    this.getAxiosError = () => _axiosError
    this.getConfig = () => _config

    this.getStatus = () => _status
    this.getStatusText = () => _statusText
    this.getStatusCode = () => _statusCode
    this.getHeaders = () => _headers
    this.getData = () => _data

    this.stack = axiosError.stack
  }
}

/**
 *
 * @param {HttpError} error
 */
const logHttpError = (error) => {
  console.log('----- HTTP_REQUEST_ERROR_START -----')
  console.log(error.stack)

  if (error.hasResponse()) {
    const statusCode = error.getStatusCode()
    let data = error.getData()
    console.log({ statusCode, data })
  }

  console.log('----- HTTP_REQUEST_ERROR_END -----')
}

module.exports = {
  HttpError,
  logHttpError
}
