var table;

var map;

var table_cols = ['Location', 'Status', 'Status Date', 'Duration'];

var table_height = '60vh';

var signal_markers = {};

var formatPct = d3.format("%");

var formatDateTime = d3.timeFormat("%e %b %-I:%M%p");

var formatDate = d3.timeFormat("%x");

var formatTime = d3.timeFormat("%I:%M %p");

var formatSeconds = d3.timeFormat("%-Hhr %Mm");

var t1 = d3.transition()
    .ease(d3.easeQuad)
    .duration(500);

var t2 = d3.transition()
    .ease(d3.easeQuad)
    .duration(500);

var STATUS_TYPES_READABLE = {
    0: "OK",
    1: "Scheduled Flash",
    2: "Unscheduled Flash",
    3: "Communication Outage",
    5: "Communication Disabled",
    11: "Police Flash"
}

/*
    URL logic to query logfile:
    - event is signal_status_update
    - and response message is NULL (ie no upload errors)
    - return first result of sorted by desc timestamp
*/

var logfile_url = 'https://data.austintexas.gov/resource/n5kp-f8k4.json?$select=timestamp&$where=event=%27signal_status_update%27&$order=timestamp+DESC&$limit=1'
var data_url = "https://data.austintexas.gov/resource/5zpr-dehc.json"

//  dummy data lots flashing
//  var data_url = '../components/data/fake_intersection_data.json';

//  dummy data three flashing
//  var data_url = '../components/data/fake_intersection_data_one.json';

var default_map_size = '60vh';

var master_layer = new L.featureGroup();

var signals_on_flash_layer;

var conflict_flash_marker = new L.ExtraMarkers.icon({
    icon: 'fa-exclamation-triangle',
    markerColor: 'red',
    shape: 'circle',
    prefix: 'fa'
});

var cabinet_flash_marker = new L.ExtraMarkers.icon({
    icon: 'fa-clock-o',
    markerColor: 'orange',
    shape: 'circle',
    prefix: 'fa'
});


var comm_fail_marker = new L.ExtraMarkers.icon({
    icon: 'fa-phone',
    markerColor: 'yellow',
    shape: 'circle',
    prefix: 'fa'
});


var marker_icons = {
    '$1': cabinet_flash_marker,
    '$2': conflict_flash_marker,
    '$3': comm_fail_marker
}

getSignalData(data_url);


//  init tooltips and touch detect
$(document).ready(function(){

    $('[data-toggle="popover"]').popover();

    adjustMapHeight();

});


function main(data){
    
    var cols = createTableCols('data_table', table_cols);

    populateInfoStat(data, "info-1", ['2'], function(){

        getLogData(logfile_url, "update-date");

    });

    populateInfoStat(data, "info-2", ['1'], function(){


    });

    populateInfoStat(data, "info-3", ['3'], function(){

    });

    makeMap(data);

    if (data.length > 0) {

        populateTable(data);


    } else {

        table = $('#data_table').DataTable({
            bInfo: false,
            bPaginate: false,
            scrollY: '30vh',
            language: {
                "emptyTable" : "No Flashing Signals Reported"
            }
        });
        
        d3.select("#data_table_filter").remove();

        adjustMapHeight();
        
    }

};



function populateInfoStat(dataset, divId, status_array, postUpdate) {

    var filtered = dataset.filter(function(data){
        return status_array.indexOf(data['operation_state']) >= 0;
    })

    d3.select("#" + divId)
        .append("text")
        .text('0');
    
    if (filtered.length > 0) {

        updateInfoStat(filtered, divId);

    } else {

        d3.select("#" + divId)
            .select("text")
                .classed("goal-met", true);

    }

    postUpdate();

}



function updateInfoStat(dataset, divId) {

    var signals_on_flash = dataset.length;

    d3.select("#" + divId)
            .select("text")
            .classed("goal-unmet", true)
            .transition(t1)
            .tween("text", function () {
                
                var that = d3.select(this); 

                var i = d3.interpolate(0, signals_on_flash);
                
                return function (t) {
                
                    that.text( Math.round(i(t)) );
                
                }
            
            });

}



function postUpdateDate(log_data, divId){

    var update_date_time = new Date(log_data[0].timestamp * 1000);

    update_date = readableDate( update_date_time );

    var update_time = formatTime( update_date_time );

    d3.select("#" + divId)
        .append('h6')
        .html("Updated " + update_date + " at " + update_time +
            " | <a href='https://data.austintexas.gov/dataset/5zpr-dehc' target='_blank'> Data <i  class='fa fa-download'></i> </a>" );

}



function makeMap(dataset) {

    L.Icon.Default.imagePath = '../components/images/';

    map = new L.Map("map", {
        center : [30.28, -97.735],
        zoom : 10,
        minZoom : 1,
        maxZoom : 20,
        scrollWheelZoom: false,
        attributionControl: false
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

    populateMap(map, dataset);

}



function populateMap(map, dataset) {

    if (dataset.length > 0) {

         signals_on_flash_layer = new L.featureGroup();
        
        for (var i = 0; i < dataset.length; i++) {   
            
            if(dataset[i].latitude > 0) {

                var status = +dataset[i].operation_state;

                var lat = dataset[i].latitude;
        
                var lon = dataset[i].longitude;

                var address = dataset[i].location_name;

                var status_time = formatDateTime( new Date(dataset[i].operation_state_datetime) );

                var signal_id = dataset[i].signal_id;

                var duration = formatDuration(dataset[i].operation_state_datetime);
                
                var marker = L.marker([lat,lon], {
                        icon:  marker_icons['$' + status]
                    });
                
                marker.bindPopup(
                        "<b>Signal #" + signal_id + ":</b> " + address + " <br>" +
                        "<b>Status: </b>" + STATUS_TYPES_READABLE[status] + 
                        "<br><b>Updated:</b> " + status_time +
                        "<br><b>Duration:</b> " + duration
                    )
                    
                    marker.addTo(signals_on_flash_layer);

                    signal_markers['$' + signal_id] = marker;

            }

        }
        
        signals_on_flash_layer.addTo(map);

    }

}

function createTableListeners() {

    //  zoom to and highlight feature from table click
    d3.select("#data_table").selectAll("tr")
        .on("click", function(d){

            var signal_id = '$' + d3.select(this).attr("id");

            map.setView(signal_markers[signal_id].getLatLng(), 14);

            signal_markers[signal_id].openPopup();

        });

}


function applyStatusTypes(statusObject) {

    for (statusType in STATUS_TYPES) {

        if (!(statusType in statusObject)) {

            statusObject[statusType] = 0;
            
        }
    }
}

function getSignalData(url) {
    $.ajax({
        'async' : false,
        'global' : false,
        'cache' : false,
        'url' : url,
        'dataType' : "json",
        'success' : function (data) {
            main(data);
        }
    
    }); //end get data

}

function getLogData(url, divId) {
    $.ajax({
        'async' : false,
        'global' : false,
        'cache' : false,
        'url' : url,
        'dataType' : "json",
        'success' : function (data) {
            postUpdateDate(data, divId);
        }
    
    }); //end get data

}



function populateTable(dataset) {

    table = $('#data_table').DataTable({
        data : dataset,
        rowId: 'signal_id',
        scrollY : table_height,
        scrollCollapse : false,
        bInfo : true,
        paging : false,
        columns: [
            { data: 'location_name', 
                "render": function ( data, type, full, meta ) {
                    return "<a id='$" + full.signal_id + "' >" + data + "</a>";
                }
            },
            
            { 
                data: 'operation_state', 
                "render": function ( data, type, full, meta ) {
                    return STATUS_TYPES_READABLE[data];
                }
            },

            { 
                data: 'operation_state_datetime', 
                "render": function ( data, type, full, meta ) {
                    return formatDateTime( new Date(data) );
                }
            },
            { 
                data: 'operation_state_datetime', 
                "render": function ( data, type, full, meta ) {
                    return formatDuration( data );
                }
            }
        ]
    })

    adjustMapHeight();

    createTableListeners();

    d3.select("#data_table_filter").remove();

}


function adjustMapHeight() {
   
    map.invalidateSize();

    if (signals_on_flash_layer) {
        
        map.fitBounds(
            signals_on_flash_layer.getBounds(),
                {
                    paddingTopLeft: [80, 80],
                    maxZoom: 14
                }
        );

    }

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



function is_touch_device() {  //  via https://ctrlq.org/code/19616-detect-touch-screen-javascript
        return (('ontouchstart' in window)
      || (navigator.MaxTouchPoints > 0)
      || (navigator.msMaxTouchPoints > 0));
}



function formatDuration(datetime) {

    var now = new Date();
    
    var status_date = new Date(datetime);

    var delta = (now - status_date) / 1000;

    var delta_date = new Date(2016, 0, 1, 0, 0, delta);

    return formatSeconds(delta_date);
    
}

function createTableCols(div_id, col_array) {

    var cols = d3.select('#' + div_id).select('thead')
        .append('tr')
        .selectAll('th')
        .data(col_array)
        .enter()
        .append('th')
        .text(function(d) {
            return d;
        });

    return cols;
        
}