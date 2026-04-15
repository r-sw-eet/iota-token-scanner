import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EcosystemSnapshot, EcosystemSnapshotSchema } from './schemas/ecosystem-snapshot.schema';
import { EcosystemService } from './ecosystem.service';
import { EcosystemController } from './ecosystem.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: EcosystemSnapshot.name, schema: EcosystemSnapshotSchema }]),
  ],
  providers: [EcosystemService],
  controllers: [EcosystemController],
})
export class EcosystemModule {}
