
/// you still need separate functions for init and updating charts = otherwise you create a new chart every time...?


var ANNUAL_GOALS = {
    "2016" : {
        retime_goal: 200,
        avg_reduction_goal: .05    
    },
    "2015" : {
        retime_goal: 150,
        avg_reduction_goal: .05  
    }    
};

var delay_val = 5;  //  delay for ind blocks in chained transitions

var progChartWidth = 250;

var selected_year = "2016";

var retime_previous;

var retime_current = 0;

var tt_reduction_current = 0;

var tt_reduction_previous = 0;

var pie_path, pie;

var retime_goal = +ANNUAL_GOALS[selected_year]["retime_goal"];

var reduction_goal = +ANNUAL_GOALS[selected_year]["avg_reduction_goal"];

var data_url = "../components/data/dummy_retiming_data.json";

var source_data;

var formatPct = d3.format(".1%");

var t = d3.transition()
    .ease(d3.easeLinear)
    .duration(750);

d3.json(data_url, function(dataset) {

    source_data = dataset;

    filterData(source_data, function(filtered_data){

        populateRetimeCount("info-1", filtered_data);

        createProgressChart("info-1", filtered_data);

        populateTTstat("info-2", filtered_data);

        populateTable(filtered_data);

    });

});

d3.select("#year-selector").on("change", function(d){
    
    selected_year = d3.select(this).property("value");

    filterData(source_data, function(filtered_data){

        updateRetimeCount("info-1", filtered_data);

       //   updateProgressChart("info-1", filtered_data);

        updateTTstat("info-2", filtered_data);

    });

})

function filterData(dataset, updateCharts) {

    //  var fy_start = new Date("10/1/" + (selected_year-1));  //  saddest FY generator ever

    filtered_data = dataset.filter(function (d) {

        return d.retime_fiscal_year == selected_year;

    })

    retime_previous = retime_current;

    retime_current = 0;

    for (var i = 0; i < filtered_data.length; i++) {

        if (filtered_data[i]["status"] == "COMPLETED") {
        
            retime_current = retime_current + +filtered_data[i]["signal_count"];
            
        }
        
    }  

    tt_reduction_previous = tt_reduction_current;

    tt_reduction_current = 0;

    for (var i = 0; i < filtered_data.length; i++) {

        if (filtered_data[i]["status"] == "COMPLETED") {
        
            tt_reduction_current = tt_reduction_current + +filtered_data[i]["tt_reduction"];
            
        }
        
    }

    tt_reduction_current = tt_reduction_current / filtered_data.length; 


    updateCharts(filtered_data);

}

function populateRetimeCount(divId, dataset) {
    
    var goal = ANNUAL_GOALS[selected_year]["retime_goal"]; 

    d3.select("#" + divId)
        .select("h2")
        .text("0")
        .transition(t)
        .tween("text", function () {
            
            var that = d3.select(this);

            var i = d3.interpolate(retime_previous, retime_current);
            
            return function (t) {
            
                that.text( Math.round(i(t)) + " / " + goal);
            
            }    
    });
}


function populateTTstat(divId, dataset) {

    var goal = ANNUAL_GOALS[selected_year]["avg_reduction_goal"]; 
    
    d3.select("#" + divId)
        .append("text")
        .text(formatPct(tt_reduction_previous))
        .transition(t)
        .attr("class", function(){
            if (tt_reduction_current >= +goal) {
                return "goal-met";
            } else {
                return "goal-unmet"
            }
        })
        .tween("text", function () {
            
            var that = d3.select(this);

            var i = d3.interpolate(0, tt_reduction_current);
            
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
            if (tt_reduction_current >= +goal) {
                return "goal-met";
            } else {
                return "goal-unmet"
            }
        })
        .tween("text", function () {
            
            var that = d3.select(this);

            var i = d3.interpolate(tt_reduction_previous, tt_reduction_current);
            
            return function (t) {
            
                that.text( formatPct(i(t)) );
            
            }

        });
        
}

function createProgressChart(divId, dataset) {

    var goal = ANNUAL_GOALS[selected_year]["retime_goal"];

    var values = [goal, goal-retime_current];  //  init data for 50/50 gaugei 

    var keys = ["planned","done"];  

    var width = 200;

    var height = 200;

    var radius = 100;

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

    pie_path = svg.datum(values).selectAll("path")
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

    svg.append("g").append("text")
        .style("text-anchor", "middle")
        .attr("class", "pieText")
        .html(function (d) {
            //  return formatPct(retime_current / goal);
            return
        });
        
}

function updateRetimeCount(divId, dataset) {

    var goal = ANNUAL_GOALS[selected_year]["retime_goal"];

    d3.select("#" + divId)
        .select("h2")
        .transition(t)
        .tween("text", function () {
            
            var that = d3.select(this);

            var i = d3.interpolate(retime_previous, retime_current);
            
            return function (t) {
            
                that.text( Math.round(i(t)) + " / " + goal );
            
            }    
    });

}


function updateProgressChart(divId, dataset){

    var goal = ANNUAL_GOALS[selected_year]["retime_goal"];

    var values = [goal, goal-retime_current];  //  init data for 50/50 gaugei 

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

        var rows = d3.select("tbody")
            .selectAll("tr")
            .data(dataset)
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

