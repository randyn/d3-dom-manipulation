// from data.js
const countries = data.map(sighting_data => sighting_data.country)
                   .reduce((unique_countries, country) =>
                     !(unique_countries.includes(country)) 
                       ? unique_countries.concat(country)
                       : unique_countries,
                     []
                   );



const identity = value => value;

// Implementation of `flow` https://lodash.com/docs/4.17.11#flow
// Helps with composing functions
const pipe = (...functions) =>
  functions.reduce((prevFunction, nextFunction) =>
    (...args) => nextFunction(prevFunction(...args)),
    identity
  );

// Data Filter functions
const dateFilter = (date, tableData) => {
  if (typeof(tableData) == 'undefined') {
    return (tableData) => dateFilter(date, tableData);
  }

  return date == '' ? tableData : tableData.filter(sighting_data => sighting_data.datetime == date);
};

const domDateFilter = (data) => {
  date = d3.select('#datetime').property('value');
  return dateFilter(date, data);
}

const cityFilter = (city, tableData) => {
  if (typeof(tableData) == 'undefined') {
    return (tableData) => cityFilter(city, tableData);
  }

  return city == '' ? tableData : tableData.filter(sighting_data => sighting_data.city === city.toLowerCase());
}

const domCityFilter = (data) => {
  city = d3.select('#city').property('value');
  return cityFilter(city, data);
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

const init = () => {
  appendTable(data);
}


const handleFilterChange = () => {
  d3.event.preventDefault();
  allFilters = pipe(
    domDateFilter,
    domCityFilter
  );

  filtered_data = allFilters(data);
  refreshTable(filtered_data);
}

d3.select('#filter-btn').on('click', handleFilterChange);

init();