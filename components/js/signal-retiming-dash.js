var ANNUAL_GOALS = {
    "2016" : {
        retime_goal: 200,
        avg_reduction_goal: .05    
    },
    "2015" : {
        retime_goal: 300,
        avg_reduction_goal: .05  
    }    
};

var selected_year = "2016";

var retime_goal = +ANNUAL_GOALS[selected_year]["retime_goal"];

var reduction_goal = +ANNUAL_GOALS[selected_year]["avg_reduction_goal"];

var data_url = "../components/data/intersection_status_snapshot.json";

var john;

var pizza; 

d3.json(data_url, function(dataset) {

    //  var compare_date = new Date(selected_year);
    var compare_date = new Date("6/07/2016");  //  dumb dumb for dev

    dataset = dataset.filter(function(data) {
            var row_date = new Date(data["intstatusdatetime"]);
            return row_date > compare_date;
        });  // filter for selected fiscal year

    john = dataset;
    
    var retime_current = 85;  //  actually should calculate from data

    var reduce_total = 0;

    for (var i = 0; i < dataset.length; i++) {
        //  reduce_total = reduce_total + dataset[i]["trave_time_reduced"];
        reduce_total = reduce_total + i;  // bs for dev
    }  

    var avg_reduction = ( reduce_total / retime_current );

    populateStat("info-1", retime_current);

    createPieChart("info-2", dataset);

});

d3.select("#year-selector").on("change", function(d){
    
    populateStat("info-1", 300);


})

makeCircles("info-1");

function getSelectedYear(){

    var selected_year = d3.select("#year-selector").select("option").attr("value");
    
    return selected_year;

}

function populateStat(divId, statValue) {

    d3.select("#" + divId)
        .select("h2")
        .text("0")
        .transition()
        .duration(400)
        .ease("quad")
        .tween("text", function () {
            
            var i = d3.interpolate(this.textContent, statValue);
            
            return function (t) {
            
                this.textContent = Math.round(i(t));
            
            }    
    });
}



function createPieChart(divId, dataset) {

     poll_stats = d3.nest()
            .key(function (d) { return d.pollstatus; })
            .rollup(function (v) { return v.length; })
            .map(dataset);

     values = d3.values(poll_stats);  //  what's a better way to do this?

     keys = d3.keys(poll_stats);  //  the challenge is accessing the keys for assigning classes


    var width = 400;

    var height = 300;

    var radius = 150;

    var COMM_TYPES = {
        0: "no_comm",
        1: "ok"
    };

     var pie = d3.layout.pie()  //  not d4 compatible
            .sort(null)
            .value(function (d) {
               return d;
            })
            .startAngle(-1.55)
            .endAngle(1.55);

    var arc = d3.svg.arc()
        .outerRadius(radius)
        .innerRadius(radius * .5);

    var svg = d3.select("#" + divId).append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var path1 = svg.datum(values).selectAll("path")
        .data(pie)
        .enter()
        .append("g")
        .attr("class", function(d, i) {
            return COMM_TYPES[keys[i]] + " arc";
        })
        .attr("id", "pie")
        .append("path")
        .attr("d", arc)
        .attr("stroke", "white")
        .each(function (d) {
            this._current = d;
    }); // store the current angles
}


function makeCircles(divId) {

    var goal = ANNUAL_GOALS[selected_year]["retime_goal"];

    var retime_current = 85;

    // layout params
    var h = 200;  //  fixed height chart

    var block_length = 15;  //  fixed block dimensions

    var padFactor = .05;

    var rows = h / ( (block_length * padFactor) + block_length );    
    
    var rows = Math.floor(rows);  //  round # of rows down to avoid truncating

    var cols = Math.ceil( goal / rows );  //  round # of cols up to avoid truncating
    
    var w = cols * ( (block_length * padFactor) + block_length );

    //  create chart data
    rects = [];

    for (var i = 0; i < rows; i++) {

        for (var q = 0; q < cols; q++){

            //  if (rects.length == goal) {
//                  break;
    //          }

            var x = (block_length * q) + ( q * block_length * padFactor );
        
            var y = (block_length * i) + ( i * block_length * padFactor );

            if (rects.length + retime_current < goal) {

                var block_class = "not-highlighted";    
            
            } else {
             
                var block_class = "highlighted";
            
            }
        
            rects.push({ 
                "x" : x, 
                "y" : y,
                "class" : block_class
            })
        
        }
    
    }

    rects = rects.reverse();

    var svg2 = d3.select("#" + divId)
        .append("svg")
        .attr("height", h)
        .attr("width", w);

    svg2.selectAll("rect")
        .data(rects)
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

}


















