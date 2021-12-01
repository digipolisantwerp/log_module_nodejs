const digipolisLogger = require('../lib');

const configuration = {
  type: 'json', // log | json | text
};

digipolisLogger(console, configuration);

console.log('hello');
console.log({ message: 'logmessage2', timestamp: 'timestamp123' });
const err = new Error('Errormessage');
console.error(err);
console.log({ message: 'logmessage2', timestamp: 'timestamp123', extra_param1: 'extra_value' });
console.log({
  message: 'logmessage4',
  timestamp: 'timestamp321',
  correlationId: '🤖',
});
