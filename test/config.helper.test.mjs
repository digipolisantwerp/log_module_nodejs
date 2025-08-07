import assert from 'node:assert/strict';
import { setBooleanValue } from '../lib/config/index.js';

describe('Config Helper', () => {
  describe('setBooleanValue', () => {
    it('undefined should result in true', () => assert.equal(setBooleanValue(undefined, true) ,true));
    it('true should result in true', () => assert.equal(setBooleanValue(true) ,true));
    it('\'true\' should result in true', () => assert.equal(setBooleanValue('true') ,true));
    it('false should result in false', () => assert.equal(setBooleanValue(false) ,false));
    it('\'false\' should result in false', () => assert.equal(setBooleanValue('false') ,false));
    it('default true, false should result in false', () => assert.equal(setBooleanValue(false, true) ,false));
    it('default true, \'false\' should result in false', () => assert.equal(setBooleanValue('false', true) ,false));
    it('default true, \'true\' should result in true', () => assert.equal(setBooleanValue('true', true) ,true));
    it('default false, \'false\' should result in false', () => assert.equal(setBooleanValue('false', false) ,false));
    it('default false, \'true\' should result in true', () => assert.equal(setBooleanValue('true', false) ,true));
    it('default false, \'\' should result in true', () => assert.equal(setBooleanValue('', false) ,false));
    it('default true, \'\' should result in true', () => assert.equal(setBooleanValue('', true) ,true));
    it('default true, \'nonbool\' should result in true', () => assert.equal(setBooleanValue('nonbool', true) ,true));
    it('default false, \'nonbool\' should result in false', () => assert.equal(setBooleanValue('nonbool', false) ,false));
  });
});
