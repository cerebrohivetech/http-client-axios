/**
 * @typedef {Object} HttpConfig
 *
 * @property {String} baseUrl Base url to connect to HTTP client without trailing forward slash, same as `baseURL`
 * @property {String} baseURL Same as `baseUrl`
 * @property {Object} headers Http Standard and Custom headers
 * @property {String} timeout HTTP connection timeout
 *
 * Set based on the strategy to be used
 * @property {String} username Username to use for HTTP Authentication when using `BASIC` Auth Strategy
 * @property {String} password Password to use for HTTP Authentication when using `BASIC` Auth Strategy
 * @property {String} apiKey API Key to use for HTTP Authentication when using `API_KEY` strategy
 */

/**
 * @typedef {Enum} HttpAuthStrategy
 *
 * @property {String} BASIC BASIC Http Auth Strategy
 * @property {String} API_KEY API_KEY Http Auth Strategy
 * @property {String} NO_AUTH Does nothing but signifies no Auth is required for HTTP connection
 */
