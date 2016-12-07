    //  v0.1
    //
    //  todo:
    //  add data refresh date
    //  is it ok to have object keys as numb    ers? (NOPE)
    //  rescale chart on screen resize
    //  table row count does not update (because you're not adding rows with the native api)
    //  animations choppy::wait to populat map until chart update
    //  tooltips
    //  declare variables ;)
    //  upgrade to d4!
    //  ajax errorhandling
    //  table anchors so you can go 'back' from feature click
    //
    //  var metadataUrl_cases = "https://data.austintexas.gov/api/views/5zpr-dehc/rows.json"  
    //
    // globals
    var int_stats, table;
    
    var signal_markers = {};

    var map_expanded = false;

    var signal_layers = {};

    var formatPct = d3.format("%");
    
    var formatDateTime = d3.time.format("%e %b %Y %H:%M%p");

    //  static data
    var data_url = "../components/data/intersection_status_snapshot.json";

    //  live data!
    var data_url = "https://data.austintexas.gov/resource/5zpr-dehc.json";

    var filters = [];

    var default_map_size = 300;

    var expanded_map_size = 600;

    var default_filters = [1, 2, 3];

    var master_layer = new L.featureGroup();

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

    var STATUS_TYPE_CODES = [0,1,2,3,5,11];  //  :(

    var conflict_flashMarker = new L.ExtraMarkers.icon({
        icon: 'fa-exclamation-triangle',
        markerColor: 'red',
        shape: 'circle',
        prefix: 'fa'
    });

    var comm_failMarker = new L.ExtraMarkers.icon({
        icon: 'fa-exclamation-triangle',
        markerColor: 'blue',
        shape: 'square',
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

    //  calculate diff b/t arrays (http://stackoverflow.com/questions/1187518/javascript-array-difference);
    Array.prototype.diff = function(a) {

        return this.filter(function(i) {return a.indexOf(i) < 0;});

    };

    
    getData(data_url);


    //  zoom to feature from table click
    d3.selectAll(".feature_link").on("click", function(d){

        var marker_id = d3.select(this).attr("data-intid");

        map.setView(signal_markers[marker_id].getLatLng(), 13);

        signal_markers[marker_id].openPopup();

    })

    //  fitering
    d3.selectAll(".info").on("click", function(d){
        
        var current_value = +d3.select(this).select("text").html();
        
        if (current_value == 0) {

            return;

        }

        var divId = d3.select(this).attr("id");

        var current_class = d3.select(this).attr("class");

        var status = d3.select(this).attr("data-status");

        if (current_class.indexOf("filtering") >= 0) {  //  if filtering
                        
            d3.select(this).classed("filtering", false);  //  disable filter class

            var index = filters.indexOf(+status);

            filters.splice(index, 1);  //  remove status from filter array

            if (filters.length > 0) {  //  if other filters still exist

                updateMap(filters);

                updateTable(filters);

                styleFilterButtons(filters);

            } else {  //  if layer was the only filtered layer, reset map to add all layers back

                updateMap(default_filters);

                updateTable(default_filters);

                styleFilterButtons(default_filters);

            }

        } else {

            d3.select(this).classed("filtering", true);  //  enable filter class

            filters.push(+status);  //  update filter array

            updateMap(filters);

            updateTable(filters);

            styleFilterButtons(filters);

        }

            //  zoom to feature from table click
        d3.selectAll(".feature_link").on("click", function(d){

            var marker_id = d3.select(this).attr("data-intid");

            map.setView(signal_markers[marker_id].getLatLng(), 14);

            signal_markers[marker_id].openPopup();

         })

    });

    d3.select("#map-expander").on("click", function(){
        
        var map_size = expanded_map_size;

        if (map_expanded) {

            map_expanded = false;
        
            map_size = default_map_size;
        
        } else {

            map_expanded = true;

        }

        d3.select("#map")
            .transition()
            .duration(500)
            .style("height", map_size + "px");

        setTimeout(function(){ map.invalidateSize()}, 600);

    })

    function main(dataset){

        int_stats = d3.nest()
            .key(function (d) { return d.intstatus; })
            .rollup(function (v) { return v.length; })
            .map(dataset);

        applyStatusTypes(int_stats);

        var poll_stats = d3.nest()
            .key(function (d) { return d.pollstatus; })
            .rollup(function (v) { return v.length; })
            .map(dataset);
        
        makeBarChart(poll_stats, "chart-1");

        populateInfoStat(int_stats[2], "info-2");  // conflict flash

        populateInfoStat(int_stats[1], "info-1");  // coordinated flash

        populateInfoStat(int_stats[3], "info-3");  // comm fail

        makeMap(dataset);

    };
    
    function makeBarChart(dataset, divId){
        
        var width = $("#" + divId).width();
        
        var height = 100;

        var keys = d3.keys(dataset);

        var no_comm_pct = dataset[0] / (dataset[0] + dataset[1]);
       
        var ok_pct = dataset[1] / (dataset[0] + dataset[1]);

        var values = [no_comm_pct, ok_pct];

         y = d3.scale.ordinal()
            .rangeRoundBands([0, height], .1)
            .domain(values);
        
         x = d3.scale.linear()
            .range([0, width-10])
            .domain([0 , 1]);

        var svg = d3.select("#" + divId).append("svg")
            .attr("height", height)
            .attr("width", width)
            .append("g");

        svg.selectAll(".bar")
            .data(values)
            .enter()
            .append("g")
            .append("rect")
            .attr("class", function(d, i){
                return "bar " + COMM_TYPES[keys[i]];
            })
            .attr("y", function(d) {
                return y(d);
            })
            .attr("x", 0)
            .attr("height", y.rangeBand())
            .attr("width", 0);

        updateBarChart(divId);

        svg.selectAll(".label")
            .data(values)
            .enter()
            .append("text")
            .attr("x", function(d) {
                return x(d) + 5;
            })
            .attr("y", function(d){
                return y(d) + (y.rangeBand()/2);
            })
            .text(function(d) {
                return formatPct(d);
            })
            .attr("color", "red")
 
    }

    function updateBarChart(divId) {
        
        d3.select("#" + divId).selectAll("rect")
            .transition()
            .duration(1000)
            .ease("quad")
            .attr("width", function(d) {
                return x(d);
            })

    }

    function populateInfoStat(dataset, divId) {
    
         d3.select("#" + divId)
            .append("text")
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

        } else {  //  if info value is 0

            d3.select("#" + divId)
                .style("cursor", "default");

        }
    }

    function makeMap(dataset) {

        L.Icon.Default.imagePath = '../components/images/';

        map = new L.Map("map", {
            center : [30.28, -97.735],
            zoom : 10,
            minZoom : 1,
            maxZoom : 20,
            scrollWheelZoom: false
        });      // make a map

        var Stamen_TonerLite = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
            attribution : 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            subdomains : 'abcd',
            maxZoom : 20,
            ext : 'png'
        }).addTo(map);

        populateMap(map, dataset);

        populateTable(dataset);

    }

    function populateMap(map, dataset) {

        for (var i in STATUS_TYPES) {

            signal_layers[STATUS_TYPES[i]] = new L.featureGroup();

        }
        
        for (var i = 0; i < dataset.length; i++) {   
            
            if(dataset[i].latitude > 0) {

                var status = +dataset[i].intstatus;

                var lat = dataset[i].latitude;
        
                var lon = dataset[i].longitude;

                var address = dataset[i].intname;

                var intid = dataset[i].intid;

                var status_time = dataset[i].intstatusdatetime;

                var assetnum = dataset[i].assetnum;
                
                var marker = L.marker([lat,lon], {
                        icon: MARKER_ICONS[status]  
                    })
                    .bindPopup(
                        "<b>" + assetnum + ": " + address + "</b><br>" +
                        "<b>Status: </b>" + STATUS_TYPES_READABLE[status] + 
                        "<br><b>Updated:</b> " + status_time
                    )

                if(status) {
                    
                    marker.addTo(signal_layers[STATUS_TYPES[status]]);
                
                }

                signal_markers[intid] = marker;
            }

        }

        for (var i = 0; i < default_filters.length; i++) {

            signal_layers[STATUS_TYPES[default_filters[i]]].addTo(master_layer);

        }

        master_layer.addTo(map);

        map.fitBounds(master_layer.getBounds(), {padding: [10, 10] });

    }

    function applyStatusTypes(statusObject) {

        for (statusType in STATUS_TYPES) {

            if (!(statusType in statusObject)) {

                statusObject[statusType] = 0;
                
            }
        }
    }

    function getData(myurl) {
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


    function populateTable(dataset) {

        // only show not-OK records in the data table
        dataset = dataset.filter(function(d) { return d.intstatus > 0 && d.intstatus < 5; })

        var rows = d3.select("tbody")
            .selectAll("tr")
            .data(dataset)
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
        
            });

        //  activate datatable sorting/search functionality
        $(document).ready(function () {
            table = $('#data_table').DataTable( {
                paging : false
            });
        });

    } //  end populateTable

    function updateMap(filter_arr) {

        var remove_from_map = STATUS_TYPE_CODES.diff(filter_arr); 

        for (var i = 0; i < filter_arr.length; i++) {
        
            if (master_layer.hasLayer(signal_layers[STATUS_TYPES[filter_arr[i]]])) {

                continue;
        
            } else {

                master_layer.addLayer(signal_layers[STATUS_TYPES[filter_arr[i]]]);

            }
        
        }

        for (var i = 0; i < remove_from_map.length; i++) {

            if (master_layer.hasLayer(signal_layers[STATUS_TYPES[remove_from_map[i]]])) {
                
                master_layer.removeLayer(signal_layers[STATUS_TYPES[remove_from_map[i]]]);
            }
        
        }

        map.fitBounds(master_layer.getBounds(), {padding: [10, 10] });

    }

    function updateTable(filter_arr) {

        d3.select("tbody").selectAll("tr").selectAll("td").remove();

        d3.select("tbody").selectAll("tr")
            .filter(function (d) {
                
                return filter_arr.indexOf(+d.intstatus) > -1;
            })         
            .each(function (d) {
            
                d3.select(this).append("td").html(d.assetnum);
                
                d3.select(this).append("td").html("<a href='#map'" + "class='feature_link' data-intid=" + d.intid + " name=_" + d.intid + ">" + d.intname + "</a>");
                
                d3.select(this).append("td").html(STATUS_TYPES_READABLE[d.intstatus] + " (" + d.intstatus + ")");
                
                d3.select(this).append("td").html(d.intstatusprevious);
                
                d3.select(this).append("td").html(d.intstatusdatetime).attr("class", STATUS_TYPES[d.intstatusdatetime]);
                
                d3.select(this).append("td").html(d.pollstatus);
                
                d3.select(this).append("td").html(d.operationstate);
                
                d3.select(this).append("td").html(d.planid);

            });

    }

    function styleFilterButtons(filter_arr) {

        var filters_to_disable = STATUS_TYPE_CODES.diff(filter_arr) 

        for (var i = 0; i < filters_to_disable.length; i++)  {


            d3.select("#info-" + filters_to_disable[i]).classed("action-disabled", true);
        }

        for (var i = 0; i < filter_arr.length; i++)  {

            d3.select("#info-" + filter_arr[i]).classed("action-disabled", false);

        }

    }


    function postUpdateDate(data){

        var update_date = new Date(data.meta.view.rowsUpdatedAt * 1000);
        
        var update_date = formatDateTime(update_date);
        
        $('#update_date').text("Data updated " + update_date);
        
    }
