import { Test } from '@nestjs/testing';
import { IotaService } from './iota.service';

describe('IotaService', () => {
  let service: IotaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [IotaService],
    }).compile();
    service = module.get(IotaService);
  });

  describe('nanosToIota', () => {
    it('converts zero', () => {
      expect(service.nanosToIota('0')).toBe(0);
    });

    it('converts 1 IOTA (1e9 nanos)', () => {
      expect(service.nanosToIota('1000000000')).toBe(1);
    });

    it('accepts bigint input', () => {
      expect(service.nanosToIota(1_000_000_000n)).toBe(1);
    });

    it('preserves 2 decimal places', () => {
      expect(service.nanosToIota('1234567890')).toBe(1.23);
    });

    it('handles supply-scale amounts', () => {
      // 4.6B IOTA total supply in nanos
      expect(service.nanosToIota('4600000000000000000')).toBe(4_600_000_000);
    });

    it('floors sub-cent precision (integer BigInt division)', () => {
      // 1.005 IOTA — 1005000000 nanos → (1005000000 / 10_000_000n) = 100n → 1.00
      expect(service.nanosToIota('1005000000')).toBe(1);
    });
  });
});
