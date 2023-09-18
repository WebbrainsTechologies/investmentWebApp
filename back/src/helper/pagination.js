const paginate = (data, page, limit) => {
  page = page ? page : 1;
  limit = limit ? limit : 10;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = data.length;
  const totalPages = total !== 0 ? Math.ceil(total / limit) : 1;

  const results = {};

  if (endIndex < total) {
    results.hasNextPage = true;
    results.nextPage = page + 1;
  } else {
    results.hasNextPage = false;
    results.nextPage = null;
  }

  if (startIndex > 0) {
    results.hasPrevPage = true;
    results.prevPage = page - 1;
  } else {
    results.hasPrevPage = false;
    results.prevPage = null;
  }
  // console.log(results, "check27", data);
  // console.log(startIndex, "check28", endIndex, page);
  results.totalDocs = total;
  results.totalPages = totalPages;
  results.page = page;
  results.limit = limit;
  results.docs = data.slice(startIndex, endIndex);
  return results;
};

module.exports = paginate;
