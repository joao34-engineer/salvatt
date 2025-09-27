// tests/health.test.ts
import request from 'supertest';
import app from '../src/app';

describe('Health Endpoint', () => {
  it('GET /api/health should return 200 and { status: "ok" }', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
  });
});
