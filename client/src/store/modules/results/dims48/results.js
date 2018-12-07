function removeSeconds(timestamp) {
  const date = new Date(timestamp);
  date.setMilliseconds(0);
  date.setSeconds(0);
  return date.getTime();
}

function compareValues(operator, testValue, inputValue, type) {
  if (type === String) {
    testValue = testValue.toLowerCase();
    inputValue = inputValue.toLowerCase();
  }
  if (type === Date) {
    testValue = removeSeconds(testValue);
    inputValue = removeSeconds(inputValue);
  }

  let value = false;
  switch (operator) {
    case "=":
      value = testValue === inputValue;
      break;
    case "≠":
      value = testValue !== inputValue;
      break;
    case "≤":
      value = testValue <= inputValue;
      break;
    case "≥":
      value = testValue >= inputValue;
      break;
    case "Bevat":
      value = testValue.includes(inputValue);
      break;
    default:
      value = eval(`${testValue}${operator}${inputValue}`);
      break;
  }
  return value;
}

function getValueByPropertyPath(object, path) {
  return [object].concat(path.split(".")).reduce((a, b) => a[b]);
}

function applyFilter(filters, property, value, operator, type) {
  return filters.filter(filter =>
    compareValues(
      operator,
      getValueByPropertyPath(filter, property),
      value,
      type
    )
  );
}

function initialState() {
  return {
    resultFeed: null,
    filters: []
  };
}

function deepClone(structure) {
  return structure.map(a => Object.assign({}, a));
}

export default {
  namespaced: true,
  state: initialState,
  getters: {
    filteredFeed: function(state) {
      let results = deepClone(state.resultFeed);
      state.filters.forEach(filter => {
        results = applyFilter(
          results,
          filter.property,
          filter.value,
          filter.operator,
          filter.type
        );
      });
      return results;
    }
  },
  actions: {},
  mutations: {
    setResultFeed: function(state, resultFeed) {
      state.resultFeed = resultFeed;
    },
    removeFilter: function(state, id) {
      state.filters.splice(id, 1);
    },
    clearFilters: function(state) {
      state.filters = [];
    },
    addFilter: function(state, filter) {
      state.filters.push(filter);
    }
  }
};