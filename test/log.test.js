const sinon = require('sinon');
const chai = require('chai');
const { levels } = require('../lib/config');
const log = require('../lib');
const logschema = require('./data/logschema.json');

const { expect } = chai;
chai.use(require('chai-json-schema'));

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
        correlationId: '',
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
        correlationId: '',
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
        correlationId: '',
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
        correlationId: '',
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
        correlationId: '',
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
        correlationId: '',
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
        correlationId: '',
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
        correlationId: '',
      });
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
        correlationId: '',
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
        correlationId: '',
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
        correlationId: '',
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
        correlationId: '',
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
        correlationId: '',
        message: 'logmessage Extrainfo: {"extraparam":"extravalue"}',
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
    it('{ message: "logmessage", extraparam: "extravalue" }', async () => {
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
        correlationId: '',
        message: 'logmessage Extrainfo: {"extraparam":"extravalue","y":{"message":"logmessage","extraparam":"extravalue","circular":{"message":"logmessage","extraparam":"extravalue","y":"[Circular]"}}}',
      });
    });
  });
  describe('{ type: fake }', () => {
    it('"logmessage"', async () => {
      const logmessage = 'logmessage';
      log(console, {
        type: 'fake',
        override: true,
      });
      console.log(logmessage);
      sinon.assert.calledWith(logstub.log, JSON.stringify({
        timestamp: new Date().toISOString(),
        type: ['technical'],
        level: 'INFO',
        correlationId: '',
        message: 'logmessage',
      }));
    });
  });
});
