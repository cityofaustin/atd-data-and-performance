
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

var retime_goal = +ANNUAL_GOALS[selected_year]["retime_goal"];

var reduction_goal = +ANNUAL_GOALS[selected_year]["avg_reduction_goal"];

var data_url = "../components/data/dummy_retiming_data.json";

var source_data;

var formatPct = d3.format("1.0%");

d3.json(data_url, function(dataset) {

    source_data = dataset;

    filterData(source_data, function(filtered_data){

        populateRetimeCount("info-1", filtered_data);

        createProgressChart("info-1", filtered_data);

        createPieChart("info-2", filtered_data);

        populateTable(filtered_data);

    });

});

d3.select("#year-selector").on("change", function(d){
    
    selected_year = d3.select(this).property("value");

    filterData(source_data, function(filtered_data){

        updateRetimeCount("info-1", filtered_data);

        updateProgressChart("info-1", filtered_data);

        //  createProgressChart("info-1", filtered_data);

        //  createPieChart("info-2", filtered_data);

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

    updateCharts(filtered_data);

}

function populateRetimeCount(divId, dataset) {
    
    var goal = ANNUAL_GOALS[selected_year]["retime_goal"]; 

    var t = d3.transition()
        .ease(d3.easeLinear)
        .duration(retime_current * delay_val);

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


function createPieChart(divId, dataset) {

    values = [.55, .45];  //  init data for 50/50 gaugei 

    keys = ["done","planned"];  //  the challenge is accessing the keys for assigning classes

    var width = 400;

    var height = 200;

    var radius = 150;

     var pie = d3.pie()  //  not d4 compatible
            .sort(null)
            .value(function (d) {
               return d;
            })
            .startAngle(-1.6)
            .endAngle(1.6);

    var arc = d3.arc()
        .outerRadius(radius)
        .innerRadius(radius * .5);

    var svg = d3.select("#" + divId).append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height + ")");

    var path1 = svg.datum(values).selectAll("path")
        .data(pie)
        .enter()
        .append("g")
        .attr("class", function(d, i) {
            return "arc";
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
            return formatPct(.05);
        });

}

function createProgressChart(divId, dataset) {

    var goal = ANNUAL_GOALS[selected_year]["retime_goal"];

    var t = d3.transition()
        .ease(d3.easeLinear)
        .duration(retime_current * delay_val);

    // layout params
    var w = progChartWidth;  //  fixed height chart

    var block_length = w * .06;  //  fixed block dimensions

    var padFactor = .1;

    var cols = w / ( (block_length * padFactor) + block_length );    
    
    var cols = Math.floor(cols);  //  round # of rows down to avoid truncating

    var rows = Math.ceil( goal / cols );  //  round # of cols up to avoid truncating
    
    var h = rows * ( (block_length * padFactor) + block_length );

    //  create chart data
    rect_data = [];

    for (var i = 0; i < rows; i++) {

        for (var q = 0; q < cols; q++){

            var x = (block_length * q) + ( q * block_length * padFactor );
        
            var y = (block_length * i) + ( i * block_length * padFactor );

            if (rect_data.length + retime_current < goal) {

                var block_class = "not-highlighted";    
            
            } else {
             
                var block_class = "highlighted";
            
            }
        
            rect_data.push({ 
                "x" : x, 
                "y" : y,
                "class" : block_class
            })
        
        }
    
    }

    rect_data = rect_data.reverse();

    var svg2 = d3.select("#" + divId)
        .select("svg")
        .attr("height", h)
        .attr("width", w);

    var rects = svg2.append("g").selectAll("rect")
        .data(rect_data)
        .enter()
        .append("rect")
        .attr("height", block_length)
        .attr("width", block_length)
        .attr("x", function(d) {
            return d.x;
        })
        .attr("y", function(d){
            return d.y;
        })
        .attr("class", function(d){
                    return d.class;
        });

    d3.selectAll(".highlighted")
        .transition()
        .delay(function(d, i) { return i * delay_val; })
        .on("start", function repeat() {
            d3.active(this)
                .style("fill", "green");
    });
        
}

function updateRetimeCount(divId, dataset) {

    console.log(retime_current);

    var goal = ANNUAL_GOALS[selected_year]["retime_goal"];

    var t = d3.transition()
        .ease(d3.easeLinear)
        .duration(retime_current * delay_val);

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

    var t = d3.transition()
        .ease(d3.easeLinear)
        .duration(retime_current * delay_val);

    var w = progChartWidth;  //  fixed height chart

    var block_length = w * .06;  //  fixed block dimensions

    var padFactor = .1;

    var cols = w / ( (block_length * padFactor) + block_length );    
    
    var cols = Math.floor(cols);  //  round # of rows down to avoid truncating

    var rows = Math.ceil( goal / cols );  //  round # of cols up to avoid truncating
    
    var h = rows * ( (block_length * padFactor) + block_length );

    //  create chart data
    rect_data = [];

    for (var i = 0; i < rows; i++) {

        for (var q = 0; q < cols; q++){

            var x = (block_length * q) + ( q * block_length * padFactor );
        
            var y = (block_length * i) + ( i * block_length * padFactor );

            if (rect_data.length + retime_current < goal) {

                var block_class = "not-highlighted";    
            
            } else {
             
                var block_class = "highlighted";
            
            }
        
            rect_data.push({ 
                "x" : x, 
                "y" : y,
                "class" : block_class
            })
        
        }
    
    }

    rect_data = rect_data.reverse();

    d3.select("#" + divId)
        .select("svg")
        .select("g").remove();
            

    d3.select("#" + divId)
        .select("svg")
        .transition(t)
        .attr("height", h)
        .attr("width", w)

    var rects = d3.select("#" + divId)
        .select("svg")
        .append("g").selectAll("rect")
        .data(rect_data)
        .enter()
        .append("rect")
        .attr("height", block_length)
        .attr("width", block_length)
        .attr("x", function(d) {
            return d.x;
        })
        .attr("y", function(d){
            return d.y;
        })
        .attr("class", function(d){
                    return d.class;
        });


    d3.selectAll(".highlighted")
        .transition()
        .delay(function(d, i) { return i * delay_val; })
        .on("start", function repeat() {
            d3.active(this)
                .style("fill", "green");
    });


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









