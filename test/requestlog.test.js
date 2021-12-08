const sinon = require('sinon');
const chai = require('chai');
const { levels } = require('../lib/config');
const log = require('../lib');
chai.use(require('chai-json-schema'));

describe('Logs: -> ', () => {
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
  it('default log', async () => {
    const requestlogger = log(console, {
      type: 'json',
    });
    requestlogger.log(1, 2, 3);
    sinon.assert.calledWith(logstub.log, {
      timestamp: new Date().toISOString(),
      type: ['technical'],
      level: 'INFO',
      correlationId: '',
      message: '1 2 3',
    });
  });
  describe('{ type: json }', () => {
    it('"requestlog"', async () => {
      const requestlogger = log(console, {
        type: 'json',
        override: false,
      });
      const logmessage = {
        timestamp: '2020-05-29T08:09:34.539Z',
        type: ['application'],
        level: 'INFO',
        correlationId: 'd80db7ea-fe4c-4df5-afe1-1b675e19921f',
        request: {
          headers: {
            key: 'value',
            key2: 'value2',

          },
          host: 'http://www.api.com',
          path: '/resource/id?requestParam=value&requestParam2=value',
          payload: '{ ... }',
          method: 'POST',

        },
        response: {
          headers: {
            key: 'value',
            key2: 'value2',
          },
          payload: '{ ...  }',
          status: 200,
          duration: 25,
        },
        protocol: 'HTTP',
      };
      requestlogger.log(logmessage);
      sinon.assert.calledWith(logstub.log, logmessage);
    });
  });
});
