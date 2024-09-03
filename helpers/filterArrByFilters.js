export const filterArrByFilters = (array, searchQuery) =>
  array.filter(element => {
    for (let value in element) {
      if (
        element[value]
          .toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      ) {
        return true;
      }
    }
  });
