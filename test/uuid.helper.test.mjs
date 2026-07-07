import crypto from 'crypto';
import sinon from 'sinon';
import { test, describe, before, beforeEach, after, afterEach } from 'node:test';
import uuidHelper from '../lib/helpers/uuid.js';

const v4 = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

describe('uuid Helper', () => {
  let sandbox;
  before(() => {
    sandbox = sinon.createSandbox();
  });
  after(() => {
    sandbox.restore();
  });
  test('uuidV4', () => {
    if(!v4.test(uuidHelper.uuidV4())) throw new Error("doesn't match");
  });
  test('uuidV4 fallback', () => {
    if (crypto.randomUUID) {
      sandbox.stub(crypto, 'randomUUID').value(undefined);
    }
    if(!v4.test(uuidHelper.uuidV4())) throw new Error("doesn't match");
  });
});
