import sinon from 'sinon';
import * as chai from 'chai';
import { levels } from '../lib/config/index.js';
import uuidhelper from '../lib/helpers/uuid.js';
import log from '../lib/index.js';
import logschema from './data/logschema.json' with { type: "json"  };
import chaijson from 'chai-json-schema';

const v4 = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$|/i;

const { expect } = chai;
chai.use(chaijson);

describe('Logs:', () => {
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
    sandbox.stub(uuidhelper, 'uuidV4').returns('ABCDEFAB-ABCD-4ABC-AABC-ABCDEFABCDEF');
    done();
  });
  afterEach(() => {
    sandbox.restore();
  });
  it('default log', async () => {
    console.log('hello');
    sinon.assert.calledWith(logstub.log, 'hello');
  });
  describe('{ type: json }', () => {
    it('"logmessage"', async () => {
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
      expect(result).to.be.jsonSchema(logschema);
    });
    it('{ message: "logmessage" }', async () => {
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
      expect(result).to.be.jsonSchema(logschema);
    });
    it('{ timestamp: "timestamp" }', async () => {
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
    it('{ message: "logmessage", timestamp: "timestamp" }', async () => {
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
    it('{ message: "logmessage", type: "mytype" }', async () => {
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
    it('{ message: "logmessage", type: ["mytype", "mytype2"] }', async () => {
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
    it('{ message: "logmessage", extraparam: "extravalue" }', async () => {
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
    it('new Error(\'errormessage\')', async () => {
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
  });
  describe('{ type: silent }', () => {
    it('"logmessage"', async () => {
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
  describe('{ type: log }', () => {
    it('"logmessage"', async () => {
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
    it('"logmessage" fallback to log for unknown', async () => {
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
    it('{ message: "logmessage" }', async () => {
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
    it('{ timestamp: "timestamp" }', async () => {
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
    it('{ message: "logmessage", timestamp: "timestamp" }', async () => {
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
    it('{ message: "logmessage", extraparam: "extravalue" }', async () => {
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
    it('{ message: "logmessage", extraparam: buffer }', async () => {
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
  describe('{ type: text }', () => {
    it('"logmessage"', async () => {
      const logmessage = 'logmessage';
      log(console, {
        type: 'text',
        override: true,
      });
      console.log(logmessage);
      sinon.assert.calledWith(logstub.log, 'INFO:', new Date().toISOString(), logmessage);
    });
    it('{ message: "logmessage" }', async () => {
      const logmessage = { message: 'logmessage' };
      log(console, {
        type: 'text',
        override: true,
      });
      console.log(logmessage);
      sinon.assert.calledWith(logstub.log, 'INFO:', new Date().toISOString(), logmessage);
    });
    it('{ timestamp: "timestamp" }', async () => {
      const logmessage = { timestamp: 'timestamp' };
      log(console, {
        type: 'text',
        override: true,
      });
      console.log(logmessage);
      sinon.assert.calledWith(logstub.log, 'INFO:', new Date().toISOString(), logmessage);
    });
    it('{ message: "logmessage", timestamp: "timestamp" }', async () => {
      const logmessage = { message: 'logmessage', timestamp: 'timestamp' };
      log(console, {
        type: 'text',
        override: true,
      });
      console.log(logmessage);
      sinon.assert.calledWith(logstub.log, 'INFO:', new Date().toISOString(), logmessage);
    });
    it('{ message: "logmessage", extraparam: "extravalue" }', async () => {
      const logmessage = { message: 'logmessage', extraparam: 'extravalue' };
      log(console, {
        type: 'text',
        override: true,
      });
      console.log(logmessage);
      sinon.assert.calledWith(logstub.log, 'INFO:', new Date().toISOString(), logmessage);
    });
    it('error { message: "logmessage", extraparam: "extravalue" }', async () => {
      const logmessage = { message: 'logmessage', extraparam: 'extravalue' };
      log(console, {
        type: 'text',
        override: true,
      });
      console.error(logmessage);
      sinon.assert.calledWith(logstub.error, 'ERROR:', new Date().toISOString(), logmessage);
    });
    it('circular', async () => {
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
  describe('{ level: error | warn | log | info | debug }', () => {
    beforeEach((done) => {
      if (console.isProxied) console.reset();
      sandbox2.restore();
      Object.keys(levels.consoleLevels).forEach((level) => {
        if (console[level].restore) console[level].restore();
        logstub[level] = sandbox2.spy(console, level);
      });
      done();
    });
    it('"unknown" (fallback to debug)', async () => {
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
      expect(result).to.be.jsonSchema(logschema);
    });
    it('"debug"', async () => {
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
      expect(result).to.be.jsonSchema(logschema);
    });
    it('"info"', async () => {
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
      expect(result).to.be.jsonSchema(logschema);
    });
    it('"log"', async () => {
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
      expect(result).to.be.jsonSchema(logschema);
    });
    it('"warn"', async () => {
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
      expect(result).to.be.jsonSchema(logschema);
    });
    it('"error"', async () => {
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
      expect(result).to.be.jsonSchema(logschema);
    });
  });
});
