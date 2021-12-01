const digipolisLogger = require('../lib');

// log(console, {
//   type: 'json', // log|json|text
// });
//
const configuration = {
  type: 'json', // log | json | text
};
digipolisLogger(console, configuration);

console.log('log function', digipolisLogger);
console.log('logmessage');
console.log('hello');
console.log('hello');
console.log({ message: 'logmessage2', timestamp: 'timestamp123' });
console.error({ message: 'logmessage3' });
console.error(new Error('Error'));

console.log({
  message: 'logmessage4',
  timestamp: 'timestamp321',
  correlationId: '🤖',
});

console.log({
  message: 'logmessage4',
  timestamp: 'timestamp321',
  correlationId: '🤖',
  test: '🤖',
});
