import { Test } from '@nestjs/testing';
import { ClaimsService } from './claims.service';
import { SnapshotService } from '../snapshot/snapshot.service';

describe('ClaimsService', () => {
  let service: ClaimsService;
  const getLatest = jest.fn();

  beforeEach(async () => {
    getLatest.mockReset();
    const module = await Test.createTestingModule({
      providers: [
        ClaimsService,
        { provide: SnapshotService, useValue: { getLatest } },
      ],
    }).compile();
    service = module.get(ClaimsService);
  });

  it('returns empty array when no snapshot exists', async () => {
    getLatest.mockResolvedValue(null);
    expect(await service.getClaims()).toEqual([]);
  });

  describe('with a realistic snapshot', () => {
    beforeEach(() => {
      getLatest.mockResolvedValue({
        storagePrice: 76,
        storageFundTotal: 100_000,
        tlipEventCount: 45,
        weeklyInflation: 5_369_000,
      });
    });

    it('returns all 4 claim ids', async () => {
      const claims = await service.getClaims();
      expect(claims.map((c) => c.id)).toEqual([
        'weekly-storage',
        'storage-cost',
        'weekly-objects',
        'net-deflationary',
      ]);
    });

    it('computes weekly-storage ratio: 5.8M claimed vs 100k real → 58x', async () => {
      const [storage] = await service.getClaims();
      expect(storage.ratio).toBe('58x overstated');
    });

    it('computes storage-cost from protocol config (76 NANOS/unit * 100 units * 500 bytes / 1e9)', async () => {
      const claims = await service.getClaims();
      const cost = claims.find((c) => c.id === 'storage-cost')!;
      expect(cost.realityValue).toBeCloseTo(0.0038, 4);
      expect(cost.ratio).toMatch(/\d+x overstated/);
    });

    it('computes weekly-objects ratio: 225k / 45 → 5000x', async () => {
      const claims = await service.getClaims();
      const obj = claims.find((c) => c.id === 'weekly-objects')!;
      expect(obj.ratio).toBe('5000x overstated');
    });

    it('reports "no production activity" when tlipEventCount is zero', async () => {
      getLatest.mockResolvedValue({
        storagePrice: 76,
        storageFundTotal: 100_000,
        tlipEventCount: 0,
        weeklyInflation: 5_369_000,
      });
      const claims = await service.getClaims();
      expect(claims.find((c) => c.id === 'weekly-objects')!.ratio).toBe('No production activity found');
    });

    it('defaults storagePrice to 76 when missing', async () => {
      getLatest.mockResolvedValue({
        storagePrice: undefined,
        storageFundTotal: 100_000,
        tlipEventCount: 10,
        weeklyInflation: 5_369_000,
      });
      const claims = await service.getClaims();
      // Same computation as 76 case above
      expect(claims.find((c) => c.id === 'storage-cost')!.realityValue).toBeCloseTo(0.0038, 4);
    });
  });
});
