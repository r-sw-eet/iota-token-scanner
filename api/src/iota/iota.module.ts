import { Module } from '@nestjs/common';
import { IotaService } from './iota.service';

@Module({
  providers: [IotaService],
  exports: [IotaService],
})
export class IotaModule {}
