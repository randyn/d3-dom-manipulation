// from data.js
var tableData = data;
const cities = data.map(sighting_data => sighting_data.city)
                   .reduce((unique_cities, city) =>
                     !(unique_cities.includes(city)) ? unique_cities.concat(city)
                                              : unique_cities,
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

const dateFilter = (date, tableData) => {
  if (typeof(tableData) == 'undefined') {
    return (tableData) => dateFilter(date, tableData);
  }

  return data.filter(sighting_data => sighting_data.datetime == date);
};

const appendTDAnd = (cell_text, row) => {
  if (typeof(row) == 'undefined') {
    return (row) => appendTDAnd(cell_text, row);
  }
  console.log(row);
  row.append('td')
    .text(cell_text);
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
  console.log(data);
  data.forEach(sighting_data => {
    result_row = results_table.append('tr');
    appendSightingDataRow(sighting_data, result_row);
  });
};

const handleDateFilterChange = () => {
  date = d3.select('#datetime').property('value');
  filtered_data = dateFilter(date, tableData);
  clearTableBody();
  appendTable(filtered_data);
};

d3.select('#datetime').on('change', handleDateFilterChange);