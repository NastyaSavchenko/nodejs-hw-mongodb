function parseSortBy(value) {
  if (typeof value === 'undefined') {
    return '_id';
  }

  const keys = ['_id', 'name', 'year', 'createdAt', 'updatedAt'];

  if (!keys.includes(value)) {
    return '_id';
  }

  return value;
}

function parseSortOrder(value) {
  if (typeof value === 'undefined') {
    return 'asc';
  }

  const validOrders = ['asc', 'desc'];
  return validOrders.includes(value) ? value : 'asc';
}

export function parseSortParams(query) {
  const { sortBy, sortOrder } = query;

  const parsedSortBy = parseSortBy(sortBy);
  const parsedSortOrder = parseSortOrder(sortOrder);

  return {
    sortBy: parsedSortBy,
    sortOrder: parsedSortOrder,
  };
}
