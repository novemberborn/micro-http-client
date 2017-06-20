const createFetch = require('./lib/createFetch');
const { ReducerError, prependHost, addHeaders, processBody, rejectIfUnsuccessful } = require('./lib/reducers');

module.exports = { createFetch, ReducerError, prependHost, addHeaders, processBody, rejectIfUnsuccessful };
