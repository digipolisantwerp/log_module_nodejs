import assert from 'node:assert/strict';
import sinon from 'sinon';
import { levels } from '../lib/config/index.js';
import log from '../lib/index.js';

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
  describe('options', () => {
    it('"override":false ', async () => {
      const returnedlogger = log(console, {
        type: 'json',
        override: false,
      });
      assert.equal(returnedlogger.log.isProxy, true);
      assert.equal(console.log.isProxy, undefined);
    });
    it('"isProxy"', async () => {
      log(console, {
        type: 'json',
        override: true,
      });
      assert.equal(console.log.isProxy, true);
    });
    it('"override": true (default)', async () => {
      const returnedlogger = log(console, {
        type: 'json',
        override: true,
      });
      assert.equal(returnedlogger.log.isProxy, true);
      assert.equal(console.log.isProxy, true);
    });
    it('"override": true (set)', async () => {
      const returnedlogger = log(console, {
        type: 'json',
        override: true,
      });
      assert.equal(returnedlogger.log.isProxy, true);
      assert.equal(console.log.isProxy, true);
    });
    it('"getprop cover', async () => {
      const returnedlogger = log(console, {
        type: 'json',
        override: true,
      });
      assert.equal(returnedlogger.log.prop, undefined);
    });
  });
});
