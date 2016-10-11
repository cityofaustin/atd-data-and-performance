
var john;

var segments = [];

var day_names = ['mon', 'tues', 'weds', 'thurs', 'fri', 'sat', 'sun'];

var periods = ['am_off','am_peak','mid_day', 'pm_peak', 'pm_off'];

var period_switch = 0;

var colors = d3.schemeSet1;

var source_file = "../components/data/lamar_all_may_2016.csv";

var selected_day = 0;

var selected_time = 'am_off';

var options = {
  'selected_day' : selected_day,
  'selected_time' : selected_time
};

var t = d3.transition()
  .ease(d3.easeQuad)
  .duration(1000);

var margin = {top: 40, right: 10, bottom: 110, left: 100},
  width = 800 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([0, height]);
var yAx = d3.scaleLinear().range([height, 0]);

var area = d3.area()
    .curve(d3.curveCatmullRom.alpha(.1))
    .x(function(d, i) { 
      return x(i); })
    .y0(height)
    .y1(function(d) {
          return height - y(+d.avg_speed);
    });

var svg = d3.select("#content-wrapper")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  
svg.append("rect")
    .attr('class', 'background')
    .attr("height", height)
    .attr("width", width)
    .attr("fill", "#1a1a1a")
    .attr("opacity", 0);

d3.csv(source_file, function(data) {

  for (var i = 0; i < data.length; i++) {

    var attpm = data[i].travel_time / data[i].segment_length;

    data[i]['avg_travel_time_per_mile'] = attpm;

  }

  maxTT = d3.max(data, function(d){

    return +d.avg_speed;
  
  });

  minTT = d3.min(data, function(d){

    return +d.avg_speed;

  })

  for (var i = 0; i < data.length; i++) {

    if (segments.indexOf(data[i].segment) < 0) {
      
      segments.push(data[i].segment);

    }

  }

  data = d3.nest()
            .key(function (d) {
                return d.day;
            })
            .key(function (q){
                return q.period;
            })
            .map(data); 

  john = data;

  //  check for equal object lengths. e.g if a segment is missing data for a specific day/time, we need to raise a flag
  for (var day in data.keys()){

    for (var period in data['$' + day]) {

        if (data['$' + day].hasOwnProperty(period)) {

          if (data['$' + day][period].length != segments.length) {
            
            alert(
              "It appears the data your loading has insuffcient samples for desired timeframe!"
              );
          }

        }

    }

  }

  filtered_data = data.values();

  x.domain([0, filtered_data[0].values()[0].length]);

  y.domain([minTT, maxTT]);

  yAx.domain([minTT, maxTT]);

  //  create chart
  svg.selectAll("path")
    .data(filtered_data)
    .enter()
    .append("path")
    .datum(function(d){
      return d['$' + selected_time];
    })
    .attr("id", function(d, i) {
      return day_names[i];
    })
    .attr("class", "area")
    .attr("d", area)
    .attr("opacity", .65)
    .attr("fill", function(d, i){
      // return d3.interpolateRdYlBu(i/7);
      return d3.interpolateSpectral(i/7);
      //return colors[i];
    })
    .attr("visibility", "visible");

  //  create axes
  svg.append('g')
    .attr("class", "axis-left")
    .call(d3.axisLeft(yAx)
        .tickSize(4)
        .ticks(6)
        .tickFormat(function(d){
            return d + " mph";
        })
    );

  svg.append("g")
      .attr("class", "axis-bottom")
      .attr("transform", "translate(" + 0 + "," + height + ")")
      .call(
        d3.axisBottom(x)
          .ticks(segments.length)
          .tickFormat(function(d, i){
            return segments[i]
          })
          .tickSizeOuter(0)
      )
      .selectAll("text")
      .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", function (d) {
          return "rotate(-35)"
        });

  //  create radio buttons
  d3.select("form")
    .selectAll("input")
    .data(filtered_data)
    .enter()
    .append('label')
      .attr('for',function(d,i){ return 'a'+i; })
      .text(function(d, i) { return day_names[i] + ' ' ; })
      .style("margin", "0px 5px")
      .style("cursor", "pointer")
    .append("input")
      .attr("checked", true)
      .attr("type", "checkbox")
      .attr("class", "checkbox")
      .attr("id", function(d,i) { return 'a'+i; })
      .attr("name", function(d, i){
        return day_names[i];
      })
      .attr("value", function(d, i) {
        return i;
      })
      .style("cursor", "pointer")
      .style("display", "inline-block");
  
  d3.selectAll(".checkbox").on("change", function(d){
    
    var day = d3.select(this).node().value;

    var visibility = d3.select("#" + day_names[day]).attr("visibility");

    if (visibility == "visible") {

      visibility = "hidden";

    } else {

      visibility = "visible"

    }

    d3.select("#" + day_names[day]).attr("visibility", visibility);    

  });
    
  d3.selectAll("select").on("change", function(d){

    var selector = d3.select(this).attr("id");

    options[selector] = d3.select(this).node().value;

    updateData(data, function(new_data){
      
      d3.selectAll(".area")
        .data(filtered_data)
        .datum(function(d){
          return d['$' + options['selected_time']];
        })
        .transition(t)
        .attr("d", area);

    });

  })

  //  cycle through time periods until manually changed
  var cylclist = d3.interval(function() {

    if (period_switch == periods.length) {
    
      period_switch = 0;
    
    } else {

      period_switch++;

    }

    d3.select('#' + periods[period_switch])
      .property('selected', true);


    updateData(data, function(new_data){


      
      d3.selectAll(".area")
        .data(filtered_data)
        .datum(function(d){
          return d['$' + [periods[period_switch]]];
        })
        .transition(t)
        .attr("d", area);

    });

  }, 1500);

  d3.select("body").on("click", function(){

      cylclist.stop();  //  stop the auto transitioner on any click

  })

  function updateData(dataset, updateCharts) {

    t = d3.transition()
      .ease(d3.easeQuad)
      .duration(1000);
    
    updateCharts(dataset["$" + options['selected_day']]["$" + options['selected_time']]);

  }


});