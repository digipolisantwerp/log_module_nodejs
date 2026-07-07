import assert from 'node:assert/strict';
import sinon from 'sinon';
import { test, describe, before, beforeEach, after, afterEach } from 'node:test';
import { levels } from '../lib/config/index.js';
import uuidhelper from '../lib/helpers/uuid.js';
import log from '../lib/index.js';
import logschema from './data/logschema.json' with { type: "json" };
import { Validator } from 'jsonschema';

const v4 = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$|/i;
const validator = new Validator();

describe('Logs:', async () => {
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
    sandbox.stub(uuidhelper, 'uuidV4').returns('ABCDEFAB-ABCD-4ABC-AABC-ABCDEFABCDEF');
  });
  afterEach(async() => {
    sandbox.restore();
  });
  test('default log', async () => {
    console.log('hello');
    sinon.assert.calledWith(logstub.log, 'hello');
  });
  await describe('{ type: json }', async () => {
    test('"logmessage"', async () => {
      const logmessage = 'logmessage';
      log(console, {
        type: 'json',
        override: true,
      });
      console.log(logmessage);
      const result = {
        message: logmessage,
        timestamp: new Date().toISOString(),
        type: ['technical'],
        level: 'INFO',
        correlationId: 'ABCDEFAB-ABCD-4ABC-AABC-ABCDEFABCDEF',
      };
      sinon.assert.calledWith(logstub.log, result);
      assert.equal(validator.validate(result, logschema).valid ,true)
    });
    test('{ message: "logmessage" }', async () => {
      const logmessage = { message: 'logmessage' };
      log(console, {
        type: 'json',
        override: true,
      });
      console.log(logmessage);
      const result = {
        message: 'logmessage',
        timestamp: new Date().toISOString(),
        type: ['technical'],
        level: 'INFO',
        correlationId: 'ABCDEFAB-ABCD-4ABC-AABC-ABCDEFABCDEF',
      };
      sinon.assert.calledWith(logstub.log, result);
      assert.equal(validator.validate(result, logschema).valid ,true)
    });
    test('test, { x: "y" }', async () => {
      const logmessage = { x: 'y' };
      log(console, {
        type: 'json',
        override: true,
      });
      console.log('test', logmessage);
      const result = {
        message: 'test Extrainfo: {"x":"y"}',
        timestamp: new Date().toISOString(),
        type: ['technical'],
        level: 'INFO',
        correlationId: 'ABCDEFAB-ABCD-4ABC-AABC-ABCDEFABCDEF',
      };
      sinon.assert.calledWith(logstub.log, result);
      assert.equal(validator.validate(result, logschema).valid ,true)
    });
    test('{ timestamp: "timestamp" }', async () => {
      const logmessage = { timestamp: 'timestamp' };
      log(console, {
        type: 'json',
        override: true,
      });
      console.log(logmessage);
      const result = {
        timestamp: 'timestamp',
        type: ['technical'],
        level: 'INFO',
        correlationId: 'ABCDEFAB-ABCD-4ABC-AABC-ABCDEFABCDEF',
      };
      sinon.assert.calledWith(logstub.log, result);
    });
    test('{ message: "logmessage", timestamp: "timestamp" }', async () => {
      const logmessage = { message: 'logmessage', timestamp: 'timestamp' };
      log(console, {
        type: 'json',
        override: true,
      });
      console.log(logmessage);
      sinon.assert.calledWith(logstub.log, {
        message: logmessage.message,
        timestamp: 'timestamp',
        type: ['technical'],
        level: 'INFO',
        correlationId: 'ABCDEFAB-ABCD-4ABC-AABC-ABCDEFABCDEF',
      });
    });
    test('{ message: "logmessage", type: "mytype" }', async () => {
      const logmessage = { message: 'logmessage', type: 'mytype' };
      log(console, {
        type: 'json',
        override: true,
      });
      console.log(logmessage);
      sinon.assert.calledWith(logstub.log, {
        message: logmessage.message,
        timestamp: new Date().toISOString(),
        type: ['mytype'],
        level: 'INFO',
        correlationId: 'ABCDEFAB-ABCD-4ABC-AABC-ABCDEFABCDEF',
      });
    });
    test('{ message: "logmessage", type: ["mytype", "mytype2"] }', async () => {
      const logmessage = { message: 'logmessage', type: ['mytype', 'mytype2'] };
      log(console, {
        type: 'json',
        override: true,
      });
      console.log(logmessage);
      sinon.assert.calledWith(logstub.log, {
        message: logmessage.message,
        timestamp: new Date().toISOString(),
        type: ['mytype', 'mytype2'],
        level: 'INFO',
        correlationId: 'ABCDEFAB-ABCD-4ABC-AABC-ABCDEFABCDEF',
      });
    });
    test('{ message: "logmessage", extraparam: "extravalue" }', async () => {
      const logmessage = { message: 'logmessage', extraparam: 'extravalue' };
      log(console, {
        type: 'json',
        override: true,
      });
      console.log(logmessage);
      sinon.assert.calledWith(logstub.log, {
        timestamp: new Date().toISOString(),
        type: ['technical'],
        level: 'INFO',
        correlationId: 'ABCDEFAB-ABCD-4ABC-AABC-ABCDEFABCDEF',
        message: 'logmessage Extrainfo: {"extraparam":"extravalue"}',
      });
    });
    test('new Error(\'errormessage\')', async () => {
      const logmessage = new Error('errormessage');
      logmessage.stack = `
  stack
  stack
  stack`;
      log(console, {
        type: 'json',
        override: true,
      });
      console.log(logmessage);
      sinon.assert.calledWith(logstub.log, {
        message: 'errormessage \n  stack\n  stack\n  stack',
        timestamp: new Date().toISOString(),
        type: ['technical'],
        level: 'INFO',
        correlationId: 'ABCDEFAB-ABCD-4ABC-AABC-ABCDEFABCDEF',
      });
    });
    test('message, new Error(\'errormessage\')', async () => {
      const logmessage = new Error('errormessage');
      logmessage.stack = `
  stack
  stack
  stack`;
      log(console, {
        type: 'json',
        override: true,
      });
      console.log('message', logmessage);
      sinon.assert.calledWith(logstub.log, {
        message: 'message errormessage \n  stack\n  stack\n  stack',
        timestamp: new Date().toISOString(),
        type: ['technical'],
        level: 'INFO',
        correlationId: 'ABCDEFAB-ABCD-4ABC-AABC-ABCDEFABCDEF',
      });
    });
  });
  await describe('{ type: silent }', async () => {
    test('"logmessage"', async () => {
      logstub.log.resetHistory();
      const logmessage = 'logmessage';
      log(console, {
        type: 'silent',
        override: true,
      });
      console.log(logmessage);
      sinon.assert.notCalled(logstub.log);
    });
  });
  await describe('{ type: log }', async () => {
        test('"logmessage"', async () => {
      const logmessage = 'logmessage';
      log(console, {
        type: 'log',
        override: true,
      });
      console.log(logmessage);
      const result = JSON.stringify({
        timestamp: new Date().toISOString(),
        type: ['technical'],
        level: 'INFO',
        correlationId: 'ABCDEFAB-ABCD-4ABC-AABC-ABCDEFABCDEF',
        message: logmessage,
      });
      sinon.assert.calledWith(logstub.log, result);
    });
    test('"logmessage" fallback to log for unknown', async () => {
      const logmessage = 'logmessage';
      log(console, {
        type: 'unknown-log-type',
        override: true,
      });
      console.log(logmessage);
      const result = JSON.stringify({
        timestamp: new Date().toISOString(),
        type: ['technical'],
        level: 'INFO',
        correlationId: 'ABCDEFAB-ABCD-4ABC-AABC-ABCDEFABCDEF',
        message: logmessage,
      });
      sinon.assert.calledWith(logstub.log, result);
    });
    test('{ message: "logmessage" }', async () => {
      const logmessage = { message: 'logmessage' };
      log(console, {
        type: 'log',
        override: true,
      });
      console.log(logmessage);
      sinon.assert.calledWith(logstub.log, JSON.stringify({
        timestamp: new Date().toISOString(),
        type: ['technical'],
        level: 'INFO',
        correlationId: 'ABCDEFAB-ABCD-4ABC-AABC-ABCDEFABCDEF',
        message: logmessage.message,
      }));
    });
    test('{ timestamp: "timestamp" }', async () => {
      const logmessage = { timestamp: 'timestamp' };
      log(console, {
        type: 'log',
        override: true,
      });
      console.log(logmessage);
      sinon.assert.calledWith(logstub.log, JSON.stringify({
        timestamp: 'timestamp',
        type: ['technical'],
        level: 'INFO',
        correlationId: 'ABCDEFAB-ABCD-4ABC-AABC-ABCDEFABCDEF',
      }));
    });
    test('{ message: "logmessage", timestamp: "timestamp" }', async () => {
      const logmessage = { message: 'logmessage', timestamp: 'timestamp' };
      log(console, {
        type: 'log',
        override: true,
      });
      console.log(logmessage);
      sinon.assert.calledWith(logstub.log, JSON.stringify({
        timestamp: 'timestamp',
        type: ['technical'],
        level: 'INFO',
        correlationId: 'ABCDEFAB-ABCD-4ABC-AABC-ABCDEFABCDEF',
        message: logmessage.message,
      }));
    });
    test('{ message: "logmessage", extraparam: "extravalue" }', async () => {
      const logmessage = { message: 'logmessage', extraparam: 'extravalue' };
      log(console, {
        type: 'log',
        override: true,
      });
      console.log(logmessage);
      sinon.assert.calledWith(logstub.log, JSON.stringify({
        timestamp: new Date().toISOString(),
        type: ['technical'],
        level: 'INFO',
        correlationId: 'ABCDEFAB-ABCD-4ABC-AABC-ABCDEFABCDEF',
        message: 'logmessage Extrainfo: {"extraparam":"extravalue"}',
      }));
    });
    test('{ message: "logmessage", extraparam: buffer }', async () => {
      const buffer = Buffer.from('smdlfkjmsldjfmlskdjfmlskjfmlksdjflskdjf');
      const logmessage = { message: 'logmessage', extraparam: buffer };
      log(console, {
        type: 'log',
        override: true,
      });
      console.log(logmessage);
      sinon.assert.calledWith(logstub.log, JSON.stringify({
        timestamp: new Date().toISOString(),
        type: ['technical'],
        level: 'INFO',
        correlationId: 'ABCDEFAB-ABCD-4ABC-AABC-ABCDEFABCDEF',
        message: 'logmessage Extrainfo: {"extraparam":"[Buffer]"}',
      }));
    });
  });
  test('"logmessage1", "logmessage2"', async () => {
    const logmessage = 'logmessage';
    const logmessage2 = 'logmessage2';
    log(console, {
      type: 'log',
      override: true,
    });
    console.log(logmessage, logmessage2);
    const result = JSON.stringify({
      timestamp: new Date().toISOString(),
      type: ['technical'],
      level: 'INFO',
      correlationId: 'ABCDEFAB-ABCD-4ABC-AABC-ABCDEFABCDEF',
      message: `${logmessage} ${logmessage2}`,
    });
    sinon.assert.calledWith(logstub.log, result);
  });
  await describe('{ type: text }', async () => {
    test('"logmessage"', async () => {
      const logmessage = 'logmessage';
      log(console, {
        type: 'text',
        override: true,
      });
      console.log(logmessage);
      sinon.assert.calledWith(logstub.log, 'INFO:', new Date().toISOString(), logmessage);
    });
    test('{ message: "logmessage" }', async () => {
      const logmessage = { message: 'logmessage' };
      log(console, {
        type: 'text',
        override: true,
      });
      console.log(logmessage);
      sinon.assert.calledWith(logstub.log, 'INFO:', new Date().toISOString(), logmessage);
    });
    test('{ timestamp: "timestamp" }', async () => {
      const logmessage = { timestamp: 'timestamp' };
      log(console, {
        type: 'text',
        override: true,
      });
      console.log(logmessage);
      sinon.assert.calledWith(logstub.log, 'INFO:', new Date().toISOString(), logmessage);
    });
    test('{ message: "logmessage", timestamp: "timestamp" }', async () => {
      const logmessage = { message: 'logmessage', timestamp: 'timestamp' };
      log(console, {
        type: 'text',
        override: true,
      });
      console.log(logmessage);
      sinon.assert.calledWith(logstub.log, 'INFO:', new Date().toISOString(), logmessage);
    });
    test('{ message: "logmessage", extraparam: "extravalue" }', async () => {
      const logmessage = { message: 'logmessage', extraparam: 'extravalue' };
      log(console, {
        type: 'text',
        override: true,
      });
      console.log(logmessage);
      sinon.assert.calledWith(logstub.log, 'INFO:', new Date().toISOString(), logmessage);
    });
    test('error { message: "logmessage", extraparam: "extravalue" }', async () => {
      const logmessage = { message: 'logmessage', extraparam: 'extravalue' };
      log(console, {
        type: 'text',
        override: true,
      });
      console.error(logmessage);
      sinon.assert.calledWith(logstub.error, 'ERROR:', new Date().toISOString(), logmessage);
    });
    test('circular', async () => {
      const x = { message: 'logmessage', extraparam: 'extravalue' };
      const y = { message: 'logmessage', extraparam: 'extravalue', circular: x };
      x.y = y;
      log(console, {
        type: 'json',
        override: true,
      });
      console.error(x);
      sinon.assert.calledWith(logstub.error, {
        timestamp: new Date().toISOString(),
        type: ['technical'],
        level: 'ERROR',
        correlationId: sinon.match(v4),
        message: 'logmessage Extrainfo: {"extraparam":"extravalue","y":{"message":"logmessage","extraparam":"extravalue","circular":{"message":"logmessage","extraparam":"extravalue","y":"[Circular]"}}}',
      });
    });
  });
  await describe('{ level: error | warn | log | info | debug }', async () => {
    beforeEach(() => {
      if (console.isProxied) console.reset();
      sandbox2.restore();
      Object.keys(levels.consoleLevels).forEach((level) => {
        if (console[level].restore) console[level].restore();
        logstub[level] = sandbox2.spy(console, level);
      });
    });
    test('"unknown" (fallback to debug)', async () => {
      const logmessage = 'logmessage';
      log(console, {
        type: 'json',
        level: 'unknown',
        override: true,
      });
      console.debug(logmessage);
      console.info(logmessage);
      console.log(logmessage);
      console.warn(logmessage);
      console.error(logmessage);
      const result = {
        message: logmessage,
        timestamp: new Date().toISOString(),
        type: ['technical'],
        level: 'INFO',
        correlationId: 'ABCDEFAB-ABCD-4ABC-AABC-ABCDEFABCDEF',
      };
      sinon.assert.calledWith(logstub.debug, { ...result, level: 'DEBUG' });
      sinon.assert.calledWith(logstub.info, { ...result, level: 'INFO' });
      sinon.assert.calledWith(logstub.log, { ...result, level: 'INFO' });
      sinon.assert.calledWith(logstub.warn, { ...result, level: 'WARN' });
      sinon.assert.calledWith(logstub.error, { ...result, level: 'ERROR' });
      assert.equal(validator.validate(result, logschema).valid ,true)
    });
    test('"debug"', async () => {
      const logmessage = 'logmessage';
      log(console, {
        type: 'json',
        level: 'debug',
        override: true,
      });
      console.debug(logmessage);
      console.info(logmessage);
      console.log(logmessage);
      console.warn(logmessage);
      console.error(logmessage);
      const result = {
        message: logmessage,
        timestamp: new Date().toISOString(),
        type: ['technical'],
        level: 'INFO',
        correlationId: 'ABCDEFAB-ABCD-4ABC-AABC-ABCDEFABCDEF',
      };
      sinon.assert.calledWith(logstub.debug, { ...result, level: 'DEBUG' });
      sinon.assert.calledWith(logstub.info, { ...result, level: 'INFO' });
      sinon.assert.calledWith(logstub.log, { ...result, level: 'INFO' });
      sinon.assert.calledWith(logstub.warn, { ...result, level: 'WARN' });
      sinon.assert.calledWith(logstub.error, { ...result, level: 'ERROR' });
      assert.equal(validator.validate(result, logschema).valid ,true)
    });
    test('"info"', async () => {
      const logmessage = 'logmessage';
      log(console, {
        type: 'json',
        level: 'info',
        override: true,
      });
      console.debug(logmessage);
      console.info(logmessage);
      console.log(logmessage);
      console.warn(logmessage);
      console.error(logmessage);
      const result = {
        message: logmessage,
        timestamp: new Date().toISOString(),
        type: ['technical'],
        level: 'INFO',
        correlationId: 'ABCDEFAB-ABCD-4ABC-AABC-ABCDEFABCDEF',
      };
      sinon.assert.notCalled(logstub.debug);
      sinon.assert.calledWith(logstub.info, { ...result, level: 'INFO' });
      sinon.assert.calledWith(logstub.log, { ...result, level: 'INFO' });
      sinon.assert.calledWith(logstub.warn, { ...result, level: 'WARN' });
      sinon.assert.calledWith(logstub.error, { ...result, level: 'ERROR' });
      assert.equal(validator.validate(result, logschema).valid ,true)
    });
    test('"log"', async () => {
      const logmessage = 'logmessage';
      log(console, {
        type: 'json',
        level: 'log',
        override: true,
      });
      console.debug(logmessage);
      console.info(logmessage);
      console.log(logmessage);
      console.warn(logmessage);
      console.error(logmessage);
      const result = {
        message: logmessage,
        timestamp: new Date().toISOString(),
        type: ['technical'],
        level: 'INFO',
        correlationId: 'ABCDEFAB-ABCD-4ABC-AABC-ABCDEFABCDEF',
      };
      sinon.assert.notCalled(logstub.debug);
      sinon.assert.notCalled(logstub.info);
      sinon.assert.calledWith(logstub.log, { ...result, level: 'INFO' });
      sinon.assert.calledWith(logstub.warn, { ...result, level: 'WARN' });
      sinon.assert.calledWith(logstub.error, { ...result, level: 'ERROR' });
      assert.equal(validator.validate(result, logschema).valid ,true)
    });
    test('"warn"', async () => {
      const logmessage = 'logmessage';
      log(console, {
        type: 'json',
        level: 'warn',
        override: true,
      });
      console.debug(logmessage);
      console.info(logmessage);
      console.log(logmessage);
      console.warn(logmessage);
      console.error(logmessage);
      const result = {
        message: logmessage,
        timestamp: new Date().toISOString(),
        type: ['technical'],
        level: 'INFO',
        correlationId: 'ABCDEFAB-ABCD-4ABC-AABC-ABCDEFABCDEF',
      };
      sinon.assert.notCalled(logstub.debug);
      sinon.assert.notCalled(logstub.info);
      sinon.assert.notCalled(logstub.log);
      sinon.assert.calledWith(logstub.warn, { ...result, level: 'WARN' });
      sinon.assert.calledWith(logstub.error, { ...result, level: 'ERROR' });
      assert.equal(validator.validate(result, logschema).valid ,true)
    });
    test('"error"', async () => {
      const logmessage = 'logmessage';
      log(console, {
        type: 'json',
        level: 'error',
        override: true,
      });
      console.debug(logmessage);
      console.info(logmessage);
      console.log(logmessage);
      console.warn(logmessage);
      console.error(logmessage);
      const result = {
        message: logmessage,
        timestamp: new Date().toISOString(),
        type: ['technical'],
        level: 'INFO',
        correlationId: 'ABCDEFAB-ABCD-4ABC-AABC-ABCDEFABCDEF',
      };
      sinon.assert.notCalled(logstub.debug);
      sinon.assert.notCalled(logstub.info);
      sinon.assert.notCalled(logstub.log);
      sinon.assert.notCalled(logstub.warn);
      sinon.assert.calledWith(logstub.error, { ...result, level: 'ERROR' });
      assert.equal(validator.validate(result, logschema).valid ,true)
    });
  });
});
