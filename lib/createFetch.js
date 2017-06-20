const globalRef =
  (typeof window !== 'undefined' && window) || // eslint-disable-line no-undef
  (typeof global !== 'undefined' && global) ||
  null;

async function processInterceptor(memo, interceptor) {
  return interceptor(await memo);
}

async function localFetch(globalFetch, requestReducers, responseReducers, url, options) {
  const requestObject = await requestReducers.reduce(processInterceptor, Object.assign({}, { url }, options));
  const response = await globalFetch(requestObject.url, requestObject);
  return responseReducers.reduce(processInterceptor, response);
}

function createFetch({ fetch = globalRef.fetch, requestReducers = [], responseReducers = [] }) {
  return localFetch.bind(null, fetch, requestReducers, responseReducers);
}
module.exports = createFetch;
