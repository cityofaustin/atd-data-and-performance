
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

var selected_year = "2016";  //  init year selection

var previous_selection = "2015";

var pie_path, pie;

var retime_goal = +ANNUAL_GOALS[selected_year]["retime_goal"];

var reduction_goal = +ANNUAL_GOALS[selected_year]["avg_reduction_goal"];

var data_url = "../components/data/dummy_retiming_data.json";

var formatPct = d3.format(".1%");

var formatPctInt = d3.format("1.0%");

var t = d3.transition()
    .ease(d3.easeLinear)
    .duration(750);

d3.json(data_url, function(dataset) {

    SOURCE_DATA = dataset;

    groupData(dataset, function(filtered_data){

        populateRetimeCount("info-1");

        createProgressChart("info-1");

        populateTTstat("info-2");

        populateTable(SOURCE_DATA);

    });

});

d3.select("#year-selector").on("change", function(d){
    
    previous_selection = selected_year;

    selected_year = d3.select(this).property("value");

    updateRetimeCount("info-1", filtered_data);

   //   updateProgressChart("info-1", filtered_data);

    updateTTstat("info-2", filtered_data);

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

function populateRetimeCount(divId, dataset) {

    var retime_previous = 
        GROUPED_DATA["$" + previous_selection]["$COMPLETED"]["signals_retimed"];

    var signals_retimed = 
        GROUPED_DATA["$" + selected_year]["$COMPLETED"]["signals_retimed"];

    var goal = ANNUAL_GOALS[selected_year]["retime_goal"]; 

    d3.select("#" + divId)
        .select("h2")
        .text("0")
        .transition(t)
        .tween("text", function () {
            
            var that = d3.select(this);

            var i = d3.interpolate(retime_previous, signals_retimed);
            
            return function (t) {
            
                that.text( Math.round(i(t)) + " / " + goal);
            
            }    
    });
}


function populateTTstat(divId, dataset) {

    var goal = ANNUAL_GOALS[selected_year]["avg_reduction_goal"]; 

    var tt_reduction_previous = 
        GROUPED_DATA["$" + previous_selection]["$COMPLETED"]["tt_reduction"];

    var tt_reduction = 
        GROUPED_DATA["$" + selected_year]["$COMPLETED"]["tt_reduction"];
    
    d3.select("#" + divId)
        .append("text")
        .text(formatPct(tt_reduction_previous))
        .transition(t)
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

function updateTTstat(divId, dataset) {

    var goal = ANNUAL_GOALS[selected_year]["avg_reduction_goal"]; 
    
    d3.select("#" + divId)
        .select("text")
        .transition(t)
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

function createProgressChart(divId, dataset) {

    var goal = ANNUAL_GOALS[selected_year]["retime_goal"];

    var signals_retimed = 
        GROUPED_DATA["$" + selected_year]["$COMPLETED"]["signals_retimed"];

    var values = [goal, goal - signals_retimed];  //  init data for 50/50 pie 

    var keys = ["planned","done"];  

    var width = 200;

    var height = 200;

    var radius = 100;

    var tau = 2 * Math.PI; 

    pie = d3.pie()
        .value(function (d) {
            return d;
        })
        .sortValues(function(a, b){
            return a;
        });

    var arc = d3.arc()
        .outerRadius(radius)
        .innerRadius(radius * .6);

    var svg = d3.select("#" + divId)
        .select("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height/2 +  ")");

    pie_path = 
        svg.datum(values)
            .selectAll("path")
                .data(pie)
                .enter()
                .append("g")
                .attr("class", function(d, i) {
                    return "arc " + keys[i];
                })
                .attr("fill", "green")
                .attr("id", "pie")
                .append("path")
                .attr("d", arc)
                .attr("stroke", "white")
                .each(function (d) {
                    this._current = d;
            }); // store the current angles

    svg.append("g")
        .append("text")
       //   .attr("y", height / 10)
        .style("text-anchor", "middle")
        .attr("class", "pieText")
        .html(function (d) {
            return formatPctInt(signals_retimed / goal);
        });
        
}

function updateRetimeCount(divId, dataset) {

    var goal = ANNUAL_GOALS[selected_year]["retime_goal"];

    var retime_previous = 
        GROUPED_DATA["$" + previous_selection]["$COMPLETED"]["signals_retimed"];

    var signals_retimed = 
        GROUPED_DATA["$" + selected_year]["$COMPLETED"]["signals_retimed"];

    d3.select("#" + divId)
        .select("h2")
        .transition(t)
        .tween("text", function () {
            
            var that = d3.select(this);

            var i = d3.interpolate(retime_previous, signals_retimed);
            
            return function (t) {
            
                that.text( Math.round(i(t)) + " / " + goal );
            
            }    
    });

}


function updateProgressChart(divId, dataset){

    var goal = ANNUAL_GOALS[selected_year]["retime_goal"];

    var retime_previous = 
        GROUPED_DATA["$" + previous_selection]["$COMPLETED"]["signals_retimed"];

    var signals_retimed = 
        GROUPED_DATA["$" + selected_year]["$COMPLETED"]["signals_retimed"];

    var values = [goal, goal-signals_retimed];  //  init data for 50/50 gaugei 

    var keys = ["planned","done"]; 

    pie.value(function (d) {
            return d;
        })
        .sortValues(function(a, b){
            return a;
        }); 

    // pie_path = pie_path.data(pie); // compute the new angles
    
    pie_path.transition(t).attrTween("d", arcTween); // redraw the arc

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

