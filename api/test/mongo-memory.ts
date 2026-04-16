import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod: MongoMemoryServer | undefined;

export async function startInMemoryMongo(): Promise<string> {
  mongod = await MongoMemoryServer.create();
  return mongod.getUri();
}

export async function stopInMemoryMongo(): Promise<void> {
  if (mongod) await mongod.stop();
  mongod = undefined;
}
