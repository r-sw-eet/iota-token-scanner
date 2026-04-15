import { Module } from '@nestjs/common';
import { ClaimsService } from './claims.service';
import { ClaimsController } from './claims.controller';
import { SnapshotModule } from '../snapshot/snapshot.module';

@Module({
  imports: [SnapshotModule],
  providers: [ClaimsService],
  controllers: [ClaimsController],
})
export class ClaimsModule {}
