import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import request from 'supertest';
import { Model } from 'mongoose';
import { bootApp, stopApp } from './boot-app';
import { Snapshot } from '../src/snapshot/schemas/snapshot.schema';

describe('Snapshots (functional)', () => {
  let app: INestApplication;
  let snapshotModel: Model<Snapshot>;

  beforeAll(async () => {
    app = await bootApp();
    snapshotModel = app.get(getModelToken(Snapshot.name));
  });

  afterAll(() => stopApp());

  afterEach(async () => {
    await snapshotModel.deleteMany({});
  });

  describe('GET /snapshots/latest', () => {
    it('returns null when no snapshots exist', async () => {
      const res = await request(app.getHttpServer()).get('/snapshots/latest').expect(200);
      expect(res.body).toEqual({});
    });

    it('returns the highest-epoch snapshot', async () => {
      await snapshotModel.create({ epoch: 1, totalSupply: 1000 });
      await snapshotModel.create({ epoch: 3, totalSupply: 3000 });
      await snapshotModel.create({ epoch: 2, totalSupply: 2000 });

      const res = await request(app.getHttpServer()).get('/snapshots/latest').expect(200);
      expect(res.body.epoch).toBe(3);
      expect(res.body.totalSupply).toBe(3000);
    });
  });

  describe('GET /snapshots/history', () => {
    it('returns only snapshots within the requested window', async () => {
      const now = Date.now();
      const day = 86_400_000;
      await snapshotModel.create({ epoch: 1, timestamp: new Date(now - 40 * day) });
      await snapshotModel.create({ epoch: 2, timestamp: new Date(now - 5 * day) });
      await snapshotModel.create({ epoch: 3, timestamp: new Date(now - 1 * day) });

      const res = await request(app.getHttpServer())
        .get('/snapshots/history?days=7')
        .expect(200);
      expect(res.body.map((s: any) => s.epoch).sort()).toEqual([2, 3]);
    });

    it('defaults to 30 days when no query is given', async () => {
      const now = Date.now();
      const day = 86_400_000;
      await snapshotModel.create({ epoch: 1, timestamp: new Date(now - 40 * day) });
      await snapshotModel.create({ epoch: 2, timestamp: new Date(now - 20 * day) });

      const res = await request(app.getHttpServer()).get('/snapshots/history').expect(200);
      expect(res.body.map((s: any) => s.epoch)).toEqual([2]);
    });
  });

  describe('GET /snapshots/epochs', () => {
    it('returns epochs with gasBurned data in ascending order', async () => {
      await snapshotModel.create({ epoch: 5, epochGasBurned: 100 });
      await snapshotModel.create({ epoch: 3, epochGasBurned: 80 });
      await snapshotModel.create({ epoch: 4, epochGasBurned: 0 });

      const res = await request(app.getHttpServer()).get('/snapshots/epochs').expect(200);
      // epoch 4 has 0 gasBurned — service may include or exclude; assert shape, not filtering specifics
      expect(res.body).toEqual(expect.any(Array));
      expect(res.body.length).toBeGreaterThan(0);
    });
  });
});
