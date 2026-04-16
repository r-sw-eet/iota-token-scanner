import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { EcosystemService } from './ecosystem.service';
import { EcosystemSnapshot } from './schemas/ecosystem-snapshot.schema';
import { ProjectDefinition } from './projects';

jest.mock('./projects', () => {
  const projects: ProjectDefinition[] = [
    {
      name: 'AddrOnly',
      layer: 'L1',
      category: 'Test',
      description: 'Matches on specific package address.',
      urls: [],
      teamId: null,
      match: { packageAddresses: ['0xABCDEF'] },
    },
    {
      name: 'Exact',
      layer: 'L1',
      category: 'Test',
      description: 'Matches only if module set equals exactly.',
      urls: [],
      teamId: null,
      match: { exact: ['foo', 'bar'] },
    },
    {
      name: 'AllRequired',
      layer: 'L1',
      category: 'Test',
      description: 'All required modules must be present.',
      urls: [],
      teamId: null,
      match: { all: ['a', 'b'] },
    },
    {
      name: 'AnyOne',
      layer: 'L1',
      category: 'Test',
      description: 'At least one of listed modules must be present.',
      urls: [],
      teamId: null,
      match: { any: ['x', 'y'] },
    },
    {
      name: 'MinMods',
      layer: 'L1',
      category: 'Test',
      description: 'Requires a minimum module count.',
      urls: [],
      teamId: null,
      match: { minModules: 3 },
    },
  ];
  return { ALL_PROJECTS: projects, ProjectDefinition: undefined };
});

describe('EcosystemService.matchProject', () => {
  let service: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EcosystemService,
        { provide: getModelToken(EcosystemSnapshot.name), useValue: {} },
      ],
    }).compile();
    service = module.get(EcosystemService);
  });

  const match = (mods: string[], addr = '0x0') =>
    service.matchProject(new Set(mods), addr);

  it('matches by package address (case-insensitive)', () => {
    expect(match([], '0xabcdef').name).toBe('AddrOnly');
    expect(match([], '0xABCDEF').name).toBe('AddrOnly');
  });

  it('falls through when packageAddresses does not match', () => {
    // Module set matches nothing else → null
    expect(match([], '0xnope')).toBeNull();
  });

  it('matches exact module set', () => {
    expect(match(['foo', 'bar']).name).toBe('Exact');
  });

  it('rejects exact match when set differs', () => {
    // 'foo' alone → no exact match, falls through. ['foo','bar','baz'] → set too large for Exact, falls through.
    expect(match(['foo'])).toBeNull();
    expect(match(['foo', 'bar', 'baz']).name).toBe('MinMods');
  });

  it('matches "all" when all required modules present', () => {
    expect(match(['a', 'b']).name).toBe('AllRequired');
    expect(match(['a', 'b', 'c']).name).toBe('AllRequired');
  });

  it('rejects "all" when a required module is missing', () => {
    expect(match(['a'])).toBeNull();
  });

  it('matches "any" when at least one listed module is present', () => {
    expect(match(['x']).name).toBe('AnyOne');
    expect(match(['y', 'z']).name).toBe('AnyOne');
  });

  it('matches minModules when module count meets threshold', () => {
    expect(match(['m1', 'm2', 'm3']).name).toBe('MinMods');
  });

  it('returns null when no matcher matches', () => {
    expect(match(['unknown'])).toBeNull();
  });
});
