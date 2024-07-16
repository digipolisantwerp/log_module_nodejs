const { expect } = require('chai');
const { setBooleanValue } = require('../lib/config');

describe('Config Helper', () => {
  describe('setBooleanValue', () => {
    it('undefined should result in true', () => expect(setBooleanValue(undefined, true)).to.equal(true));
    it('true should result in true', () => expect(setBooleanValue(true)).to.equal(true));
    it('\'true\' should result in true', () => expect(setBooleanValue('true')).to.equal(true));
    it('false should result in false', () => expect(setBooleanValue(false)).to.equal(false));
    it('\'false\' should result in false', () => expect(setBooleanValue('false')).to.equal(false));
    it('default true, false should result in false', () => expect(setBooleanValue(false, true)).to.equal(false));
    it('default true, \'false\' should result in false', () => expect(setBooleanValue('false', true)).to.equal(false));
    it('default true, \'true\' should result in true', () => expect(setBooleanValue('true', true)).to.equal(true));
    it('default false, \'false\' should result in false', () => expect(setBooleanValue('false', false)).to.equal(false));
    it('default false, \'true\' should result in true', () => expect(setBooleanValue('true', false)).to.equal(true));
    it('default false, \'\' should result in true', () => expect(setBooleanValue('', false)).to.equal(false));
    it('default true, \'\' should result in true', () => expect(setBooleanValue('', true)).to.equal(true));
    it('default true, \'nonbool\' should result in true', () => expect(setBooleanValue('nonbool', true)).to.equal(true));
    it('default false, \'nonbool\' should result in false', () => expect(setBooleanValue('nonbool', false)).to.equal(false));
  });
});
