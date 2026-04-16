import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod: MongoMemoryServer | undefined;
let app: INestApplication | undefined;

export async function bootApp(): Promise<INestApplication> {
  mongod = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongod.getUri();
  const { AppModule } = await import('../src/app.module');
  const module = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  app = module.createNestApplication();
  await app.init();
  return app;
}

export async function stopApp(): Promise<void> {
  if (app) {
    await app.close();
    app = undefined;
  }
  if (mongod) {
    await mongod.stop();
    mongod = undefined;
  }
}
