const digipolisLogger = require('../lib');

const configuration = {
  type: 'json', // log | json | text | silent
  override: false, // false | true
};

const mylogger = digipolisLogger(console, configuration);

mylogger.log('hello');
mylogger.log('hello');
mylogger.log('something went wrong', new Error("wupsi"));
mylogger.log({ message: 'logmessage2', timestamp: 'timestamp123' });
const err = new Error('Errormessage');
mylogger.error(err);
mylogger.log({ message: 'logmessage2', timestamp: 'timestamp123', extra_param1: 'extra_value' });
mylogger.log({ message: 'logmessage2', timestamp: 'timestamp123', correlationId: 'my_correlationId' });
mylogger.log({
  message: 'logmessage4',
  timestamp: 'timestamp321',
  correlationId: '🤖',
});

const configuration2 = {
  type: 'json', // log | json | text | silent
  override: false, // false | true
  level: 'error', // debug | info | log | warn | error
};

const mylogger2 = digipolisLogger(console, configuration2);
mylogger2.log('should not show');
mylogger2.error('should show');
