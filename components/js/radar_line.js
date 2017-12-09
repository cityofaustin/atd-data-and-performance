ttps://data.austintexas.gov/resource/i626-g7ub.json?$query=SELECT curdatetime, intname, detname, timebin WHERE intname='BURNETPALM WAY' and curdatetime > '2017-12-08 00:00:00.000'

var URL_SENSORS = 'https://data.austintexas.gov/resource/i626-g7ub.json?$query=SELECT intname GROUP BY intname ORDER BY intname ASC';
var grouped;
var directions= ['NB', 'SB', 'EB', 'WB'];


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

getDevices();

function getDevices() {
  d3.json(URL_SENSORS, function(error, json) {
    var sensors = json;
    createSelect('sensors', sensors);
    // <option value="volvo">Volvo</option>
  });
}

function createSelect(divId, data) {
  var select = d3.select('body')
    .insert("select",":first-child")
    .attr('class','select')
    .attr('id', divId)
    .on('change', makeChart);

  var options = select
    .selectAll('option')
    .data(data).enter()
    .append('option')
      .text(function (d) { return d.intname; });

  makeChart({remove: true, type:'historical'});
  
}

function makeChart(options) {
  if (!(options)) {
      var options = {remove : true, type :'historical'}
  }

  //  remove previous chart elements
  if (options.remove) {
    d3.selectAll(".chart-container").selectAll("*").remove()  
  }

  var sensor = d3.select("#sensors").node().value;

  if (options.type=='historical') {
    var url = 'https://data.austintexas.gov/resource/i626-g7ub.json?$query=SELECT intname, detname, timebin, avg(volume) WHERE intname=\''+ sensor + '\' GROUP BY intname, detname, timebin ORDER BY timebin ASC';
  } else if (options.type=='today') {
    //  format timestamp for socrata query
    var d = new Date();
    var day = d.getDate();
    if (day < 10) { day = '0' + day };
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var offset = d.getTimezoneOffset() / 60;
    var timestring = ' 0' + offset + ':00:00.000';  // offset timezone for socrata query 
    var datetime = year + '-' + month + '-' + day + timestring;
    
    var url = 'https://data.austintexas.gov/resource/i626-g7ub.json?$query=SELECT intname, detname, timebin, avg(volume) WHERE intname=\''+ sensor + '\' and curdatetime > \'' + datetime + '\' GROUP BY intname, detname, timebin ORDER BY timebin ASC';
  }
  
  d3.json(url, function(error, json) {

    var grouped = d3.nest()
      .key(function(d) {
        if (d.detname.indexOf('NB') >=0 ) {
          return 'NB';
        } else if (d.detname.indexOf('SB') >=0 ) {
          return 'SB';
        } else if (d.detname.indexOf('EB') >=0 ) {
          return 'EB';
        } else if (d.detname.indexOf('WB') >=0 ) {
          return 'WB';
        }
      })
      .key(function(e) {
        //  turn time bin into date string
        return '1/1/2000 ' + e.timebin;
      })
      .rollup(function(v) {
        return {
            avg: d3.mean(v, function(d) { return d.avg_volume; })      }
      })
      .entries(json);

      //  sort by time bin (they're ordered ASC in the query, so this is redundant)
      // grouped[0].values.sort(function(a, b){ return a.key > b.key });
      // grouped[1].values.sort(function(a, b){ return a.key > b.key });
      if (options.type=='historical') {
        //  draw axes and stuff for historical
        bin_range = d3.extent(grouped[0].values, function(d) { return new Date(d.key); });

        //  extract volumes
        var vols_0 = grouped[0].values.map(function (currentValue, index, array) { return currentValue.value.avg})
        var vols_1 = grouped[1].values.map(function (currentValue, index, array) { return currentValue.value.avg})
        var vols = vols_0.concat(vols_1)

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
      .datum(grouped[0].values)
      .attr("fill", "none")
      .attr("class", function() {
        if (options.type=='today') { return 'today'}
          else if (options.type=='historical') { return 'historical'}
      })
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", line)
      
      if (options.type=='historical') {
        makeChart({remove: false, type: 'today'});
      }
  });
    
    
}







