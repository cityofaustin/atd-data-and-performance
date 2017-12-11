var URL_SENSORS = 'https://data.austintexas.gov/resource/i626-g7ub.json?$query=SELECT intname, direction WHERE direction != \'None\' GROUP BY intname, direction ORDER BY intname ASC';

var grouped,
    sensor_directions;

var init = true;

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
  
  var dirs = d3.map(sensor_directions['$' + sensor], function(d) { return d.direction}).keys();

  var options = d3.select('#direction')
    .selectAll('option')
    .data(dirs)
    .enter()
    .append('option')
    .text(function (d) { return d; });

  if (init) {
    init = false;
    makeChart();
  }
}


function getDates(plot_id) {

  var start = d3.select("#" + plot_id + "_start").node().value;
  var end = d3.select("#" + plot_id + "_end").node().value;
  
  if (start) {
    // parse date, rounding time to 0
    start = start.split('-')
    start = new Date(start[0] + '/' + start[1] + '/' + start[2]);

  } else {
    start = new Date();
    start.setHours(0,0,0,0);
  }
  
  start = start.toISOString();

  if (end) {
    //  parse end date
    end = new Date(end[0] + '/' + end[1] + '/' + end[2]);
  } else {
    //  use today's date if no end specified
    end = new Date();
  }
  
  //  set end to beginning of next day
  var date = end.getDate();
  end = new Date(end.setDate(date + 1))
  end = end.toISOString();

  return  {
    'start' : start,
    'end' : end
  }

}


function getDays(plot_id) {
  var weekdays = d3.select('#' + plot_id + '_weekdays').property('checked');
  var weekends = d3.select('#' + plot_id + '_weekends').property('checked');
  
  if (weekdays && weekends) {
    return null;
  } else if (weekdays) {
    return 'weekdays';
  } else if (weekends) {
    return 'weekends';
  } else {
    return null;
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
  var days = getDays(options.type);
  console.log(dates);
  var where = 'intname=\''+ sensor +
  '\' AND direction=\'' + direction +
  '\' AND curdatetime >= \'' + dates.start +
  '\' AND curdatetime <= \'' + dates.end + '\'';

  if (days == 'weekdays') {
    where = where + ' AND (day_of_week > 0 OR day_of_week < 7) ';  
  } else if (days == 'weekends') {
    where = where + ' AND (day_of_week < 1 OR day_of_week > 6) ';
  }
  
  var url = 'https://data.austintexas.gov/resource/i626-g7ub.json?$query=SELECT intname, direction, timebin, AVG(volume) WHERE ' + where + ' GROUP BY intname, direction, timebin ORDER BY timebin ASC';
  console.log(url)
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
            .call(d3.axisBottom(x));

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







