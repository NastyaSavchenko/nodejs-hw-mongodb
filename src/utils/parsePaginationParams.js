function parseNumber(value, defaultValue = 10) {
  if (typeof value === 'undefined') {
    return defaultValue;
  }

  const parsedValue = parseInt(value);

  if (Number.isNaN(parsedValue) || parsedValue <= 0) {
    return defaultValue;
  }

  return parsedValue;
}

export function parsePaginationParams(params) {
  const { page, perPage } = params;

  const parsedPage = parseNumber(page, 1);
  const parsedPerPage = parseNumber(perPage, 10);
  return { page: parsedPage, perPage: parsedPerPage };
}
