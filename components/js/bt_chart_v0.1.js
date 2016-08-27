//  you gota make those arrays equal in length!

var john;

var segments = [];

var days = d3.range(5);

var day_names = ['mon', 'tues', 'weds', 'thurs', 'fri', 'sat', 'sun'];

var colors = d3.schemeDark2;

var source_file = "../components/data/lamar_all_may_2016.csv";

var selected_day = 0;

var selected_time = 'am_peak';

var options = {
  'selected_day' : selected_day,
  'selected_time' : selected_time
};

var t = d3.transition()
  .ease(d3.easeQuad)
  .duration(1000);

var margin = {top: 40, right: 10, bottom: 110, left: 100},
  width = 900 - margin.left - margin.right,
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
          return height - y(+d.avg_travel_time_per_mile);
    });

var svg = d3.select("#content-wrapper")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv(source_file, function(data) {

  for (var i = 0; i < data.length; i++) {

    var attpm = data[i].travel_time / data[i].segment_length;

    data[i]['avg_travel_time_per_mile'] = attpm;

  }

  maxTT = d3.max(data, function(d){

    return +d.avg_travel_time_per_mile;
  
  });

  minTT = d3.min(data, function(d){

    return +d.avg_travel_time_per_mile;

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

  filtered_data = data.values();

  x.domain([0, filtered_data[0].values()[0].length]);

  y.domain([minTT, maxTT]);

  yAx.domain([minTT, maxTT]);

    svg.selectAll("path")
      .data(filtered_data)
      .enter()
      .append("path")
      .datum(function(d){
        return d['$' + selected_time];
      })
      .attr("class", "area")
      .attr("id", "area")
      .attr("d", area)
      .attr("opacity", .4)
      .attr("fill", function(d, i){
        return colors[i];
      });

  svg.append('g')
        .attr("class", "axis-left")
        .call(d3.axisLeft(yAx).tickSize(4)
            .tickFormat(function(d){
                return d + "s";
            })
        );

    svg.append("g")
        .attr("class", "axis-bottom")
        .attr("transform", "translate(" + 0 + "," + height + ")")
        .call(
          d3.axisBottom(x)
            .ticks(segments.length/2)
            .tickFormat(function(d, i){
              return segments[i].replace("$", " to " ).replace("_"," ");
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


  function updateData(dataset, updateCharts) {

    t = d3.transition()
      .ease(d3.easeQuad)
      .duration(1000);
    
    updateCharts(dataset["$" + options['selected_day']]["$" + options['selected_time']]);

  }


});