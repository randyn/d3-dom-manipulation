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
const countries = data.map(sighting_data => sighting_data.country.toUpperCase())
                      .unique()
                      .sort();
const states = data.map(sighting_data => sighting_data.state.toUpperCase())
                   .unique()
                   .sort();
const shapes = data.map(sighting_data => sighting_data.shape)
                   .unique()
                   .sort();

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

const countryFilter = (country, tableData) => 
  country == '' ? tableData : tableData.filter(sighting_data => sighting_data.country === country.toLowerCase());

const domCountryFilter = (data) => {
  country = d3.select('#country').property('value');
  return countryFilter(country, data);
}

const shapeFilter = (shape, tableData) =>
  shape == '' ? tableData : tableData.filter(sighting_data => sighting_data.shape === shape.toLowerCase());

const domShapeFilter = (data) => {
  shape = d3.select('#shape').property('value');
  return shapeFilter(shape, data);
}

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

// Initialize page data and select values
const initStates = () => {
  d3.select('#state').append('option').text('');
  states.forEach((state) =>
    d3.select('#state').append('option').text(state)
  );
}

const initCountries = () => {
  d3.select('#country').append('option').text('');
  countries.forEach((country) =>
    d3.select('#country').append('option').text(country)
  );
}

const initShapes = () => {
  d3.select('#shape').append('option').text('');
  shapes.forEach((shape) =>
    d3.select('#shape').append('option').text(shape)
  );
}

const init = () => {
  appendTable(data);
  initStates();
  initCountries();
  initShapes();
}

// Now put everything together
const handleFilterChange = () => {
  d3.event.preventDefault();
  allFilters = pipe(
    domDateFilter,
    domCityFilter,
    domStateFilter,
    domCountryFilter,
    domShapeFilter
  );

  filtered_data = allFilters(data);
  refreshTable(filtered_data);
}

d3.select('#filter-btn').on('click', handleFilterChange);

init();