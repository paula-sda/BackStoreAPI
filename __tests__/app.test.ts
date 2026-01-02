import request from 'supertest';
import express from 'express';

const app = express();
app.get('/', (req, res) => res.send('API funcionando'));

describe('GET /', () => {
  it('should return API funcionando', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toBe('API funcionando');
  });
});
