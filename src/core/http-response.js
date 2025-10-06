class HttpResponse {
  /**
   *
   * @param {Object} axiosResponse Axios Response Schema
   * @returns {HttpResponse}
   */
  constructor(axiosResponse) {
    let _status = axiosResponse.status
    let _statusCode = axiosResponse.status
    let _statusText = axiosResponse.statusText
    let _headers = axiosResponse.headers
    let _data = axiosResponse.data
    let _config = axiosResponse.config

    this.getStatus = () => _status
    this.getStatusCode = () => _statusCode
    this.getStatusText = () => _statusText
    this.getHeaders = () => _headers
    this.getData = () => _data
    this.getConfig = () => _config
  }
}

module.exports = { HttpResponse }
