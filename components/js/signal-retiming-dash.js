
var ANNUAL_GOALS = {
    
    "2018" : {
        retime_goal: 0,
        avg_reduction_goal: 0
    },
    
    "2017" : {
        retime_goal: 0,
        avg_reduction_goal: 0
    },

    "2016" : {
        retime_goal: 200,
        avg_reduction_goal: .05
    },

    "2015" : {
        retime_goal: 150,
        avg_reduction_goal: .05  
    }    

};

var SOURCE_DATA;

var GROUPED_DATA;

var tau = 2 * Math.PI,
    arc;

var selected_year = "2016";  //  init year selection

var previous_selection = "2015";

var retime_goal = +ANNUAL_GOALS[selected_year]["retime_goal"];

var reduction_goal = +ANNUAL_GOALS[selected_year]["avg_reduction_goal"];

var data_url = "../components/data/dummy_retiming_data.json";

var formatPct = d3.format(".1%");

var formatPctInt = d3.format("1.0%");

var t1 = d3.transition()
    .ease(d3.easeQuad)
    .duration(500);

var t2;

d3.json(data_url, function(dataset) {

    SOURCE_DATA = dataset;

    groupData(dataset, function(){

        createProgressChart("info-1");

        populateTTstat("info-2", t1);

        populateTable(SOURCE_DATA);

    });

});

d3.select("#year-selector").on("change", function(d){

    t2 = d3.transition()
        .ease(d3.easeQuad)
        .duration(1000);
    
    previous_selection = selected_year;

    selected_year = d3.select(this).property("value");

    updateProgressChart("info-1", t2);

    updateTTstat("info-2", t2);

})

function groupData(dataset, updateCharts) {

    GROUPED_DATA = 
        d3.nest()
            .key(function (d) {
                return d.retime_fiscal_year;
            })
            .key(function (q){
                return q.status;
            })
            .rollup(function (v) {
                return {
                    systems : v.length,
                    signals_retimed : d3.sum(v, function(d) { 
                        return d.signal_count;
                    }),
                    tt_reduction : d3.mean(v, function(d) {
                        return d.tt_reduction;
                    })
                };
            })
            .map(dataset); 

     updateCharts();

}

function populateTTstat(divId, transition) {

    var goal = ANNUAL_GOALS[selected_year]["avg_reduction_goal"]; 

    var tt_reduction = 
        GROUPED_DATA["$" + selected_year]["$COMPLETED"]["tt_reduction"];
    
    d3.select("#" + divId)
        .append("text")
        .text(formatPct(0))
        .transition(transition)
        .attr("class", function(){
            if (tt_reduction >= +goal) {
                return "goal-met";
            } else {
                return "goal-unmet"
            }
        })
        .tween("text", function () {
            
            var that = d3.select(this);

            var i = d3.interpolate(0, tt_reduction);
            
            return function (t) {
            
                that.text( formatPct(i(t)) );
            
            }

        });

}

function updateTTstat(divId, transition) {

    var goal = ANNUAL_GOALS[selected_year]["avg_reduction_goal"]; 

    var tt_reduction_previous = 
        GROUPED_DATA["$" + previous_selection]["$COMPLETED"]["tt_reduction"];

    var tt_reduction = 
        GROUPED_DATA["$" + selected_year]["$COMPLETED"]["tt_reduction"];
    
    d3.select("#" + divId)
        .select("text")
        .transition(transition)
        .attr("class", function(){
            if (tt_reduction >= +goal) {
                return "goal-met";
            } else {
                return "goal-unmet"
            }
        })
        .tween("text", function () {
            
            var that = d3.select(this);

            var i = d3.interpolate(tt_reduction_previous, tt_reduction);
            
            return function (t) {
            
                that.text( formatPct(i(t)) );
            
            }

        });

}

function createProgressChart(divId) {  //  see https://bl.ocks.org/mbostock/5100636

    var pct_complete = 0;  //  0 for init transition

    var keys = ["planned","done"];  

    var width = 200;

    var height = 200;

    var radius = 100;

    arc = d3.arc()
        .innerRadius(radius * .6)
        .outerRadius(radius)
        .startAngle(0);

    var svg = d3.select("#" + divId)
        .select("svg")
        .attr("width", width)
        .attr("height", height);

    var g = svg
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height/2 +  ")");

    var background = g.append("path")
        .datum({endAngle: tau})
        .attr("class", "planned")
        .attr("d", arc);

    var progress = g.append("path")
        .datum({endAngle: pct_complete * tau})
        .attr("class", "done")
        .attr("id", "progress-pie")
        .attr("d", arc);

    svg.append("g")
        .append("text")
        .attr("id", "pieText")
        .attr("class", "pieText")
        .attr("y", height / 2)
        .attr("x", width / 2)
        .style("text-anchor", "middle")
        .html(function (d) {
            return formatPctInt(0);
        });
    
    updateProgressChart("info-1", t1);
}

function updateProgressChart(divId, transition){

    var goal = ANNUAL_GOALS[selected_year]["retime_goal"];

    var signals_retimed = 
        GROUPED_DATA["$" + selected_year]["$COMPLETED"]["signals_retimed"];

    var pct_complete = signals_retimed / goal;  //  init data for 50/50 pie 
    
    d3.select("#progress-pie")
        .transition(transition)
        .attrTween("d", arcTween(pct_complete * tau));

    d3.select("#" + "pieText")
        .transition(transition)
        .tween("text", function () {
            
            var that = d3.select(this);

            var pct_complete_previous = ( parseFloat(that.text().replace('%','')) ) / 100; // convert existing % string to float

            var i = d3.interpolate(pct_complete_previous, pct_complete);
            
            return function (t) {
            
                that.text( formatPctInt(i(t))  );
            
            }    
    });

}


function populateTable(dataset) {

        var filtered_data = dataset.filter(function (d) {

            return d.retime_fiscal_year == selected_year;

        });

        var rows = d3.select("tbody")
            .selectAll("tr")
            .data(filtered_data)
            .enter()
            .append("tr")
            .attr("class", "tableRow");

        d3.select("tbody").selectAll("tr")

            .each(function (d) {
                
                d3.select(this).append("td").html(d.system_id);
                                
                d3.select(this).append("td").html(d.system_name);
                
                d3.select(this).append("td").html(d.signal_count);

                d3.select(this).append("td").html(d.status);
                
                d3.select(this).append("td").html(d.status_date);
                
                d3.select(this).append("td").html(d.tt_reduction);

            });

        //  activate datatable sorting/search functionality
        $(document).ready(function () {
            table = $('#data_table').DataTable( {
                paging : false
            });
        });

    } //  end populateTable


function arcTween(newAngle) { 

    return function(d) {
    
        var interpolate = d3.interpolate(d.endAngle, newAngle);
    
        return function(t) {
            d.endAngle = interpolate(t);
            return arc(d);
    
    };
  
  };

}








