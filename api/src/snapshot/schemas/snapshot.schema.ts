import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Snapshot extends Document {
  @Prop({ required: true, unique: true })
  epoch: number;

  @Prop()
  timestamp: Date;

  @Prop()
  totalSupply: number;

  @Prop()
  circulatingSupply: number;

  @Prop()
  circulatingPercentage: number;

  @Prop()
  totalStaked: number;

  @Prop()
  stakingRatio: number;

  @Prop()
  storageFundTotal: number;

  @Prop()
  storageFundNonRefundable: number;

  @Prop()
  validatorCount: number;

  @Prop()
  validatorAvgApy: number;

  @Prop()
  validatorTargetReward: number;

  @Prop()
  weeklyInflation: number;

  @Prop()
  networkTotalTransactions: number;

  @Prop()
  referenceGasPrice: number;

  @Prop()
  storagePrice: number;

  @Prop()
  checkpointCount: number;

  // Gas burn / deflation data (from previous epoch)
  @Prop()
  epochGasBurned: number;

  @Prop()
  epochTransactions: number;

  @Prop()
  epochStorageNetInflow: number;

  @Prop()
  gasPerTransaction: number;
}

export const SnapshotSchema = SchemaFactory.createForClass(Snapshot);
