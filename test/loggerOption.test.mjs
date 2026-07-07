import assert from 'node:assert/strict';
import sinon from 'sinon';
import { test, describe, before, beforeEach, after, afterEach } from 'node:test';
import { levels } from '../lib/config/index.js';
import log from '../lib/index.js';

describe('Logs:', async () => {
    let sandbox;
    let sandbox2;
    let clock;
    const logstub = {};

    before(() => {
        if (console.isProxied) console.reset();
        sandbox2 = sinon.createSandbox();
        Object.keys(levels.consoleLevels).forEach((level) => {
            if (console[level].restore) console[level].restore();
            logstub[level] = sandbox2.spy(console, level);
        });
        clock = sinon.useFakeTimers(Date.now());
    });
    after(() => {
        clock.restore();
        sandbox2.restore();
    });
    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });
    afterEach(() => {
        sandbox.restore();
    });
    test('default log', async () => {
        console.log('hello');
        sinon.assert.calledWith(logstub.log, 'hello');
    });
    await describe('options', async () => {
        test('"override":false ', async () => {
            const returnedlogger = log(console, {
                type: 'json',
                override: false,
            });
            assert.equal(returnedlogger.log.isProxy, true);
            assert.equal(console.log.isProxy, undefined);
        });
        test('"isProxy"', async () => {
            log(console, {
                type: 'json',
                override: true,
            });
            assert.equal(console.log.isProxy, true);
        });
        test('"override": true (default)', async () => {
            const returnedlogger = log(console, {
                type: 'json',
                override: true,
            });
            assert.equal(returnedlogger.log.isProxy, true);
            assert.equal(console.log.isProxy, true);
        });
        test('"override": true (set)', async () => {
            const returnedlogger = log(console, {
                type: 'json',
                override: true,
            });
            assert.equal(returnedlogger.log.isProxy, true);
            assert.equal(console.log.isProxy, true);
        });
    test('"getprop cover', async () => {
      const returnedlogger = log(console, {
        type: 'json',
        override: true,
      });
      assert.equal(returnedlogger.log.prop, undefined);
    });
  });
});
