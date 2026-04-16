import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { startInMemoryMongo, stopInMemoryMongo } from './mongo-memory';

describe('Health (functional)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.MONGODB_URI = await startInMemoryMongo();
    const { AppModule } = await import('../src/app.module');
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await stopInMemoryMongo();
  });

  it('GET /health', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect({ status: 'ok', service: 'iota-trade-scanner' });
  });
});
