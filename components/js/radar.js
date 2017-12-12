//  weekdays/weekends debug >> overhaul pub script and re-process

var URL_SENSORS = 'https://data.austintexas.gov/resource/i626-g7ub.json?$query=SELECT intname, direction WHERE direction != \'None\' GROUP BY intname, direction ORDER BY intname ASC';

var plots = [
  { 'div_id' : 'plot_1' },
  { 'div_id' : 'plot_2' }
];

var sensor_directions;
var init = true;

var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

var x = d3.scaleTime().rangeRound([0, width]),
  y = d3.scaleLinear().rangeRound([height, 0]);

var line = d3.line()
  .x(function(d) { return x(new Date(d.key)); })
  .y(function(d) { return y(d.value.avg); })
  .curve(d3.curveBasis);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("class", "chart-container");

//  init select event listeners
d3.select("#sensors")
    .on('change', getDirections);
  
d3.select("#submit")
  .on("click", onSubmit);

setDateSelectors();
getSensors();


function setDateSelectors(){
  //  init date selectors
  //  this is a actually race condition with getData...
  var start = d3.select("#plot_1_start").node().value;

  if (!start) {
    d3.select('#plot_1_start').property('value', '2017-06-01');
  }

}

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
    getData(plots);
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
    end = end.split('-');
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


function getRequestURL(plot_id) {
    // get params
  // get data for both charts
  // get extents, create scales
  // make each chart
  // req = d3.json(url);

  var sensor = d3.select('#sensors').node().value;

  var direction = d3.select('#direction').node().value.replace('$','');

  var dates = getDates(plot_id);
  
  var days = getDays(plot_id);
  
  var where = 'intname=\''+ sensor +
    '\' AND direction=\'' + direction +
    '\' AND curdatetime >= \'' + dates.start +
    '\' AND curdatetime < \'' + dates.end + '\'';

  if (days == 'weekdays') {
    where = where + ' AND (day_of_week > 0 AND day_of_week < 6) ';  
  } else if (days == 'weekends') {
    where = where + ' AND (day_of_week = 0 OR day_of_week = 6) ';
  }
  
  url = 'https://data.austintexas.gov/resource/i626-g7ub.json?$query=SELECT intname, direction, timebin, AVG(volume) WHERE ' + where + ' GROUP BY intname, direction, timebin ORDER BY timebin ASC';    

  var url_dl = url.replace('json', 'csv');
  postDownloadURL(url_dl, plot_id);

  return url;
    
}

function postDownloadURL(url, plot_id) {
  
  d3.select('#' + plot_id + '_download')
    .html('<i class="fa fa-download"></i> Data')
    .attr('href', url)
    .attr('class', 'download-link')
    .attr('target', '_blank');

}

function onSubmit() {
  //  clear existing plot data
  getData(plots);
}

function getData(charts) {

  var q = d3.queue();
  //  get create socrata request instance for each plot
  //  send to d3-queue and create charts when data is available
  for (var i=0; i < charts.length; i++) {
    var plot_id = charts[i].div_id;
    var url = getRequestURL(plot_id);
    console.log(url);
    var req = d3.json(url);
    q.defer(req.get);
  }

  q.awaitAll(function(error, results) {
    // get data!
    var prepared = prepareData(results, charts);
    var extent = getExtent(charts);
    makeCharts(prepared, extent);
    
  })

}

function groupByBin(data) {
   return d3.nest().key(function(e) {
        //  turn time bin into date string
        return '1/1/2000 ' + e.timebin;
      })
      .rollup(function(v) {
        return {
            avg: d3.mean(v, function(d) { return d.avg_volume; })      }
      })
      .entries(data);
}


function getExtent(charts){
    //  get min/max volume and timebin extent from chart data
    //  values are fed to x/y scales
    data_all = [];

    for (var i=0;i<charts.length;i++) {      
      data_all = data_all.concat(charts[i].data);
    }

    var bin_range = d3.extent(data_all, function(d) { return new Date(d.key); });
    var vols = data_all.map(function (currentValue, index, array) { return currentValue.value.avg});
    var max_vol = d3.max(vols);
    
    return {
      'x' : bin_range,
      'y' : [0, max_vol],
    }
}


function prepareData(data, charts) {
  for (var i=0;i<charts.length;i++) {
    charts[i].data = groupByBin(data[i]);
  }
  return charts;
}


function makeCharts(charts, extent, options) {

  //  remove previous chart elements
  d3.selectAll('.axis').remove(); 
  
  x.domain(extent.x);
  y.domain(extent.y);

  g.append("g")
      .attr('class', 'axis')
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  g.append("g")
      .attr('class', 'axis')
      .call(d3.axisLeft(y))
    .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Avg. Volume");
  ;


  for (var i=0; i < charts.length; i++) {
    var div_id = charts[i].div_id

    if (init) {
      if (i+1==charts.length) {
        init=false;
      }

      // make charts for the first time
      g.append("path")
        .datum(0)
        .attr("fill", "none")
        .attr("id", function() { 
          return div_id;
        })
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 1.5)
        .attr("d", line);

      d3.selectAll('#' + div_id)
       .datum(charts[i].data)
        .transition()
        .duration(500)
        .ease(d3.easeLinear)
        .attr("d", line)
        .transition();

    } else {

      // update chart with new data
      d3.selectAll('#' + div_id)
        .datum(charts[i].data)
        .transition()
        .duration(500)
        .ease(d3.easeLinear)
        .attr("d", line)
        .transition()
    } 
  }
    
}







