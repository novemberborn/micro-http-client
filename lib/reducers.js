const hasOwnProperty = (object, property) => Object.hasOwnProperty.call(object, property);

function ReducerError(message, additional = {}) {
  Error.call(this, message);
  this.message = message;
  Object.assign(this, additional);
  return this;
}
exports.ReducerError = ReducerError;

function stripTrailingSlash(string) {
  if (string[string.length - 1] !== '/') return string;
  return string.slice(0, -1);
}

function prependHost(host) {
  const sanitizedHost = stripTrailingSlash(host);
  return (request) => {
    const { url: absolutePath } = request;
    if (absolutePath[0] !== '/') {
      throw new ReducerError('prependHost() requires an absolute path', { request });
    }
    return Object.assign({}, request, { url: `${sanitizedHost}${absolutePath}` });
  };
}
exports.prependHost = prependHost;

function addHeaders(headers) {
  return async (request) => {
    if (typeof headers === 'function') {
      const newHeaders = Object.assign({}, await headers(), request.headers);
      return Object.assign({}, request, { headers: newHeaders });
    }

    const newHeaders = Object.assign({}, headers, request.headers);
    return Object.assign({}, request, { headers: newHeaders });
  };
}
exports.addHeaders = addHeaders;

function processBody(processorFunction) {
  return async (request) => {
    if (!hasOwnProperty(request, 'body')) return request;
    return Object.assign({}, request, { body: await processorFunction(request.body) });
  };
}
exports.processBody = processBody;

function rejectIfUnsuccessful(response) {
  if (response.status < 200 || response.status >= 400) {
    throw new ReducerError('Response is not successful', { response });
  }
  return response;
}
exports.rejectIfUnsuccessful = rejectIfUnsuccessful;
