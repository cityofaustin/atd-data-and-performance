var URL_SENSORS = 'https://data.austintexas.gov/resource/i626-g7ub.json?$query=SELECT intname, detname GROUP BY intname, detname ORDER BY intname ASC';
var directions= ['NB', 'SB', 'EB', 'WB'];

var grouped,
    sensor_directions;

var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

var x = d3.scaleTime().rangeRound([0, width]),
  y = d3.scaleLinear().rangeRound([height, 0]);

var line = d3.line()
  .x(function(d) { return x(new Date(d.key)); })
  .y(function(d) { return y(d.value.avg); });

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("class", "chart-container");

//  init select event listeners
d3.select("#sensors")
    .on('change', getDirections);
  
d3.select("#submit")
  .on("click", makeChart);

getSensors();

function getSensors() {
  //  get sensor attributes and and popoulate selectors
  d3.json(URL_SENSORS, function(error, json) {
    var sensor_names = d3.nest().key(function(d) {return d.intname}).map(json).keys();
    sensor_directions = d3.nest().key(function(d) {return d.intname }).map(json);
    createOptions('sensors', sensor_names);
  });
    
}

function createOptions(divId, data) {

  var options = d3.select("#" + divId)
    .selectAll('option')
    .data(data).enter()
    .append('option')
      .text(function (d) { return d; });
    getDirections();
}


function getDirections() {
  //  append direction select options for given sensor

  //  remove previous direction choices
  d3.select('#direction').selectAll('option').remove();

  var sensor = d3.select('#sensors').node().value;
  
  var dirs = d3.map(sensor_directions['$' + sensor], function(d) { return d.detname}).keys();

  var options = d3.select('#direction')
    .selectAll('option')
    .data(dirs)
    .enter()
    .append('option')
      .text(function (d) { return d; });

  // 

}


function getDates(plot_id) {
  var start = d3.select("#" + plot_id + "_start").node().value;
  var end = d3.select("#" + plot_id + "_end").node().value;
  
  if (!(end)) {
    //  get current date/time time for
    var d = new Date();
    var day = d.getDate();
    if (day < 10) { day = '0' + day };
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var offset = d.getTimezoneOffset() / 60;
    var timestring = ' 0' + offset + ':00:00.000';  // offset timezone for socrata query 
    end = year + '-' + month + '-' + day + timestring;
  }

  //  this is fucked
  return  {
    'start' : start,
    'end' : end
  }

}

function makeChart(options) {

  if (!(options)) {
      var options = {remove : true, type :'plot_1'}
  }

  //  remove previous chart elements
  if (options.remove) {
    d3.selectAll('.chart-container').selectAll('*').remove()  
  }

  var sensor = d3.select('#sensors').node().value;
  var direction = d3.select('#direction').node().value.replace('$','');
  
  var dates = getDates(options.type);
  console.log(dates);
  var where = 'intname=\''+ sensor +
  '\' and detname=\'' + direction +
  '\' and curdatetime >= \'' + dates.start +
  '\' and curdatetime <= \'' + dates.end + '\'';

  var url = 'https://data.austintexas.gov/resource/i626-g7ub.json?$query=SELECT intname, detname, timebin, avg(volume) WHERE ' + where + ' GROUP BY intname, detname, timebin ORDER BY timebin ASC';
  console.log(url);
  d3.json(url, function(error, json) {

    data = d3.nest().key(function(e) {
        //  turn time bin into date string
        return '1/1/2000 ' + e.timebin;
      })
      .rollup(function(v) {
        return {
            avg: d3.mean(v, function(d) { return d.avg_volume; })      }
      })
      .entries(json);

      if (options.type=='plot_1') {
        //  draw axes and stuff for historical
        bin_range = d3.extent(data, function(d) { return new Date(d.key); });

        //  extract volumes
        var vols = data.map(function (currentValue, index, array) { return currentValue.value.avg});

        var max_vol = d3.max(vols);

        x.domain(bin_range);
        y.domain([0, max_vol]);

       g.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
          .select(".domain")
            .remove();

        g.append("g")
            .call(d3.axisLeft(y))
          .append("text")
            .attr("fill", "#000")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text("Avg. Volume");
      }

    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("class", function() {
        if (options.type=='plot_2') { return 'plot_2'}
          else if (options.type=='plot_1') { return 'plot_1'}
      })
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", line)
      
      if (options.type=='plot_1') {
        makeChart({remove: false, type: 'plot_2'});
      }
  });
    
}







