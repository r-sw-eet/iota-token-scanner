import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Snapshot, SnapshotSchema } from './schemas/snapshot.schema';
import { SnapshotService } from './snapshot.service';
import { SnapshotController } from './snapshot.controller';
import { IotaModule } from '../iota/iota.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Snapshot.name, schema: SnapshotSchema }]),
    IotaModule,
  ],
  providers: [SnapshotService],
  controllers: [SnapshotController],
  exports: [SnapshotService],
})
export class SnapshotModule {}
