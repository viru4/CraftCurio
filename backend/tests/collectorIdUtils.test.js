import { Types } from 'mongoose';
import {
  normalizeCollectorId,
  buildCollectorIdentifierFilter
} from '../src/utils/collectorIdentifier.js';

describe('normalizeCollectorId', () => {
  test('pads numeric ids with leading zeros', () => {
    expect(normalizeCollectorId('7')).toBe('collector-007');
  });

  test('normalizes existing collector ids without hyphen', () => {
    expect(normalizeCollectorId('collector12')).toBe('collector-012');
  });

  test('keeps already-normalized ids intact', () => {
    expect(normalizeCollectorId('collector-042')).toBe('collector-042');
  });

  test('returns trimmed lowercase strings for custom values', () => {
    expect(normalizeCollectorId('  Custom-ID ')).toBe('custom-id');
  });
});

describe('buildCollectorIdentifierFilter', () => {
  test('returns null for falsy identifiers', () => {
    expect(buildCollectorIdentifierFilter('')).toBeNull();
  });

  test('includes _id and userId clauses for valid ObjectIds', () => {
    const objectId = new Types.ObjectId().toString();
    const filter = buildCollectorIdentifierFilter(objectId);

    expect(filter.$or).toEqual(
      expect.arrayContaining([
        { _id: objectId },
        { userId: objectId }
      ])
    );
  });

  test('includes normalized custom id clause', () => {
    const filter = buildCollectorIdentifierFilter('Collector9');

    expect(filter.$or).toContainEqual({ id: 'collector-009' });
  });
});

