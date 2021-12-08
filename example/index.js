const digipolisLogger = require('../lib');

const configuration = {
  type: 'json', // log | json | text
  override: false, // false | true
};

const mylogger = digipolisLogger(console, configuration);

mylogger.log('hello');
mylogger.log('hello');
mylogger.log({ message: 'logmessage2', timestamp: 'timestamp123' });
const err = new Error('Errormessage');
mylogger.error(err);
mylogger.log({ message: 'logmessage2', timestamp: 'timestamp123', extra_param1: 'extra_value' });
mylogger.log({
  message: 'logmessage4',
  timestamp: 'timestamp321',
  correlationId: '🤖',
});
