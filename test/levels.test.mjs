import sinon from 'sinon';
import { test, describe, before, beforeEach, after, afterEach } from 'node:test';
import log from '../lib/index.js';
import { levels } from '../lib/config/index.js';

const v4 = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$|/i;

describe('log levels:', async () => {
  let sandbox;
  let sandbox2;
  let clock;
  const logstub = {};

  before(async () => {
    if (console.isProxied) console.reset();
    sandbox2 = sinon.createSandbox();
    Object.keys(levels.consoleLevels).forEach((level) => {
      if (console[level].restore) console[level].restore();
      logstub[level] = sandbox2.spy(console, level);
    });
    clock = sinon.useFakeTimers(Date.now());
  });
  after(async () => {
    clock.restore();
    sandbox2.restore();
  });
  beforeEach(async() => {
    sandbox = sinon.createSandbox();
  });
  afterEach(async() => {
    sandbox.restore();
  });
  await describe('log', async () => {
    await test('"logmessage" should use last config', async () => {
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
  await describe('log no override', async() => {
     await test('"logmessage"', () => {
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
  await describe('error', async () => {
    await test('"logmessage"', () => {
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
  await describe('warn', async () => {
    await test('"logmessage"', () => {
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
  await describe('info', async() => {
    await test('"logmessage"', async () => {
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
  await describe('debug', async() => {
    await test('"logmessage"', async () => {
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
