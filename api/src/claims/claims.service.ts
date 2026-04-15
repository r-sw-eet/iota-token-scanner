import { Injectable } from '@nestjs/common';
import { SnapshotService } from '../snapshot/snapshot.service';

export interface Claim {
  id: string;
  title: string;
  claimed: string;
  claimedValue: number;
  reality: string;
  realityValue: number;
  ratio: string;
  verdict: string;
  source: string;
}

@Injectable()
export class ClaimsService {
  constructor(private snapshotService: SnapshotService) {}

  async getClaims(): Promise<Claim[]> {
    const snapshot = await this.snapshotService.getLatest();
    if (!snapshot) return [];

    const storageCostPerByte = (snapshot.storagePrice || 76) * 100; // NANOS per byte
    const costPer500Bytes = (storageCostPerByte * 500) / 1_000_000_000;

    return [
      {
        id: 'weekly-storage',
        title: 'Weekly Storage Deposits',
        claimed: '5.8M IOTA locked per week',
        claimedValue: 5_800_000,
        reality: `${snapshot.storageFundTotal.toLocaleString()} IOTA total storage fund (cumulative, all time)`,
        realityValue: snapshot.storageFundTotal,
        ratio: `${Math.round(5_800_000 / Math.max(snapshot.storageFundTotal, 1))}x overstated`,
        verdict: 'The entire storage fund across all mainnet transactions is less than one claimed week of deposits.',
        source: 'iotax_getLatestIotaSystemState → storageFundTotalObjectStorageRebates',
      },
      {
        id: 'storage-cost',
        title: 'Storage Cost per Object',
        claimed: '25-30 IOTA per digital twin',
        claimedValue: 27.5,
        reality: `~${costPer500Bytes.toFixed(4)} IOTA per 500-byte object`,
        realityValue: costPer500Bytes,
        ratio: `~${Math.round(27.5 / Math.max(costPer500Bytes, 0.0001))}x overstated`,
        verdict: 'Protocol config: obj_data_cost_refundable=100 units/byte × storage_gas_price=76 NANOS/unit. Costs are in NANOS, not whole IOTA.',
        source: 'iota_getProtocolConfig → storage_gas_price, obj_data_cost_refundable',
      },
      {
        id: 'weekly-objects',
        title: 'Weekly Trade Objects Created',
        claimed: '225,000 new objects per week via ADAPT/TWIN',
        claimedValue: 225_000,
        reality: `${snapshot.tlipEventCount} TLIP contract events total (all time)`,
        realityValue: snapshot.tlipEventCount,
        ratio: snapshot.tlipEventCount > 0
          ? `${Math.round(225_000 / snapshot.tlipEventCount)}x overstated`
          : 'No production activity found',
        verdict: 'The TLIP contract (0xdeadee97bb...) has only test transactions. No production trade data from KenTrade or ADAPT found on mainnet.',
        source: 'GraphQL events query on TLIP package 0xdeadee97bb...',
      },
      {
        id: 'net-deflationary',
        title: 'Net Deflationary',
        claimed: 'Storage deposits exceed weekly inflation of 5.37M IOTA',
        claimedValue: snapshot.weeklyInflation,
        reality: `Weekly inflation: ${snapshot.weeklyInflation.toLocaleString()} IOTA. Storage fund total: ${snapshot.storageFundTotal.toLocaleString()} IOTA.`,
        realityValue: snapshot.storageFundTotal / Math.max(snapshot.weeklyInflation, 1) * 100,
        ratio: `Storage = ${(snapshot.storageFundTotal / Math.max(snapshot.weeklyInflation, 1) * 100).toFixed(3)}% of one week's inflation`,
        verdict: 'The entire cumulative storage fund is a fraction of a single week\'s inflation. Net deflationary status is not remotely close.',
        source: 'iota_getProtocolConfig → validator_target_reward (767,000 IOTA/day × 7)',
      },
    ];
  }
}
