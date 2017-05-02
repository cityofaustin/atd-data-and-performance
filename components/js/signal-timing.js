var ANNUAL_GOALS = {
    
    "2018" : {
        retime_goal: 250,
        travel_time_reduction: .05,
        stops_reduction: 0,
    },
    
    "2017" : {
        retime_goal: 360,
        travel_time_reduction: .05,
        stops_reduction: 3,
    },

    "2016" : {
        retime_goal: 200,
        travel_time_reduction: .05,
        stops_reduction: .10,  //   ??
    },

    "2015" : {
        retime_goal: 150,
        travel_time_reduction: .05,
        stops_reduction: 6,  
    }    

};


var SYSTEM_RETIMING_URL = 'https://data.austintexas.gov/resource/g8w2-8uap.json';

var SYSTEM_INTERSECTIONS_URL = 'https://data.austintexas.gov/resource/efct-8fs9.json';

var LOGFILE_URL = "https://data.austintexas.gov/resource/n5kp-f8k4.json?$query=SELECT * WHERE event='signal_retiming' AND (created > 0 OR updated > 0 OR deleted > 0) ORDER BY timestamp DESC LIMIT 1";

var STATUS_SELECTED = 'COMPLETED';

var SOURCE_DATA_SYSTEMS;  //  populates table

var GROUPED_RETIMING_DATA;  //  powers the data viz

var GROUPED_DATA_INTERSECTIONS;

var UNIQUE_SIGNALS_RETIMED = {};

var SYSTEM_IDS = {};

var tau = 2 * Math.PI,
    arc;

var selected_year = "2017";  //  init year selection

var previous_selection = "2015";

var formatPct = d3.format(".1%");

var formatPctInt = d3.format("1.0%");

var formatDate = d3.timeFormat("%x");

var formatTime = d3.timeFormat("%-I:%M %p");

var formatSeconds = d3.timeFormat("%Mm %Ss");

var FORMAT_TYPES = {
    "retiming_progress" : formatPctInt,
    "travel_time_reduction" : formatPct,
    "stops_reduction" : formatPct
};

var STATUS_TYPES_READABLE = {
    'PLANNED': 'Planned',
    'IN_PROGRESS': 'In Progress',
    'COMPLETED': 'Completed'
};


var t1_duration = 1200;

var t1 = d3.transition()
    .ease(d3.easeQuad)
    .duration(t1_duration);

var t2_duration = 1000;

var t2;

var map;

var color_index =.9;

var HIGHLIGHT_STYLE = {
    color: '#fff',
    weight: 1,
    fillColor: '#d95f02',
    fillOpacity: .9
}


var DEFAULT_STYLE = {
    color: '#fff',
    weight: 1,
    fillColor: '#7570b3',
    fillOpacity: .8
}


var SCALE_THRESHOLDS = {
    '$1': 500,
    '$2': 500,
    '$3': 500,
    '$4': 500,
    '$5': 500,
    '$6': 500,
    '$7': 500,
    '$8': 500,
    '$9': 500,
    '$10': 500,
    '$11': 400,
    '$12': 250,
    '$13': 150,
    '$14': 100,
    '$15': 50,
    '$16': 40,
    '$17': 25,
    '$18': 10,
    '$19': 10,
    '$20': 10,
};

var SIGNAL_MARKERS = [];

var map_expanded = false;

var default_map_size = 300;

var expanded_map_size = 600;

var SYSTEMS_LAYERS = {};

var visible_layers = new L.featureGroup();

var table_height = '40vh';

$(document).ready(function () {

    if (is_touch_device()) {
        
        d3.select('.map')
            .style("margin-right", "10px")
            .style("margin-left", "10px");
    }
});

var collapsed_class = 'col-sm-6';

var expanded_class = 'col-sm-12'

//  fetch retiming data
d3.json(SYSTEM_RETIMING_URL, function(dataset) {

    SOURCE_DATA_SYSTEMS = dataset;

    d3.json(SYSTEM_INTERSECTIONS_URL, function(dataset_2) {

        GROUPED_DATA_INTERSECTIONS = dataset_2;

        groupData(SOURCE_DATA_SYSTEMS, function() {

            createProgressChart("info-1", "retiming_progress");

            populateInfoStat("info-2", "travel_time_reduction", t1);

            populateTable(SOURCE_DATA_SYSTEMS, function(){

                getLogData(LOGFILE_URL);

                createTableListeners();

            });

        });


        makeMap(GROUPED_DATA_INTERSECTIONS, function(map, dataset) {

            populateMap(map, dataset);

            map.on('zoomend', function() {

                setMarkerSizes();

            });


            d3.select("#map-expander").on("click", function(){

                if (map_expanded) {
        
                    map_expanded = false;
                    collapseMap('table_col', 'map_col');

                } else {
                    
                    map_expanded = true;

                    expandMap('table_col', 'map_col');
                }

            });

        });

    });

});



function groupData(dataset, updateCharts) {

    GROUPED_RETIMING_DATA = 
        d3.nest()
            .key(function (d) {
                return d.scheduled_fy;
            })
            .key(function (q){
                return q.retime_status;
            })
            .rollup(function (v) {
                return {
                    travel_time_change : d3.sum(v, function(d) {
                        return d.vol_wavg_tt_seconds;
                    }) / d3.sum(v, function(d) {
                        return d.total_vol;
                    }),

                    signals_retimed : d3.sum(v, function(d) {
                        return d.signal_count; 
                    })

                };
            })
            .map(dataset); 

    //  calculate travel time
    for (var i in GROUPED_RETIMING_DATA){

        for (var q in GROUPED_RETIMING_DATA[i]) {
            
            GROUPED_RETIMING_DATA[i][q]['travel_time_reduction'] = +GROUPED_RETIMING_DATA[i][q]['travel_time_change'];

        }
        
    }

    //  calculate unique signals re-timed
    for (var i = 0; i < GROUPED_DATA_INTERSECTIONS.length; i++) {

        for (var q = 0; q < SOURCE_DATA_SYSTEMS.length; q++) {

            var signal_id = parseInt(+GROUPED_DATA_INTERSECTIONS[i].signal_id);

            var system_id_source = +GROUPED_DATA_INTERSECTIONS[i].system_id;

            var system_id_system = +SOURCE_DATA_SYSTEMS[q].system_id;

            if (system_id_source == system_id_system) {

                if (SOURCE_DATA_SYSTEMS[q].retime_status == 'COMPLETED') {

                    var fy = "$" + SOURCE_DATA_SYSTEMS[q].scheduled_fy;

                    if (!(fy in UNIQUE_SIGNALS_RETIMED)) {

                        UNIQUE_SIGNALS_RETIMED[fy] = [];

                    }   

                    if (UNIQUE_SIGNALS_RETIMED[fy].indexOf(signal_id ) < 0) {

                        UNIQUE_SIGNALS_RETIMED[fy].push(signal_id);

                    }

                }

            }

        }

    }

    updateCharts();

    createYearSelectors("selectors", function(){

        d3.select("#selectors").selectAll(".btn").on("click", function(d){

            d3.select("#selectors").selectAll(".btn").classed("active", false)

            d3.select(this).classed("active", true);

            t2 = d3.transition()
                .ease(d3.easeQuad)
                .duration(t2_duration);
            
            previous_selection = selected_year;

            selected_year = d3.select(this).node().value;

            updateProgressChart("info-1", t2);

            updateInfoStat("info-2", "travel_time_reduction", t2);

            populateTable(SOURCE_DATA_SYSTEMS, function(){

                createTableListeners();

            });

            updateVisibleLayers(map);

        });

    });

}


function createYearSelectors(divId, createListeners) {

    data = GROUPED_RETIMING_DATA.keys().sort();

    //  data = ['2017', '2016', '2015'];

    d3.select("#" + divId)
        .selectAll("button")
        .data(data)
        .enter()
        .append("button")
        .attr("type", "button")
        .attr("class", function(d, i) {

            if (data[i] == selected_year) {
        
                return "btn btn active";
        
            }  else {
                
                return "btn btn";

            }

        })
        .text(function(d) {
            return d;
        })
        .attr("value", function(d) {
            return +d;
        });

    createListeners();
}



function populateInfoStat(divId, metric, transition) {

    var goal = ANNUAL_GOALS[selected_year][metric]; 

    if ("$" + STATUS_SELECTED in GROUPED_RETIMING_DATA["$" + selected_year]) {

        var metric_value = GROUPED_RETIMING_DATA["$" + selected_year]["$" + STATUS_SELECTED][metric];
    
    } else{

        var metric_value = 0;
    }
    
    d3.select("#" + divId)
        .append("text")
        .text(FORMAT_TYPES[metric](0))
        .transition(transition)
        .attr("class", function(){
            if (metric_value >= +goal) {
                return "goal-met";
            } else {
                return "goal-unmet"
            }
        })
        .tween("text", function () {
            
            var that = d3.select(this);

            var i = d3.interpolate(0, metric_value);
            
            return function (t) {
            
                that.text( FORMAT_TYPES[metric](i(t)) );
            
            }

        });
        
    d3.select("#" + divId)
        .selectAll(".goal-text").remove();

    d3.select("#" + divId)
        .append("h5")
        .attr("class", "goal-text")
        .text("FY" + selected_year + " Goal: " + FORMAT_TYPES[metric](goal));

}



function updateInfoStat(divId, metric, transition) {

    var goal = ANNUAL_GOALS[selected_year][metric]; 

    if (GROUPED_RETIMING_DATA["$" + previous_selection]["$" + STATUS_SELECTED]) {

        var metric_value_previous = GROUPED_RETIMING_DATA["$" + previous_selection]["$" + STATUS_SELECTED][metric];

    } 
    
    if (GROUPED_RETIMING_DATA["$" + selected_year]["$" + STATUS_SELECTED]) {

            var metric_value = GROUPED_RETIMING_DATA["$" + selected_year]["$" + STATUS_SELECTED][metric];

    }

    if (!(metric_value_previous) ) {
        var metric_value_previous = 0;
    }

    if (!(metric_value) ) {
        var metric_value = 0;
    }

    d3.select("#" + divId)
        .select("text")
        .transition(transition)
        .attr("class", function(){

            if (metric_value >= +goal) {
                return "goal-met";
            } else {
                return "goal-unmet"
            }
        })
        .tween("text", function () {
            
            var that = d3.select(this);

            var i = d3.interpolate(metric_value_previous, metric_value);
            
            return function (t) {
            
                that.text( FORMAT_TYPES[metric](i(t)) );
            
            }

        });

    d3.select("#" + divId)
        .selectAll(".goal-text").remove();

    d3.select("#" + divId)
        .append("h5")
        .attr("class", "goal-text")
        .text("FY" + selected_year + " Goal: " + FORMAT_TYPES[metric](goal));

}



function createProgressChart(divId, metric) {  //  see https://bl.ocks.org/mbostock/5100636

    var pct_complete = 0;  //  0 for init transition

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

    var pieTextContainer = svg.append("g");

    pieTextContainer.append("text")
        .attr("id", "pieTextLarge")
        .attr("class", "pieText")
        .attr("y", height / 2)
        .attr("x", width / 2)
        .html(function (d) {
            return formatPctInt(0);
        });

    pieTextContainer.append("text")
        .attr("id", "pieTextSmall")
        .attr("y", height / 1.6)
        .attr("x", width / 2 )
        .attr("class", "pieTextSmall")
        .html("0 of " + 0);

    
    updateProgressChart("info-1", t1);

}

function postUpdateDate(log_data, divId){

    var update_date_time = new Date(log_data[0].timestamp * 1000);

    update_date = readableDate( update_date_time );

    var update_time = formatTime( update_date_time );

    d3.select("#" + divId)
        .append('h5')
        .html("Updated " + update_date + " at " + update_time +
            " | <a href='https://data.austintexas.gov/browse?q=traffic+signals' target='_blank'> Data <i  class='fa fa-download'></i> </a>" );

}


function getLogData(url) {
    $.ajax({
        'async' : false,
        'global' : false,
        'cache' : false,
        'url' : url,
        'dataType' : "json",
        'success' : function (data) {
            postUpdateDate(data, "update-info");
        }
    
    }); //end get data

}


function updateProgressChart(divId, transition){

    var goal = ANNUAL_GOALS[selected_year]["retime_goal"];

    if ( GROUPED_RETIMING_DATA["$" + selected_year]["$" + STATUS_SELECTED]) {

        var signals_retimed = UNIQUE_SIGNALS_RETIMED["$" + selected_year].length;

    }

    if (!(signals_retimed) ) {

        var signals_retimed = 0;

    }

    var pct_complete = signals_retimed / goal;
    
    d3.select("#progress-pie")  //  update progress arc
        .transition(transition)
        .attrTween("d", arcTween(pct_complete * tau));

    d3.select("#" + "pieTextLarge")  //  update chat text
        .transition(transition)
        .tween("text", function () {

            var that = this;

            var pct_complete_previous = parseFloat(this.textContent) / 100;

            if (isNaN(pct_complete_previous)){
                pct_complete_previous = 0;
            }           

            var i = d3.interpolate(pct_complete_previous, pct_complete);
            
            return function (t) {
                
                that.textContent = formatPctInt( i(t) );
            
            }    
    });

    d3.select("#" + "pieTextSmall")  //  update chat text
        
        .transition(transition)
        
        .tween("text", function () {
            
            var that = d3.select(this);

            var previous_text = ( that.text().split(' of ') ); 

            var signals_retimed_previous = previous_text[0];

            var previous_goal = previous_text[1];

            if (isNaN(previous_goal)){
                previous_goal = 0;
            } 

            var i = d3.interpolate(signals_retimed_previous, signals_retimed);

            var q = d3.interpolate(previous_goal, goal);

            return function (t) {
            
                that.text( Math.round(i(t)) + " of " + Math.round(q(t))  );  //  interpolating two parts of a string? YEP!
            
            }    
    });

}



function populateTable(dataset, next) {

    if ( $('#data_table') ) {

        $('#data_table').dataTable().fnDestroy();

    }

    var filtered_data = dataset.filter(function (d) {

        return d.scheduled_fy == selected_year;

    });



    table = $('#data_table')
        .on( 'init.dt', function () {
        
            $('[data-toggle="popover"]').popover();

            adjustMapHeight();

        })

        .DataTable({
            data : filtered_data,
            rowId : 'system_id',
            scrollY : table_height,
            scrollCollapse : true,
            paging : false,
            bLengthChange: false,
            autoWidth : false,
            bInfo : false,
            order : [[2, 'asc']],
            oLanguage :{ sSearch : 'Search by Corridor Name' },
            columnDefs : [
                 { "width" : "40%", "targets" : 4 },
                 { "width" : "10%", "targets" : 1 },
                 { "searchable" : false, "targets" : [1,2,3,4] }
            ],
            columns: [
                { data: 'system_name', 
                    "render": function ( data, type, full, meta ) {
                        return "<a class='tableRow' id='$" + full.system_id + "' >" + data + "</a>";
                    }
                },
                { 
                  data: 'signal_count' 
                },
                { 
                    data: 'retime_status', 
                    "render": function ( data, type, full, meta ) {
                        return STATUS_TYPES_READABLE[data];
                    }
                },
               { 
                    data: 'vol_wavg_tt_pct_change', 
                    "render": function ( data, type, full, meta ) {
                        var travel_time_change = FORMAT_TYPES["travel_time_reduction"](-1 * +data);
                        
                         if (full.retime_status != 'COMPLETED') {
                            return '';
                         };

                        if ( +data < 0) {
                            travel_time_change = "+" + travel_time_change;
                        }

                        return isNaN(data) ? '' : travel_time_change;
                    }
                },
                { 
                    data: 'system_name', 
                    "render": function ( data, type, full, meta ) {
                        if (full.engineer_note) {
                            var engineer_note = full.engineer_note;
                            
                            return engineer_note;

                        } else {
                            return ''   
                        }
                    }
                }

            ]
        })

    next();

} //  end populateTable


function createTableListeners() {

    //  zoom to and highlight feature from table click
    d3.select("#data_table").selectAll("tr")
            .classed("tableRow", true)
            .on("click", function(d){

            var system_id = '$' + d3.select(this).attr("id");

            highlightLayer(SYSTEMS_LAYERS[system_id]);

            map.fitBounds(SYSTEMS_LAYERS[system_id].getBounds());

            //  location.href = $(this).find("a").attr("href");  // http://stackoverflow.com/questions/4904938/link-entire-table-row
            
    });

}


function formatTravelTime(seconds) {
    
    formatted_seconds = formatSeconds(new Date(2012, 0, 1, 0, 0,  Math.abs(seconds)));

    if (seconds < 0) {

        return "-" + formatted_seconds;
    
    } else {

        return "+" + formatted_seconds;    

    }
    
}


function makeMap(dataset, next) {

        L.Icon.Default.imagePath = '../components/images/';

        map = new L.Map("map", {
            center : [30.28, -97.735],
            zoom : 12,
            minZoom : 1,
            maxZoom : 20,
            scrollWheelZoom: false
        });      // make a map

        var carto_positron = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
            subdomains: 'abcd',
            maxZoom: 19
        });

        var stamen_toner_lite = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
            attribution : 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            subdomains : 'abcd',
            maxZoom : 20,
            ext : 'png' 
        }).addTo(map);

        next(map, dataset);

}


function populateMap(map, dataset) {

    var zoom = map.getZoom();

    for (var i = 0; i < SOURCE_DATA_SYSTEMS.length; i++) { 
        
        var fy =  '$' + SOURCE_DATA_SYSTEMS[i].scheduled_fy;

        if ( !(SYSTEM_IDS[fy]) ) {

            SYSTEM_IDS[fy] = [];

        }

        SYSTEM_IDS[fy].push(+SOURCE_DATA_SYSTEMS[i].system_id); 

    }

    for (var i = 0; i < dataset.length; i++) {   

        var system_layer = "$" + dataset[i].system_id;

        if ( !(system_layer in SYSTEMS_LAYERS) ) {

            SYSTEMS_LAYERS[system_layer] = new L.featureGroup()

        }

        var system_id = dataset[i].system_id;

        var system_name = dataset[i].system_name;

        var lat = dataset[i].latitude;

        var lon = dataset[i].longitude;

        var intersection_name = dataset[i].location_name;

        var signal_id = dataset[i].signal_id;
        
        var marker = L.circle([lat,lon], SCALE_THRESHOLDS['$' + zoom])
            .bindPopup(
                "<b>" + intersection_name + "</b><br>" +
                "Corridor: " + system_name
            );
            
        marker.addTo(SYSTEMS_LAYERS[system_layer]);

        SIGNAL_MARKERS.push(marker);

   }

   updateVisibleLayers();
        
}

var pizza;

function updateVisibleLayers() {

    map.removeLayer(visible_layers);
    
    visible_layers = new L.featureGroup();

    for (system_id in SYSTEMS_LAYERS) {

        var current_id = +system_id.replace('$','');

        if ( SYSTEM_IDS['$' + selected_year].indexOf(current_id) >= 0 ) {

            SYSTEMS_LAYERS[system_id].addTo(visible_layers);

        }

    }

    for (system_layer in SYSTEMS_LAYERS) {

        SYSTEMS_LAYERS[system_layer]
            .setStyle(DEFAULT_STYLE);

    }

    visible_layers.eachLayer(function(layer) {
        layer.on('click', function(){
            highlightLayer(this);
        });
    });


    setTimeout(function(){
        map.fitBounds(visible_layers.getBounds());
    }, 500);
    
    visible_layers.addTo(map);

    setMarkerSizes();
    
}


function setMarkerSizes() {

    var zoom = map.getZoom();

    for (var i = 0; i < SIGNAL_MARKERS.length; i++){

        SIGNAL_MARKERS[i].setRadius(SCALE_THRESHOLDS["$"+ zoom]);

    }

}

function highlightLayer(layer){

    for (system_layer in SYSTEMS_LAYERS) {

        SYSTEMS_LAYERS[system_layer].setStyle(DEFAULT_STYLE);

    }

    layer.setStyle(HIGHLIGHT_STYLE).bringToFront();

}



function readableDate(date) {

    var update_date = formatDate(date);
    
    var today = formatDate( new Date() );

    if (update_date == today) {
    
        return "today";
    
    } else {
    
        return update_date;
    
    }

}


function arcTween(newAngle) { 

    return function(d) {
    
        var interpolate = d3.interpolate(d.endAngle, newAngle);
    
        return function(t) {
            d.endAngle = interpolate(t);
            return arc(d);
    
    };
  
  };

}


function is_touch_device() {  //  via https://ctrlq.org/code/19616-detect-touch-screen-javascript
        return (('ontouchstart' in window)
      || (navigator.MaxTouchPoints > 0)
      || (navigator.msMaxTouchPoints > 0));
}



function adjustMapHeight() {
   //  make map same height as table

    setTimeout(function(){ 
        
        table_div_height = document.getElementById('data-row').clientHeight;

        d3.select("#map")
            .transition(t2)
            .style("height", table_div_height + "px")
            .on("end", function() {
                map.invalidateSize();
                map.fitBounds(visible_layers.getBounds());
            });            

        console.log(table_div_height);

    }, 200);

}



function expandMap(table_div_id, map_div_id) {
    
    d3.select('#' + table_div_id).attr("class", expanded_class + ' full_width');

    d3.select('#' + map_div_id).attr("class", expanded_class + ' full_width');

    d3.select("#map")
                
                .transition(t2)
                .style("height", window.innerHeight + "px")
                .on("end", function() {
                    map.invalidateSize();
                    map.fitBounds(visible_layers.getBounds());
                }); 

    table.draw();

}






function collapseMap(table_div_id, map_div_id) {
    
    var table_div_height = document.getElementById(table_div_id).clientHeight;
    
    d3.select('#' + table_div_id).attr('class', collapsed_class)
    
    d3.select('#map').transition(t2)
        .style('height', table_div_height + "px")
        .on("end", function() {

            d3.select('#' + map_div_id).attr('class', collapsed_class)
            map.invalidateSize();
            map.fitBounds(visible_layers.getBounds());


        });            ;

    table.draw();

}
