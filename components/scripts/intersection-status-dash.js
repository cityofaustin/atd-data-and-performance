    var data;
    
    var STATUS_TYPES = {
        0:"OK",
        3: "COMM FAIL",
        5: "COMM DISABLED"
    }
    
    var width = 500;
    var height = 500;
    
    d3.csv("./data/intersection_status_snapshot.csv", function(d) {
        data = d;
    
        var int_count = data.length;
                
        var int_stats = d3.nest()
            .key(function (d) { return d.intstatus; })
            .rollup(function (v) { return v.length; })
            .map(data)
        
        var comm_status = [
            { "kind" : "without_comm", "value" : int_stats[5]},
            { "kind" : "with_comm", "value" : data.length - int_stats[5] }
        ]
        
         makePieChart(d3.values(comm_status), "chart_1");
         
    });
    
    function makePieChart(dataset, divId) {
        
        var radius = Math.min(width, height) / 2;

        // format for pie chart
        pie = d3.layout.pie()
            .sort(null)
            .value(function (d) {
                return d.value;
            });

        arc = d3.svg.arc()
            .outerRadius(radius)
            .innerRadius(radius - 100);

        var svg = d3.select("#" + divId).append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        path1 = svg.datum(dataset).selectAll("path")
            .data(pie)
            .enter().append("g").attr("class", "arc").attr("id", "pie")
            .append("path")
            .attr("d", arc)
            .attr("fill",  function(d){
                if (d.data.kind == "with_comm") { return "#00127A"} else { return "#D10F88"}
            })
            .attr("stroke", "white")
            .each(function (d) {
                this._current = d;
            }); // store the current angles
            
    } //end make pie chart