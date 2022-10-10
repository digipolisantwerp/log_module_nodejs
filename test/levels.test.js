const sinon = require('sinon');
const log = require('../lib');
const { levels } = require('../lib/config');

const v4 = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

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
        override: true,
      });
      log(console, {
        type: 'json',
        override: true,
      });
      log(console, {
        type: 'text',
        override: true,
      });
      log(console, {
        type: 'json',
        override: true,
      });
      log(console, {
        type: 'log',
        override: true,
      });
      log(console, {
        type: 'json',
        override: true,
      });
      console.log(logmessage);
      sinon.assert.calledWith(logstub.log, {
        message: logmessage,
        timestamp: new Date().toISOString(),
        type: ['technical'],
        level: 'INFO',
        correlationId: sinon.match(v4),
      });
    });
  });
  describe('log', () => {
    it('"logmessage"', async () => {
      const logmessage = 'logmessage';
      log(console, {
        type: 'json',
        override: true,
      });
      console.log(logmessage);
      sinon.assert.calledWith(logstub.log, {
        message: logmessage,
        timestamp: new Date().toISOString(),
        type: ['technical'],
        level: 'INFO',
        correlationId: sinon.match(v4),
      });
    });
  });
  describe('error', () => {
    it('"logmessage"', async () => {
      const logmessage = 'logmessage';
      log(console, {
        type: 'json',
        override: true,
      });
      console.error(logmessage);
      sinon.assert.calledWith(logstub.error, {
        message: logmessage,
        timestamp: new Date().toISOString(),
        type: ['technical'],
        level: 'ERROR',
        correlationId: sinon.match(v4),
      });
    });
  });
  describe('warn', () => {
    it('"logmessage"', async () => {
      const logmessage = 'logmessage';
      log(console, {
        type: 'json',
        override: true,
      });
      console.warn(logmessage);
      sinon.assert.calledWith(logstub.warn, {
        message: logmessage,
        timestamp: new Date().toISOString(),
        type: ['technical'],
        level: 'WARN',
        correlationId: sinon.match(v4),
      });
    });
  });
  describe('info', () => {
    it('"logmessage"', async () => {
      const logmessage = 'logmessage';
      log(console, {
        type: 'json',
        override: true,
      });
      console.info(logmessage);
      sinon.assert.calledWith(logstub.info, {
        message: logmessage,
        timestamp: new Date().toISOString(),
        type: ['technical'],
        level: 'INFO',
        correlationId: sinon.match(v4),
      });
    });
  });
  describe('debug', () => {
    it('"logmessage"', async () => {
      const logmessage = 'logmessage';
      log(console, {
        type: 'json',
        override: true,
      });
      console.debug(logmessage);
      sinon.assert.calledWith(logstub.debug, {
        message: logmessage,
        timestamp: new Date().toISOString(),
        type: ['technical'],
        level: 'DEBUG',
        correlationId: sinon.match(v4),
      });
    });
  });
});
