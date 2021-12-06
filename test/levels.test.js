const sinon = require('sinon');
const log = require('../lib');
const { levels } = require('../lib/config');

describe('log levels:', () => {
  let sandbox;
  let sandbox2;
  let clock;
  const logstub = {};

  before((done) => {
    if (console.isProxied) console.reset();
    sandbox2 = sinon.createSandbox();
    Object.keys(levels.consoleLevels).forEach((level) => {
      if (console[level].restore) console[level].restore();
      logstub[level] = sandbox2.spy(console, level);
    });
    clock = sinon.useFakeTimers(Date.now());
    done();
  });
  after((done) => {
    clock.restore();
    sandbox2.restore();
    done();
  });
  beforeEach((done) => {
    sandbox = sinon.createSandbox();
    done();
  });
  afterEach(() => {
    sandbox.restore();
  });
  describe('log', () => {
    it('"logmessage" should use last config', async () => {
      const logmessage = 'logmessage';
      log(console, {
        type: 'json',
      });
      log(console, {
        type: 'json',
      });
      log(console, {
        type: 'text',
      });
      log(console, {
        type: 'json',
      });
      log(console, {
        type: 'log',
      });
      log(console, {
        type: 'json',
      });
      console.log(logmessage);
      sinon.assert.calledWith(logstub.log, {
        message: logmessage,
        timestamp: new Date().toISOString(),
        type: ['technical'],
        level: 'INFO',
        correlationId: '',
      });
    });
  });
  describe('log', () => {
    it('"logmessage"', async () => {
      const logmessage = 'logmessage';
      log(console, {
        type: 'json',
      });
      console.log(logmessage);
      sinon.assert.calledWith(logstub.log, {
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
      log(console, {
        type: 'json',
      });
      console.error(logmessage);
      sinon.assert.calledWith(logstub.error, {
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
      log(console, {
        type: 'json',
      });
      console.warn(logmessage);
      sinon.assert.calledWith(logstub.warn, {
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
      log(console, {
        type: 'json',
      });
      console.info(logmessage);
      sinon.assert.calledWith(logstub.info, {
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
      log(console, {
        type: 'json',
      });
      console.debug(logmessage);
      sinon.assert.calledWith(logstub.debug, {
        message: logmessage,
        timestamp: new Date().toISOString(),
        type: ['technical'],
        level: 'DEBUG',
        correlationId: '',
      });
    });
  });
});
