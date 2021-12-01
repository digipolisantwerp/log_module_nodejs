const sinon = require('sinon');
const log = require('../lib');

describe('log levels:', () => {
  let sandbox;
  let clock;
  beforeEach((done) => {
    sandbox = sinon.createSandbox();
    clock = sinon.useFakeTimers(Date.now());
    done();
  });
  afterEach(() => {
    sandbox.restore();
    clock.restore();
  });
  describe('log', () => {
    it('"logmessage"', async () => {
      const logmessage = 'logmessage';
      const logspy = sandbox.stub(console, 'log');
      log(console, {
        type: 'json',
      });
      console.log(logmessage);
      sinon.assert.calledWith(logspy, {
        message: logmessage,
        timestamp: new Date().toISOString(),
        type: ['technical'],
        level: 'INFO',
        correlationId: '',
      });
    });
  });
  describe('error', () => {
    it('"logmessage"', async () => {
      const logmessage = 'logmessage';
      const logspy = sandbox.stub(console, 'error');
      log(console, {
        type: 'json',
      });
      console.error(logmessage);
      sinon.assert.calledWith(logspy, {
        message: logmessage,
        timestamp: new Date().toISOString(),
        type: ['technical'],
        level: 'ERROR',
        correlationId: '',
      });
    });
  });
  describe('warn', () => {
    it('"logmessage"', async () => {
      const logmessage = 'logmessage';
      const logspy = sandbox.stub(console, 'warn');
      log(console, {
        type: 'json',
      });
      console.warn(logmessage);
      sinon.assert.calledWith(logspy, {
        message: logmessage,
        timestamp: new Date().toISOString(),
        type: ['technical'],
        level: 'WARN',
        correlationId: '',
      });
    });
  });
  describe('info', () => {
    it('"logmessage"', async () => {
      const logmessage = 'logmessage';
      const logspy = sandbox.stub(console, 'info');
      log(console, {
        type: 'json',
      });
      console.info(logmessage);
      sinon.assert.calledWith(logspy, {
        message: logmessage,
        timestamp: new Date().toISOString(),
        type: ['technical'],
        level: 'INFO',
        correlationId: '',
      });
    });
  });
  describe('debug', () => {
    it('"logmessage"', async () => {
      const logmessage = 'logmessage';
      const logspy = sandbox.stub(console, 'debug');
      log(console, {
        type: 'json',
      });
      console.debug(logmessage);
      sinon.assert.calledWith(logspy, {
        message: logmessage,
        timestamp: new Date().toISOString(),
        type: ['technical'],
        level: 'DEBUG',
        correlationId: '',
      });
    });
  });
});
