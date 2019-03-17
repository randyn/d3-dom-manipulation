// from data.js
const unique = (array) => 
  array.reduce((unique_items, item) =>
    !(unique_items.includes(item)) 
      ? unique_items.concat(item)
      : unique_items,
    []
  );

// Extend array object to be able to call unique on them
Array.prototype.unique = function() {return unique(this)};

const identity = value => value;

// Implementation of `flow` https://lodash.com/docs/4.17.11#flow
// Helps with composing functions
const pipe = (...functions) =>
  functions.reduce((prevFunction, nextFunction) =>
    (...args) => nextFunction(prevFunction(...args)),
    identity
  );

// Define different unique values we have
const countries = data.map(sighting_data => sighting_data.country).unique();
const states = data.map(sighting_data => sighting_data.state).unique();

// Data Filter functions
const dateFilter = (date, tableData) =>
  date == '' ? tableData : tableData.filter(sighting_data => sighting_data.datetime == date);

const domDateFilter = (data) => {
  date = d3.select('#datetime').property('value');
  return dateFilter(date, data);
}

const cityFilter = (city, tableData) =>
  city == '' ? tableData : tableData.filter(sighting_data => sighting_data.city === city.toLowerCase());

const domCityFilter = (data) => {
  city = d3.select('#city').property('value');
  return cityFilter(city, data);
}

const stateFilter = (state, tableData) =>
  state == '' ? tableData : tableData.filter(sighting_data => sighting_data.state === state.toLowerCase());

const domStateFilter = (data) => {
  state = d3.select('#state').property('value');
  return stateFilter(state, data)
};

// Base Update DOM functions
const appendTDAnd = (cell_text, row) => {
  if (typeof(row) == 'undefined') {
    return (row) => appendTDAnd(cell_text, row);
  }
  row.append('td')
    .html(cell_text);
  return row;
}

const appendSightingDataRow = (sighting_data, row) => {
  appendData = pipe(
    appendTDAnd(sighting_data.datetime),
    appendTDAnd(sighting_data.city),
    appendTDAnd(sighting_data.state),
    appendTDAnd(sighting_data.country),
    appendTDAnd(sighting_data.shape),
    appendTDAnd(sighting_data.durationMinutes),
    appendTDAnd(sighting_data.comments)
  );
  return appendData(row);
};

const clearTableBody = () => {
  d3.select('#ufo-table')
    .select('tbody')
      .html('')
}

const appendTable = (data) => {
  results_table = d3.select('#ufo-table')
                    .select('tbody');
  data.forEach(sighting_data => {
    result_row = results_table.append('tr');
    appendSightingDataRow(sighting_data, result_row);
  });
};

const refreshTable = (data) => {
  clearTableBody();
  appendTable(data);
}


const initStates = () => {
  d3.select('#state').append('option').text('');
  states.forEach((state) =>
    d3.select('#state').append('option').text(state)
  );
}
const init = () => {
  appendTable(data);
  initStates();
}


const handleFilterChange = () => {
  d3.event.preventDefault();
  allFilters = pipe(
    domDateFilter,
    domCityFilter,
    domStateFilter
  );

  filtered_data = allFilters(data);
  refreshTable(filtered_data);
}

d3.select('#filter-btn').on('click', handleFilterChange);

init();