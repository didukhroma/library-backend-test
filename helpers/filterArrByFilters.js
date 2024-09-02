export const filterArrByFilters = (array, searchQuery) =>
  array.filter(element => Object.values(element).includes(searchQuery));
