const sinon = require('sinon');
const chai = require('chai');
const log = require('../lib');
const logschema = require('./data/logschema.json');

const { expect } = chai;
chai.use(require('chai-json-schema'));

describe('Logs:', () => {
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
  it('default log', async () => {
    const logspy = sandbox.stub(console, 'log');
    console.log('hello');
    sinon.assert.calledWith(logspy, 'hello');
  });
  describe('{ type: json }', () => {
    it('"logmessage"', async () => {
      const logmessage = 'logmessage';
      const logspy = sandbox.stub(console, 'log');
      log(console, {
        type: 'json',
      });
      console.log(logmessage);
      const result = {
        message: logmessage,
        timestamp: new Date().toISOString(),
        type: ['technical'],
        level: 'INFO',
        correlationId: '',
      };
      sinon.assert.calledWith(logspy, result);
      expect(result).to.be.jsonSchema(logschema);
    });
    it('{ message: "logmessage" }', async () => {
      const logmessage = { message: 'logmessage' };
      const logspy = sandbox.stub(console, 'log');
      log(console, {
        type: 'json',
      });
      console.log(logmessage);
      const result = {
        message: 'logmessage',
        timestamp: new Date().toISOString(),
        type: ['technical'],
        level: 'INFO',
        correlationId: '',
      };
      sinon.assert.calledWith(logspy, result);
      expect(result).to.be.jsonSchema(logschema);
    });
    it('{ timestamp: "timestamp" }', async () => {
      const logmessage = { timestamp: 'timestamp' };
      const logspy = sandbox.stub(console, 'log');
      log(console, {
        type: 'json',
      });
      console.log(logmessage);
      const result = {
        message: '',
        timestamp: 'timestamp',
        type: ['technical'],
        level: 'INFO',
        correlationId: '',
      };
      sinon.assert.calledWith(logspy, result);
    });
    it('{ message: "logmessage", timestamp: "timestamp" }', async () => {
      const logmessage = { message: 'logmessage', timestamp: 'timestamp' };
      const logspy = sandbox.stub(console, 'log');
      log(console, {
        type: 'json',
      });
      console.log(logmessage);
      sinon.assert.calledWith(logspy, {
        message: logmessage.message,
        timestamp: 'timestamp',
        type: ['technical'],
        level: 'INFO',
        correlationId: '',
      });
    });
    it('{ message: "logmessage", extraparam: "extravalue" }', async () => {
      const logmessage = { message: 'logmessage', extraparam: 'extravalue' };
      const logspy = sandbox.stub(console, 'log');
      log(console, {
        type: 'json',
      });
      console.log(logmessage);
      sinon.assert.calledWith(logspy, {
        message: 'logmessage Extrainfo: {"extraparam":"extravalue"}',
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
      const logspy = sandbox.stub(console, 'log');
      log(console, {
        type: 'log',
      });
      console.log(logmessage);
      const result = JSON.stringify({
        message: logmessage,
        timestamp: new Date().toISOString(),
        type: ['technical'],
        level: 'INFO',
        correlationId: '',
      });
      sinon.assert.calledWith(logspy, result);
    });
    it('{ message: "logmessage" }', async () => {
      const logmessage = { message: 'logmessage' };
      const logspy = sandbox.stub(console, 'log');
      log(console, {
        type: 'log',
      });
      console.log(logmessage);
      sinon.assert.calledWith(logspy, JSON.stringify({
        message: logmessage.message,
        timestamp: new Date().toISOString(),
        type: ['technical'],
        level: 'INFO',
        correlationId: '',
      }));
    });
    it('{ timestamp: "timestamp" }', async () => {
      const logmessage = { timestamp: 'timestamp' };
      const logspy = sandbox.stub(console, 'log');
      log(console, {
        type: 'log',
      });
      console.log(logmessage);
      sinon.assert.calledWith(logspy, JSON.stringify({
        message: '',
        timestamp: 'timestamp',
        type: ['technical'],
        level: 'INFO',
        correlationId: '',
      }));
    });
    it('{ message: "logmessage", timestamp: "timestamp" }', async () => {
      const logmessage = { message: 'logmessage', timestamp: 'timestamp' };
      const logspy = sandbox.stub(console, 'log');
      log(console, {
        type: 'log',
      });
      console.log(logmessage);
      sinon.assert.calledWith(logspy, JSON.stringify({
        message: logmessage.message,
        timestamp: 'timestamp',
        type: ['technical'],
        level: 'INFO',
        correlationId: '',
      }));
    });
    it('{ message: "logmessage", extraparam: "extravalue" }', async () => {
      const logmessage = { message: 'logmessage', extraparam: 'extravalue' };
      const logspy = sandbox.stub(console, 'log');
      log(console, {
        type: 'log',
      });
      console.log(logmessage);
      sinon.assert.calledWith(logspy, JSON.stringify({
        message: 'logmessage Extrainfo: {"extraparam":"extravalue"}',
        timestamp: new Date().toISOString(),
        type: ['technical'],
        level: 'INFO',
        correlationId: '',
      }));
    });
  });
  describe('{ type: text }', () => {
    it('"logmessage"', async () => {
      const logmessage = 'logmessage';
      const logspy = sandbox.stub(console, 'log');
      log(console, {
        type: 'text',
      });
      console.log(logmessage);
      sinon.assert.calledWith(logspy, 'INFO:', new Date().toISOString(), logmessage);
    });
    it('{ message: "logmessage" }', async () => {
      const logmessage = { message: 'logmessage' };
      const logspy = sandbox.stub(console, 'log');
      log(console, {
        type: 'text',
      });
      console.log(logmessage);
      sinon.assert.calledWith(logspy, 'INFO:', new Date().toISOString(), logmessage);
    });
    it('{ timestamp: "timestamp" }', async () => {
      const logmessage = { timestamp: 'timestamp' };
      const logspy = sandbox.stub(console, 'log');
      log(console, {
        type: 'text',
      });
      console.log(logmessage);
      sinon.assert.calledWith(logspy, 'INFO:', new Date().toISOString(), logmessage);
    });
    it('{ message: "logmessage", timestamp: "timestamp" }', async () => {
      const logmessage = { message: 'logmessage', timestamp: 'timestamp' };
      const logspy = sandbox.stub(console, 'log');
      log(console, {
        type: 'text',
      });
      console.log(logmessage);
      sinon.assert.calledWith(logspy, 'INFO:', new Date().toISOString(), logmessage);
    });
    it('{ message: "logmessage", extraparam: "extravalue" }', async () => {
      const logmessage = { message: 'logmessage', extraparam: 'extravalue' };
      const logspy = sandbox.stub(console, 'log');
      log(console, {
        type: 'text',
      });
      console.log(logmessage);
      sinon.assert.calledWith(logspy, 'INFO:', new Date().toISOString(), logmessage);
    });
    it('{ message: "logmessage", extraparam: "extravalue" }', async () => {
      const logmessage = { message: 'logmessage', extraparam: 'extravalue' };
      const logspy = sandbox.stub(console, 'error');
      log(console, {
        type: 'text',
      });
      console.error(logmessage);
      sinon.assert.calledWith(logspy, 'ERROR:', new Date().toISOString(), logmessage);
    });
  });
  describe('{ type: fake }', () => {
    it('"logmessage"', async () => {
      const logmessage = 'logmessage';
      const logspy = sandbox.stub(console, 'log');
      log(console, {
        type: 'fake',
      });
      console.log(logmessage);
      sinon.assert.calledWith(logspy, JSON.stringify({
        message: 'logmessage',
        timestamp: new Date().toISOString(),
        type: ['technical'],
        level: 'INFO',
        correlationId: '',
      }));
    });
  });
});
