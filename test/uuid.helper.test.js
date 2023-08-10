const crypto = require('crypto');
const sinon = require('sinon');
const { expect } = require('chai');
const uuidHelper = require('../lib/helpers/uuid');

const v4 = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

describe('uuid Helper', () => {
  let sandbox;
  before((done) => {
    sandbox = sinon.createSandbox();
    done();
  });
  after((done) => {
    sandbox.restore();
    done();
  });
  it('uuidV4', () => {
    expect(uuidHelper.uuidV4()).to.match(v4);
  });
  it('uuidV4 fallback', () => {
    if (crypto.randomUUID) {
      sandbox.stub(crypto, 'randomUUID').value(undefined);
    }
    expect(uuidHelper.uuidV4()).to.match(v4);
  });
});
