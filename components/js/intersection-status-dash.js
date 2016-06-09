    //  v0.1
    //
    //  todo:
    //  animate chart pct - WTF?
    //  home button, layer control on map
    //  tooltips
    //  nav tweaks and icons
    //  the way you're doing applyStatusTypes is probably breaky
    //  declare variables ;)
    //  upgrade to d4!
    //  scale charts based on div size?
    //  populate zeros for status types
    //  ajax errorhandling
    //  table anchors so you can go 'back' from feature click
    //

    // globals
    var signals, cool;
    
    var width = 100;    
    
    var height = 100;

    var signal_markers = {};

    var formatPct = d3.format("%");

    var data_url = "../components/data/intersection_status_snapshot.json";
    
   //  live data!
   // var data_url = "https://data.austintexas.gov/resource/5zpr-dehc.json";

    var STATUS_TYPES = {
        0: "ok",
        1: "cab_flash",
        2: "conflict_flash",
        3: "comm_fail",
        5: "comm_disabled",
        11: "police_flash"
    };

    var COMM_TYPES = {
        0: "no_comm",
        1: "ok"
    };

    var STATUS_TYPES_READABLE = {
        0: "OK",
        1: "Cabinet Flash",
        2: "Conflict Flash",
        3: "Comm Fail",
        5: "Comm Disabled",
        11: "Police Flash"
    };

    var conflict_flashMarker = new L.ExtraMarkers.icon({
        icon: 'fa-exclamation-triangle',
        markerColor: 'red',
        shape: 'circle',
        prefix: 'fa'
    });

    var comm_failMarker = new L.ExtraMarkers.icon({
        icon: 'fa-phone',
        markerColor: 'yellow',
        shape: 'circle',
        prefix: 'fa'
    });

    var cab_flashMarker = new L.ExtraMarkers.icon({
        icon: 'fa-exclamation-triangle',
        markerColor: 'yellow',
        shape: 'circle',
        prefix: 'fa'
    });

    var MARKER_ICONS = {
        1 : cab_flashMarker,
        2 : conflict_flashMarker,
        3 : comm_failMarker
    }
    
    getData(data_url);

    d3.selectAll(".feature_link").on("click", function(d){

        var marker_id = d3.select(this).attr("data-intid");
        
        map.setZoom(15).panTo(signal_markers[marker_id].getLatLng());

        signal_markers[marker_id].openPopup();

    })

    // 
    function main(data){

        cool = data;

        var pie_array = d3.values(int_stats);

        var int_stats = d3.nest()
            .key(function (d) { return d.intstatus; })
            .rollup(function (v) { return v.length; })
            .map(data);

        applyStatusTypes(int_stats);

        var poll_stats = d3.nest()
            .key(function (d) { return d.pollstatus; })
            .rollup(function (v) { return v.length; })
            .map(data);
        
        cool = poll_stats;

        makePieChart(poll_stats, "chart-1");

        populateInfoStat(int_stats[2], "info-1");  // unscheduled flash

        populateInfoStat(int_stats[1], "info-2");  // scheduled flash

        populateInfoStat(int_stats[3], "info-3");  // comm fail

        makeMap(data);

    };

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
                return COMM_TYPES[keys[i]] + " arc";
            })
            .attr("id", "pie")
            .append("path")
            .attr("d", arc)
            .attr("stroke", "white")
            .each(function (d) {
                this._current = d;
            }); // store the current angles
            
        svg.append("g").append("text")
            .style("text-anchor", "middle")
            .attr("class", "info")
            .text(function(){
                var not_polled = dataset[0];
                
                var is_polled = dataset[1];
                
                return formatPct((is_polled/(not_polled + is_polled)));

            });
            

        //  updatePieChart(dataset, divId);

    } //  end make pie chart
    
    function populateInfoStat(dataset, divId) {
    
         d3.select("#" + divId)
            .append("text")
            .attr("class", "infoStat")
            .text('0');

        updateInfoStat(dataset, divId);

    }

    function updateInfoStat(dataset, divId) {

        if (dataset) {
            d3.select("#" + divId)
                .select("text")
                .transition()
                .duration(1000)
                .ease("quad")
                .tween("text", function () {
                    
                    var i = d3.interpolate(this.textContent, dataset);
                    
                    return function (t) {
                    
                        this.textContent = Math.round(i(t));
                    
                    }
                
                });
        }
    }

    function updatePieChart(dataset, divId){

        d3.select("#divId")
            .select(".info")
            .transition()
            .duration(750)
            .ease("quad")
            .tween("text", function (d) {
                
                var start = parseFloat(this.textContent); //parse out the % symbol - good job, javascript!
              
                if (isNaN(start)) {
                    start = 0;
                }

                console.log(start);

                var not_polled = dataset[0];
                
                var is_polled = dataset[1];
                
                var has_comm = (is_polled/(not_polled + is_polled)) * 100;
              
                var i = d3.interpolate(start, has_comm)
                    
                    return function (t) {

                    this.textContent = formatPct(Math.round(i(t)) / 100);
                }

            })

    }

    function makeMap(dataset){

        L.Icon.Default.imagePath = '../components/images/';

        map = new L.Map("map", {
            center : [30.28, -97.735],
            zoom : 12,
            minZoom : 1,
            maxZoom : 20,
            scrollWheelZoom: false
        });      // make a map
        
        var Thunderforest_Transport = L.tileLayer('http://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19
        }).addTo(map);

        var Stamen_TonerLite = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
            attribution : 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            subdomains : 'abcd',
            maxZoom : 20,
            ext : 'png'
        })

        var baseLayers = {
            "B&W": Stamen_TonerLite,
            "Color": Thunderforest_Transport
        };

        L.control.layers(baseLayers, null, {position: 'bottomleft'}).addTo(map);

        populateMap(map, dataset);

        populateTable(dataset);

    }

    function populateMap(map, dataset){

        if (map.hasLayer(signals)) {

            map.removeLayer(signals); 

        }

        signals = new L.featureGroup();
        
        for (var i = 0; i < dataset.length; i++){
            
            var status = +dataset[i].intstatus;

            if (status > 0 && status < 5) {

                if(dataset[i].latitude > 0) {

                    var lat = dataset[i].latitude;
            
                    var lon = dataset[i].longitude;

                    var address = dataset[i].intname;

                    var intid = dataset[i].intid;

                    var status_time = dataset[i].intstatusdatetime;
                    
                    var marker = L.marker([lat,lon], {
                            icon: MARKER_ICONS[status]  
                        })
                        .bindPopup(
                            "<b>" + address + "</b><br>" +
                            "<b>Status: </b>" + STATUS_TYPES_READABLE[status] + 
                            "<br><b>Updated:</b> " + status_time
                        )
                        .addTo(signals);

                    signal_markers[intid] = marker;
                }
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

    function getData(myurl){
        $.ajax({
            'async' : false,
            'global' : false,
            'cache' : false,
            'url' : myurl,
            'dataType' : "json",
            'success' : function (data) {
                main(data);
            }
        
        }); //end get data

    }


    function populateTable(data) {

        // only show not-OK records in the data table
        data = data.filter(function(d) { return d.intstatus > 0 && d.intstatus < 5; })

        var rows = d3.select("tbody")
            .selectAll("tr")
            .data(data)
            .enter()
            .append("tr")
            .filter(function(d){
                return d.intstatus > 0;
            })
            .attr("class", "tableRow");

        d3.select("tbody").selectAll("tr")
            .each(function (d) {
                d3.select(this).append("td").html(d.assetnum);
                d3.select(this).append("td").html("<a href='#map'" + "class='feature_link' data-intid=" + d.intid + " name=_" + d.intid + ">" + d.intname + "</a>");
                d3.select(this).append("td").html(STATUS_TYPES_READABLE[d.intstatus] + " (" + d.intstatus + ")");
                d3.select(this).append("td").html(d.intstatusprevious);
                d3.select(this).append("td").html(d.intstatusdatetime).attr("class", STATUS_TYPES[d.intstatusdatetime]);
                d3.select(this).append("td").html(d.pollstatus);
                d3.select(this).append("td").html(d.operationstate);
                d3.select(this).append("td").html(d.planid);
        })

        //  activate datatable sorting/search functionality
        $(document).ready(function () {
            $('#data_table').DataTable({
                paging : false
            });
        });

    } //  end populateTable

