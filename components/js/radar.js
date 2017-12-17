//  timezone issues (test in non-us central)
//  default weekday/weekend checkbox
//  legend

var URL_SENSORS = 'https://data.austintexas.gov/resource/i626-g7ub.json?$query=SELECT intname, direction WHERE direction != \'None\' GROUP BY intname, direction ORDER BY intname ASC';

var margin = {top: 20, right: 20, bottom: 30, left: 40};
var width_column = document.getElementById("chart_1").clientWidth;
var height_column = 300;
var width_plots = width_column - margin.left - margin.right
var height_plots = height_column - margin.top - margin.bottom;

//  config
var charts = [
  {
    'div_id' : 'chart_1',
    'chart_type' : 'timebin',
    'line' : d3.line(),
    'plots' : [
      {
        'plot_id' : 'plot_1',
      },
      {
        'plot_id' : 'plot_2',
      },
    ],
    'scales' : {
      'x': d3.scaleTime().rangeRound([0, width_plots]),
      'y': d3.scaleLinear().rangeRound([height_plots, 0])
    }
  },
  {
    'div_id' : 'chart_2',
    'chart_type' : 'daily',
    'line' : d3.line(),
    'plots' : [
      { 
        'plot_id' : 'plot_1',
      },
    ],
    'scales' : {
      'x': d3.scaleTime().rangeRound([0, width_plots]),
      'y': d3.scaleLinear().rangeRound([height_plots, 0])
    }
  },
];


var sensor_directions;

//  init select event listeners
d3.select("#sensors")
    .on('change', getDirections);
  
d3.select("#submit")
  .on("click", onSubmit);

main();

function main() {

  setDateSelectors(function() {
    getSensors();  
  });

}


function formatDate(date, options) {
  //  take a date object and return in format YYYY-MM-dd (local time);
  //  boolean option 'tomorrow' returns tomorrow's date
  //  int option monthsAgo returns x number of months ago 
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();

  options = (options) ? options : {};

  if (options.tomorrow) {
    day++;
  }

  if (options.monthsAgo) {
    month = month - +options.monthsAgo;
    month = (month > 0) ? month : month + 12;
  }

  //  ensure day and month are two digits
  //  https://stackoverflow.com/questions/8043026/javascript-format-number-to-have-2-digit
  day = ("0" + day).slice(-2);
  month = ("0" + month).slice(-2);  
  return year + '-' + month + '-' + day;
}



function setDateSelectors(callback){
  //  init date for plots 1 and 2 selectors

  //  plot 1 (default: six months to present)
  var start = d3.select("#plot_1_start").node().value;
  var end = d3.select("#plot_1_end").node().value;

  if (!start) {
    start = formatDate(new Date(), {'monthsAgo' : 6 });
    d3.select('#plot_1_start').property('value', start);
  }

  if (!end) {
    end = formatDate(new Date(), {'tomorrow' : true});
    d3.select('#plot_1_end').property('value', end);
  }

  //  plot 2 (default: beginning of today to tomorrow)
  start = d3.select("#plot_2_start").node().value;
  end = d3.select("#plot_2_end").node().value;

  if (!start) {
    start = formatDate(new Date());
    d3.select('#plot_2_start').property('value', start);
  }

  if (!end) {
    end = formatDate(new Date(), {'tomorrow' : true});
    d3.select('#plot_2_end').property('value', end);
  }

  callback();

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

  if (!charts[0].div) {
    //  init only, otherwise waiting for 'submit' button
    for (var i=0;i<charts.length;i++) {
      // get data for each chart and draw chart
      getData(charts[i]);
    }
  }
}


function getDateParams(plot_id) {

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

function getDaysParams(plot_id) {
  var weekdays = d3.select('#' + plot_id + '_weekdays').property('checked');
  var weekends = d3.select('#' + plot_id + '_weekends').property('checked');
  
  if (weekdays && weekends) {
    return undefined;
  } else if (weekdays) {
    return 'weekdays';
  } else if (weekends) {
    return 'weekends';
  } else {
    return undefined;
  }
}


function getParams(plot_id, chart_type) {

  return {
    'sensor' : d3.select('#sensors').node().value,
    'direction' : d3.select('#direction').node().value.replace('$',''),
    'metric' : d3.select('#metric').node().value.toLowerCase(),
    'dates' : getDateParams(plot_id),
    'days' : getDaysParams(plot_id)
  }
  
}


function getRequestURL(params, chart_type) {
    
  var where = 'intname=\'' + params.sensor +
    '\'AND direction=\'' + params.direction + '\'';

  if (chart_type == 'daily') {
    // group total volume by date
    if (params.metric == 'volume') {
      var calc = 'SUM(volume)';
    } else if (params.metric =='speed') {
      var calc = 'AVG(speed)';
    }

    var select = 'date_trunc_ymd(curdatetime) AS key, ' + calc + ' AS value';
      
    return 'https://data.austintexas.gov/resource/vw6m-5i7b.json?$query=SELECT ' + select + ' WHERE ' + where + ' GROUP BY key ORDER BY KEY DESC';
    
  } else if (chart_type == 'timebin') {
    //  group average volume in 15 mins

    if (params.metric == 'volume') {
      var calc = 'AVG(volume)';
    } else if (params.metric =='speed') {
      var calc = 'AVG(speed)';
    }

    var select = 'timebin as key, ' + calc +' AS value';

    where = where + ' AND curdatetime >= \'' + params.dates.start +
    '\' AND curdatetime < \'' + params.dates.end + '\'';

    if (params.days == 'weekdays') {
      where = where + ' AND (day_of_week > 0 AND day_of_week < 6) ';  
    } else if (params.days == 'weekends') {
      where = where + ' AND (day_of_week = 0 OR day_of_week = 6) ';
    }
    
    return 'https://data.austintexas.gov/resource/i626-g7ub.json?$query=SELECT ' + select + ' WHERE ' + where + ' GROUP BY timebin ORDER BY timebin ASC';    

  }
  
}


function postDownloadURL(url, plot_id) {
  var url_dl = url.replace('json', 'csv');
  
  d3.select('#' + plot_id + '_download')
    .html('<i class="fa fa-download"></i> Data')
    .attr('href', url)
    .attr('class', 'download-link')
    .attr('target', '_blank');

}



function chartTitle(chart) {
  var metric = chart.plots[0].params.metric;

  if (chart.chart_type == 'timebin') {
    if (metric=='volume') {
        return 'Average Volume by Time of Day';
      } else if (metric=='speed') {
        return 'Average Speed by Time of Day';
      }
  } else if (chart.chart_type == 'daily') {
    if (metric=='volume') {
        return 'Total Daily Volume';
      } else if (metric=='speed') {
        return 'Average Daily Speed';
      }
  }
}


function axisLabel(chart) {
  var metric = chart.plots[0].params.metric;
  if (metric=='volume') {
      if (chart.chart_type == 'timebin') {
        return 'Avg. Volume';
      } else if (chart.chart_type == 'daily') {
        return 'Total Volume';
      }
  } else if (metric=='speed') {
    return 'Avg. Speed';
  }
 
}


function onSubmit() {
  // get data for each chart and draw chart
  for (var i=0;i<charts.length;i++) {
    getData(charts[i]);  
  }
  
}


function getData(chart) {

  var q = d3.queue();
  //  create socrata request instance for each plot
  //  send to d3-queue and create charts when data is retrieved

  for (var i=0; i < chart.plots.length; i++) {

    var plot_id = chart.plots[i].plot_id;

    chart.plots[i].params = getParams(plot_id, chart.chart_type);
  
    var url = getRequestURL(chart.plots[i].params, chart.chart_type);
    console.log(url);
    if (chart.chart_type=='timebin') {
      //  should post a download link fot the daily chart, too
      postDownloadURL(url, plot_id)  
    }
    
    var req = d3.json(url);
    q.defer(req.get);
  }

  q.awaitAll(function(error, results) {
    // requests data availabe as results
      
      for (var i=0;i<chart.plots.length;i++) {
        if (chart.chart_type=='timebin') {
          chart.plots[i].data = groupByBin(results[i]);
        } else {
          chart.plots[i].data = results[i];
        }
      }
      
      chart.extent = getExtent(chart);
      if (!chart.div) {
        lineChart(chart);
      } else {
        updateLineChart(chart);
      }
    
    });
}


function groupByBin(data) {

  return d3.nest().key(function(e) {
      //  turn time bin into date string
      return '1/1/2000 ' + e.key;
    })
    .rollup(function(v) {
      return d3.mean(v, function(d) { return d.value; }) 
    })
    .entries(data);
  }


function getExtent(chart){
    //  get min/max volume and timebin extent from chart data
    //  values are fed to x/y scales
    var data_all = [];
    
    for (var i=0;i<chart.plots.length;i++) {      
      data_all = data_all.concat(chart.plots[i].data);
    }

    var range = d3.extent(data_all, function(d) { return new Date(d.key); });
    var vols = data_all.map(function (d) { return +d.value});
    var max_vol = d3.max(vols);

    return {
      'x' : range,
      'y' : [0, max_vol],
    }
}


function makeChartDiv(div_id) {
  
  var svg = d3.select("#" + div_id)
    .append('svg')
    .attr('height', height_column)
    .attr('width', width_column)

  return svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("class", "chart-container");
}


function lineChart(chart) {
  var title = chartTitle(chart);
  d3.select('#' + chart.div_id).select('.chart-title').text(title);

  chart.div = makeChartDiv(chart.div_id);

  for (var i=0;i<chart.plots.length;i++) {
    //  init each plot
    var div_id = chart.plots[i].plot_id

    chart.plots[i].plot = chart.div.append("path")
      .datum(chart.plots[i].data)
      .attr("fill", "none")
      .attr("id", function() { 
        return div_id;
      })
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5);
    }

  updateLineChart(chart);

}


function updateLineChart(chart) {
  chart.div.selectAll('.axis').remove(); 

  var title = chartTitle(chart);
  d3.select('#' + chart.div_id).select('.chart-title').text(title);
  
  chart.scales.x.domain(chart.extent.x);
  chart.scales.y.domain(chart.extent.y);
  
  chart.line
      .x(function(d) { return chart.scales.x(new Date(d.key)); })
      .y(function(d) { return chart.scales.y(+d.value); })
      .curve(d3.curveCardinal);

  chart.div.append("g")
      .attr('class', 'axis')
      .attr("transform", "translate(0," + height_plots + ")")
      .call(d3.axisBottom(chart.scales.x));

  chart.div.append("g")
      .attr('class', 'axis')
      .call(d3.axisLeft(chart.scales.y))
    .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text(function() {
        return axisLabel(chart);
      });

  for (var i=0;i<chart.plots.length;i++) {
     chart.plots[i].plot
       .datum(chart.plots[i].data)
        .transition()
        .duration(500)
        .ease(d3.easeLinear)
        .attr("d", chart.line)
        .transition();

      }
}



