export const filterArrByFilters = (array, filters) =>
  array.filter(element => {
    let result = false;
    for (let key of Object.keys(filters)) {
      if (element[key] !== filters[key]) {
        result = false;
        break;
      } else {
        result = true;
      }
    }
    return result;
  });
