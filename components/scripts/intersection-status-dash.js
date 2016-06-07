    //  v0.1
    //
    //  todo:
    //  the way you're doing applyStatusTypes is probably breaky
    //  declare variables ;)
    //  upgrade to d4!
    //  scale charts based on div size?
    //  populate zeros for status types

    // globals
    var data, signals;
    var cool;
    var width = 200;    
    var height = 200;
    
    var STATUS_TYPES = {
        0: "ok",
        1: "cab_flash",
        2: "conflict_flash",
        3: "comm_fail",
        5: "comm_disabled",
        11: "police_flash"
    }

    d3.csv("../components/data/intersection_status_snapshot.csv", function(d) {
        
        data = d;

        var pie_array = d3.values(int_stats);

        var int_stats = d3.nest()
            .key(function (d) { return d.intstatus; })
            .rollup(function (v) { return v.length; })
            .map(d);

        applyStatusTypes(int_stats);

        var poll_stats = d3.nest()
            .key(function (d) { return d.pollstatus; })
            .rollup(function (v) { return v.length; })
        
        makePieChart(int_stats, "chart-1");

        populateInfoStat(int_stats[2], "info-1");  // unscheduled flash

        populateInfoStat(int_stats[1], "info-2");  // unscheduled flash

        populateInfoStat(int_stats[3], "info-3");  // unscheduled flash

        makeMap(data);

    });

    function makePieChart(dataset, divId) {
        
        var values = d3.values(dataset);  //  what's a better way to do this?

        var keys = d3.keys(dataset);  //  the challenge is accessing the keys for assigning classes

        var radius = Math.min(width, height) / 2;

        var pie = d3.layout.pie()  //  not d4 compatible
            .sort(null)
            .value(function (d) {
               return d;
            });

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
                return STATUS_TYPES[keys[i]] + " arc";
            })
            .attr("id", "pie")
            .append("path")
            .attr("d", arc)
            .attr("stroke", "white")
            .each(function (d) {
                this._current = d;
            }); // store the current angles
            
    } //end make pie chart
    
    function populateInfoStat(dataset, divId) {
        
        d3.select("#" + divId)
            .append("text")
            .attr("class", "infoStat")
            .text(dataset);
        
    }

    function makeMap(dataset){

        var map = new L.Map("map", {
            center : [30.28, -97.735],
            zoom : 12,
            minZoom : 1,
            maxZoom : 20,
            scrollWheelZoom: false
        });      // make a map
                
        var Stamen_TonerLite = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
            attribution : 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            subdomains : 'abcd',
            minZoom : 0,
            maxZoom : 20,
            ext : 'png'
        })
        .addTo(map);

        populateMap(map, dataset);

    }

    function populateMap(map, dataset){

        if (map.hasLayer(signals)) {

            map.removeLayer(signals); 

        }

        signals = new L.featureGroup();
        
        for (var i = 0; i < dataset.length; i++){
            
            var status = +dataset[i].intstatus;

            if (status == 1){
        
                var lat = data[i].latitude;
        
                var lon = data[i].longitude;

                var address = data[i].intname;

                var marker = L.marker([lat,lon])
                    .bindPopup(
                        address + "<br>"+ "<b>Status: </b>"+ STATUS_TYPES[status]
                    )
                    .addTo(signals);
            }
            
        }

        signals.addTo(map);

        map.fitBounds(signals.getBounds());

    }

    function applyStatusTypes(statusObject){

        for (statusType in STATUS_TYPES) {

            if (!(statusType in statusObject)) {

                statusObject[statusType] = 0;
                
            }
        }
    }




