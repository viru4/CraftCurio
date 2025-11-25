import mongoose from 'mongoose';
import Collector from '../models/Collector.js';

const COLLECTOR_ID_PREFIX = 'collector-';
const COLLECTOR_ID_PAD_LENGTH = 3;

const padCollectorNumber = (num) => String(num).padStart(COLLECTOR_ID_PAD_LENGTH, '0');

export const normalizeCollectorId = (rawValue = '') => {
  if (!rawValue) return rawValue;
  const trimmed = rawValue.trim().toLowerCase();

  const numericOnlyMatch = trimmed.match(/^(\d+)$/);
  if (numericOnlyMatch) {
    return `${COLLECTOR_ID_PREFIX}${padCollectorNumber(parseInt(numericOnlyMatch[1], 10))}`;
  }

  const collectorMatch = trimmed.match(/^collector[-_]?(\d+)$/);
  if (collectorMatch) {
    return `${COLLECTOR_ID_PREFIX}${padCollectorNumber(parseInt(collectorMatch[1], 10))}`;
  }

  return trimmed;
};

export const buildCollectorIdentifierFilter = (identifier) => {
  if (!identifier) return null;

  const trimmed = identifier.toString().trim();
  if (!trimmed) return null;

  const orConditions = [];
  if (mongoose.Types.ObjectId.isValid(trimmed)) {
    orConditions.push({ _id: trimmed }, { userId: trimmed });
  }

  const normalizedId = normalizeCollectorId(trimmed);
  orConditions.push({ id: normalizedId });
  if (normalizedId !== trimmed.toLowerCase()) {
    orConditions.push({ id: trimmed.toLowerCase() });
  }

  return { $or: orConditions };
};

const applyPopulate = (query, populate) => {
  if (!populate) return query;
  if (Array.isArray(populate)) {
    populate.forEach((field) => {
      query = query.populate(field);
    });
    return query;
  }
  return query.populate(populate);
};

export const findCollectorByIdentifier = async (identifier, { populate, lean = false } = {}) => {
  const filter = buildCollectorIdentifierFilter(identifier);
  if (!filter) return null;

  let query = Collector.findOne(filter);
  query = applyPopulate(query, populate);
  if (lean) {
    query = query.lean();
  }

  return query.exec();
};

export const generateCollectorId = async () => {
  const baseCount = await Collector.countDocuments();
  let attempt = 0;

  while (attempt < 1000) {
    const candidateNumber = baseCount + attempt + 1;
    const candidateId = `${COLLECTOR_ID_PREFIX}${padCollectorNumber(candidateNumber)}`;
    // Ensure uniqueness even if documents were deleted or created concurrently
    // eslint-disable-next-line no-await-in-loop
    const exists = await Collector.exists({ id: candidateId });
    if (!exists) {
      return candidateId;
    }
    attempt += 1;
  }

  throw new Error('Unable to generate a unique collector id');
};

export default {
  normalizeCollectorId,
  buildCollectorIdentifierFilter,
  findCollectorByIdentifier,
  generateCollectorId
};

