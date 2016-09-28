//  control flow: draw map after charts; move zoom listener to after map
//  map: callback function to get index of system id after its appended. right now its an async issue
//  show / zoomto on map
//  resize markers with zoom


var ANNUAL_GOALS = {
    
    "2018" : {
        retime_goal: 0,
        travel_time_reduction: 0,
        stops_reduction: 0,
    },
    
    "2017" : {
        retime_goal: 0,
        travel_time_reduction: 0,
        stops_reduction: 0,
    },

    "2016" : {
        retime_goal: 200,
        travel_time_reduction: .05,
        stops_reduction: 3,
    },

    "2015" : {
        retime_goal: 150,
        travel_time_reduction: .05,
        stops_reduction: 6,  
    }    

};

var SYSTEM_RETIMING_URL = 'https://data.austintexas.gov/resource/eyaq-uimn.json';

var SYSTEM_INTERSECTIONS_URL = 'https://data.austintexas.gov/resource/efct-8fs9.json';

var LOGFILE_URL = 'https://data.austintexas.gov/resource/n5kp-f8k4.json?$select=timestamp&$where=event=%27corridor_retiming_update%27%20AND%20response_message%20IS%20NULL%20&$order=timestamp+DESC&$limit=1';

var data_url_intersections = "../components/data/sync_systems_2016.json";

var STATUS_SELECTED = 'COMPLETED';

var SOURCE_DATA_SYSTEMS;  //  populates table

var GROUPED_RETIMING_DATA;  //  powers the data viz

var tau = 2 * Math.PI,
    arc;

var selected_year = "2016";  //  init year selection

var previous_selection = "2015";

var formatPct = d3.format(".1%");

var formatPctInt = d3.format("1.0%");

var formatDate = d3.timeFormat("%x");

var formatTime = d3.timeFormat("%I:%M %p");

var formatSeconds = d3.timeFormat("%H:%M:%S");

var FORMAT_TYPES = {
    "retiming_progress" : formatPctInt,
    "travel_time_reduction" : formatPct,
    "stops_reduction" : Math.round
};

var STATUS_TYPES_READABLE = {
    'PLANNED': 'Planned',
    'IN_PROGRESS': 'In Progress',
    'COMPLETED': 'Completed'
};

var SCALE_THRESHOLDS = {
    '$12': 200,
    '$13': 150,
    '#15': 100
}

var t1 = d3.transition()
    .ease(d3.easeQuad)
    .duration(500);

var t2;

var map;

var map_expanded = false;

var default_map_size = 300;

var expanded_map_size = 600;

var systems_layers = {};

var master_layer = new L.featureGroup();

d3.json(SYSTEM_RETIMING_URL, function(dataset) {

    SOURCE_DATA_SYSTEMS = dataset;

    groupData(dataset, function(){

        createProgressChart("info-1", "retiming_progress");

        populateInfoStat("info-2", "travel_time_reduction", t1);

        populateInfoStat("info-3", "stops_reduction", t1);

        populateTable(SOURCE_DATA_SYSTEMS);

    });

});


getLogData(LOGFILE_URL);


d3.json(data_url_intersections, function(dataset) {
    
    GROUPED_DATA_INTERSECTIONS = dataset;

    makeMap(dataset);

});


map.on('zoomend', function() {

    updateMarkers();

});


d3.select("#map-expander").on("click", function(){

    d3.select(this)
        .select("button")
            .html(function(){

                if (map_expanded) {

                    return "<i  class='fa fa-expand'</i>";

                } else {
                    
                    return "<i  class='fa fa-compress'</i>"

                }
            });
    
    var map_size = expanded_map_size;

    if (map_expanded) {

        map_expanded = false;
    
        map_size = default_map_size;
    
    } else {

        map_expanded = true;

    }

    d3.select("#map")
        .transition(t2)
        .style("height", map_size + "px");

    setTimeout(function(){ map.invalidateSize()}, 600);

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
                        return +d.travel_time_change;
                    }),

                    stops_change : d3.sum(v, function(d) {
                        return d.stops_change;
                    }),

                    signals_retimed : d3.sum(v, function(d) {
                        return d.signals_retimed; 
                    }),

                    travel_time_before : d3.sum(v, function(d) {
                        return d.travel_time_before; 
                    }),

                    stops_before : d3.sum(v, function(d) {
                        return d.stops_before; 
                    })
                };
            })
            .map(dataset); 

        for (var i in GROUPED_RETIMING_DATA){

            for (var q in GROUPED_RETIMING_DATA[i]) {
                
                GROUPED_RETIMING_DATA[i][q]['travel_time_reduction'] = -1 * (+GROUPED_RETIMING_DATA[i][q]['travel_time_change'] / GROUPED_RETIMING_DATA[i][q]['travel_time_before']);

                GROUPED_RETIMING_DATA[i][q]['stops_reduction'] = -1 * (+GROUPED_RETIMING_DATA[i][q]['stops_change'] / GROUPED_RETIMING_DATA[i][q]['stops_before']);

            }
            
        }

     updateCharts();

     createYearSelectors("selectors", function(){

        d3.select("#selectors").selectAll(".btn").on("click", function(d){

            d3.select("#selectors").selectAll(".btn").classed("active", false)

            d3.select(this).classed("active", true);

            t2 = d3.transition()
                .ease(d3.easeQuad)
                .duration(1000);
            
            previous_selection = selected_year;

            selected_year = d3.select(this).node().value;

            updateProgressChart("info-1", t2);

            updateInfoStat("info-2", "travel_time_reduction", t2);

            updateInfoStat("info-3", "stops_reduction", t2);

            updateTable(SOURCE_DATA_SYSTEMS);

        });

     });

}



function createYearSelectors(divId, createListeners) {

    data = GROUPED_RETIMING_DATA.keys();

    //  data = ['2017', '2016', '2015'];

    d3.select("#" + divId)
        .selectAll("button")
        .data(data)
        .enter()
        .append("button")
        .attr("type", "button")
        .attr("class", function(d, i) {

            if (i == 0) {
        
                return "btn btn-lg active";
        
            }  else {
                
                return "btn btn-lg";

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

    var metric_value = 
        GROUPED_RETIMING_DATA["$" + selected_year]["$" + STATUS_SELECTED][metric];

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

}



function updateInfoStat(divId, metric, transition) {

    var goal = ANNUAL_GOALS[selected_year][metric]; 

    var metric_value_previous = 
        GROUPED_RETIMING_DATA["$" + previous_selection]["$" + STATUS_SELECTED][metric];

    var metric_value = 
        GROUPED_RETIMING_DATA["$" + selected_year]["$" + STATUS_SELECTED][metric];

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

    var signals_retimed = 
        GROUPED_RETIMING_DATA["$" + selected_year]["$" + STATUS_SELECTED]["signals_retimed"];

    var pct_complete = signals_retimed / goal;
    
    d3.select("#progress-pie")  //  update progress arc
        .transition(transition)
        .attrTween("d", arcTween(pct_complete * tau));

    d3.select("#" + "pieTextLarge")  //  update chat text
        .transition(transition)
        .tween("text", function () {
            
            var that = d3.select(this);

            var pct_complete_previous = ( parseFloat(that.text().replace('%','')) ) / 100; // convert existing % string to float

            var i = d3.interpolate(pct_complete_previous, pct_complete);
            
            return function (t) {
            
                that.text( formatPctInt(i(t))  );
            
            }    
    });

    d3.select("#" + "pieTextSmall")  //  update chat text
        
        .transition(transition)
        
        .tween("text", function () {
            
            var that = d3.select(this);

            var previous_text = ( that.text().split(' of ') ); 

            var signals_retimed_previous = previous_text[0];

            var previous_goal = previous_text[1];

            var i = d3.interpolate(signals_retimed_previous, signals_retimed);

            var q = d3.interpolate(previous_goal, goal);
            
            return function (t) {
            
                that.text( Math.round(i(t)) + " of " + Math.round(q(t))  );  //  interpolating two parts of a string? YEP!
            
            }    
    });

}



function populateTable(dataset) {

        var filtered_data = dataset.filter(function (d) {

            return d.scheduled_fy == selected_year;

        });

        var rows = d3.select("tbody")
            .selectAll("tr")
            .data(filtered_data)
            .enter()
            .append("tr")
            .attr("class", "tableRow");

        d3.select("tbody").selectAll("tr")

            .each(function (d) {

                var travel_time_change = formatTravelTime(+d.travel_time_change)

                d3.select(this).append("td").html("<input type='checkbox' name='map_show' value='true' checked>");
                                
                d3.select(this).append("td").html(d.system_name);
                
                d3.select(this).append("td").html(d.signals_retimed);

                d3.select(this).append("td").html(STATUS_TYPES_READABLE[d.retime_status]);
                
                d3.select(this).append("td").html(formatDate(new Date(d.status_date)));
                
                d3.select(this).append("td").html(travel_time_change);

                d3.select(this).append("td").html(Math.round(+d.stops_change));
            });

        //  activate datatable sorting/search functionality
        $(document).ready(function () {
            table = $('#data_table').DataTable( {
                paging : false
            });
        });

    } //  end populateTable



function updateTable(dataset){

    d3.select("tbody").selectAll("tr").selectAll("td").remove();

    var filtered_data = dataset.filter(function (d) {

            return d.scheduled_fy == selected_year;

        });

        var rows = d3.select("tbody")
            .selectAll("tr")
            .data(filtered_data)
            .enter()
            .append("tr")
            .attr("class", "tableRow");

        d3.select("tbody").selectAll("tr")

            .each(function (d) {

                var travel_time_change = formatTravelTime(+d.travel_time_change)
                
                d3.select(this).append("td").html("<input type='checkbox' name='map_show' value='true' checked>");
                                
                d3.select(this).append("td").html(d.system_name);
                
                d3.select(this).append("td").html(d.signals_retimed);

                d3.select(this).append("td").html(STATUS_TYPES_READABLE[d.retime_status]);
                
                d3.select(this).append("td").html(formatDate(new Date(d.status_date)));
                
                d3.select(this).append("td").html(travel_time_change);

                d3.select(this).append("td").html(Math.round(+d.stops_change));

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



function makeMap(dataset) {

    L.Icon.Default.imagePath = '../components/images/';

    map = new L.Map("map", {
        center : [30.28, -97.735],
        zoom : 12,
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

}



function populateMap(map, dataset) {

    var zoom = map.getZoom();

    var marker_size = 

    system_ids = [];

    for (var i = 0; i < dataset.length; i++) {   

            var add_to_master = false;

            var system_layer = "$" + dataset[i].system_id;

            if ( !(system_layer in systems_layers) ) {

                systems_layers[system_layer] = new L.featureGroup();

                system_ids.push(dataset[i].system_id);

                add_to_master = true;

                //  console.log(dataset[i].street_segments_full_street_nam + " / " + dataset[i].street_segments_1_full_street_n);
                //  console.log(system_ids);

            }

            
            var color_index = system_ids.indexOf(system_id) / 17;
            //var color_index = system_ids.indexOf(system_id) / GROUPED_RETIMING_DATA[selected_year][STATUS_SELECTED];


            var pizza = system_ids.indexOf(system_id);

            var system_id = dataset[i].system_id;

            var system_name = dataset[i].system_name;

            var lat = dataset[i].location_1.latitude;
    
            var lon = dataset[i].location_1.longitude;

            var intersection_name = dataset[i].street_segments_full_street_nam + " / " + dataset[i].street_segments_1_full_street_n;

            var atd_signal_id = dataset[i].atd_signal_id;
            
            var marker = L.circle([lat,lon], 150, {
                    color: '#43484E',
                    weight: 1,
                    fillColor: d3.interpolateSpectral(color_index),
                    fillOpacity: .7
                })
                .bindPopup(
                    "<b>" + intersection_name + "</b><br>" +
                    "System: " + system_name + " (" + system_id + ")" +
                    "<br>" + pizza
                )
                
                marker.addTo(systems_layers[system_layer]);

                if (add_to_master) {

                    //  temporary limit of 7 systems to map
                    if (system_ids.indexOf(system_id) < 30){

                        systems_layers[system_layer].addTo(master_layer);

                    } 

                }
       }

        master_layer.addTo(map);
        

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

