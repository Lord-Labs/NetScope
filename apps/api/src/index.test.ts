import assert from 'node:assert/strict';
import test from 'node:test';
import app from './index.ts';

test('health reports foundation liveness without claiming live collection or auth', async () => {
  const response = await app.request('/health');
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    status: 'ok', service: 'netscope-api', version: '0.0.0',
    capabilities: { measurement_ingest: false, authentication: false },
  });
});

test('unimplemented upload never acknowledges imaginary stored usage', async () => {
  const response = await app.request('/v1/usage', { method: 'POST', body: '{}' });
  assert.equal(response.status, 404);
  assert.deepEqual(await response.json(), { error: 'not_found' });
});
