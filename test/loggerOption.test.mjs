import sinon from 'sinon';
import * as chai from 'chai';
import { levels } from '../lib/config/index.js';
import log from '../lib/index.js';
import chaijson from 'chai-json-schema';

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
      expect(returnedlogger.log.isProxy).to.eql(true);
      expect(console.log.isProxy).to.eql(undefined);
    });
    it('"isProxy"', async () => {
      log(console, {
        type: 'json',
        override: true,
      });
      expect(console.log.isProxy).to.eql(true);
    });
    it('"override": true (default)', async () => {
      const returnedlogger = log(console, {
        type: 'json',
        override: true,
      });
      expect(returnedlogger.log.isProxy).to.eql(true);
      expect(console.log.isProxy).to.eql(true);
    });
    it('"override": true (set)', async () => {
      const returnedlogger = log(console, {
        type: 'json',
        override: true,
      });
      expect(returnedlogger.log.isProxy).to.eql(true);
      expect(console.log.isProxy).to.eql(true);
    });
    it('"getprop cover', async () => {
      const returnedlogger = log(console, {
        type: 'json',
        override: true,
      });
      expect(returnedlogger.log.prop).to.eql(undefined);
    });
  });
});
