import { PAGINATION } from '../constants/index.js';

/**
 * Parse pagination parameters from query string.
 * Returns { page, limit, skip, sort }.
 */
export const parsePagination = (query) => {
  const page = Math.max(1, parseInt(query.page, 10) || PAGINATION.DEFAULT_PAGE);
  const limit = Math.min(
    PAGINATION.MAX_LIMIT,
    Math.max(1, parseInt(query.limit, 10) || PAGINATION.DEFAULT_LIMIT)
  );
  const skip = (page - 1) * limit;

  // Parse sort: ?sort=createdAt:desc or ?sort=-createdAt
  let sort = { createdAt: -1 };
  if (query.sort) {
    if (query.sort.includes(':')) {
      const [field, direction] = query.sort.split(':');
      sort = { [field]: direction === 'desc' ? -1 : 1 };
    } else {
      sort = { [query.sort.replace('-', '')]: query.sort.startsWith('-') ? -1 : 1 };
    }
  }

  return { page, limit, skip, sort };
};

/**
 * Build a paginated response object.
 */
export const buildPaginatedResponse = (items, total, { page, limit }) => ({
  items,
  pagination: {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    hasNext: page * limit < total,
    hasPrev: page > 1,
  },
});
