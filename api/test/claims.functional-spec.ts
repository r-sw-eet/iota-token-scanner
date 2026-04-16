import { INestApplication } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import request from 'supertest';
import { Model } from 'mongoose';
import { bootApp, stopApp } from './boot-app';
import { Snapshot } from '../src/snapshot/schemas/snapshot.schema';

describe('Claims (functional)', () => {
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

  it('returns [] when no snapshot is stored', async () => {
    const res = await request(app.getHttpServer()).get('/claims').expect(200);
    expect(res.body).toEqual([]);
  });

  it('returns 4 claims derived from the latest snapshot', async () => {
    await snapshotModel.create({
      epoch: 1,
      storagePrice: 76,
      storageFundTotal: 100_000,
      tlipEventCount: 45,
      weeklyInflation: 5_369_000,
    });

    const res = await request(app.getHttpServer()).get('/claims').expect(200);
    expect(res.body).toHaveLength(4);
    expect(res.body.map((c: any) => c.id)).toEqual([
      'weekly-storage',
      'storage-cost',
      'weekly-objects',
      'net-deflationary',
    ]);
  });
});
