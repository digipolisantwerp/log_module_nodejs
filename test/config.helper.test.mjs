import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { setBooleanValue } from '../lib/config/index.js';

describe('Config Helper', async () => {
    await describe('setBooleanValue', async () => {
        await test('true should result in true', () => assert.deepEqual(setBooleanValue(true), true));
        await test('\'true\' should result in true', () => assert.deepEqual(setBooleanValue('true'), true));
        await test('false should result in false', () => assert.deepEqual(setBooleanValue(false), false));
        await test('\'false\' should result in false', () => assert.deepEqual(setBooleanValue('false'), false));
        await test('default true, false should result in false', () => assert.deepEqual(setBooleanValue(false, true), false));
        await test('default true, \'false\' should result in false', () => assert.deepEqual(setBooleanValue('false', true), false));
        await test('default true, \'true\' should result in true', () => assert.deepEqual(setBooleanValue('true', true), true));
        await test('default false, \'false\' should result in false', () => assert.deepEqual(setBooleanValue('false', false), false));
        await test('default false, \'true\' should result in true', () => assert.deepEqual(setBooleanValue('true', false), true));
        await test('default false, \'\' should result in true', () => assert.deepEqual(setBooleanValue('', false), false));
        await test('default true, \'\' should result in true', () => assert.deepEqual(setBooleanValue('', true), true));
        await test('default true, \'nonbool\' should result in true', () => assert.deepEqual(setBooleanValue('nonbool', true), true));
        await test('default false, \'nonbool\' should result in false', () => assert.deepEqual(setBooleanValue('nonbool', false), false));
    });
});
