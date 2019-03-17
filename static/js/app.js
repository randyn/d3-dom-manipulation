// from data.js
var tableData = data;

const dateFilter = (date) => tableData.filter(sighting => sighting.datetime == date);

const appendTable = (data) => {
    data.forEach(sighting_data => {
        results_table = d3.select('#ufo-table');
        results_table.append('tr');
    });
};