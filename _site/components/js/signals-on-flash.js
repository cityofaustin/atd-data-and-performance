var table, john;

var map;

var signal_markers = {};

var map_expanded = false;

var formatPct = d3.format("%");

var formatDateTime = d3.timeFormat("%e %b %-I:%M%p");

var formatDate = d3.timeFormat("%x");

var formatTime = d3.timeFormat("%I:%M %p");

//  var formatSeconds = d3.timeFormat("%H:%M:%S");
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
    3: "No Communication",
    5: "Communication Disabled",
    11: "Police Flash"
}

/*
    URL logic to query logfile:
    - event is signal_status_update
    - and response message is NULL (ie no upload errors)
    - return first result of sorted by desc timestamp
*/

var logfile_url = 'https://data.austintexas.gov/resource/n5kp-f8k4.json?$select=timestamp&$where=event=%27signal_status_update%27%20AND%20response_message%20IS%20NULL&$order=timestamp+DESC&$limit=1'

//  var data_url = "https://data.austintexas.gov/resource/5zpr-dehc.json?$where=%20operation_state=1%20OR%20operation_state=2"
var data_url = '../components/data/intersection_status_snapshot_conflict.json';

var default_map_size = 300;

var expanded_map_size = 600;

var master_layer = new L.featureGroup();

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

var marker_icons = {
    '$1': cabinet_flash_marker,
    '$2': conflict_flash_marker
}

getSignalData(data_url);



//  init tooltips and touch detect
$(document).ready(function(){

    $('[data-toggle="popover"]').popover();

    if (is_touch_device()) {
        
        d3.select('.map')
            .style("margin-right", "10px")
            .style("margin-left", "10px");
    }

    table = $('#data_table').DataTable( {
            paging : false,
            scrollX: true,
            scrollY: false,
            bFilter: false,
            bInfo : false
        });

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

function main(data){

    populateInfoStat(data, "info-1", function(){

        getLogData(logfile_url);

    });

    makeMap(data);

    if (data.length > 0) {

        populateTable(data);    

    } else {

        d3.select('.table').remove();

    }

};

function populateInfoStat(dataset, divId, postUpdate) {

    d3.select("#" + divId)
        .append("text")
        .text('0');
    
    if (dataset.length > 0) {

        updateInfoStat(dataset, divId);

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
        .append('h5')
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
        scrollWheelZoom: false
    });      // make a map

    var Stamen_TonerLite = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
        attribution : 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains : 'abcd',
        maxZoom : 20,
        ext : 'png'
    }).addTo(map);

    populateMap(map, dataset, function(){
      
        //  var sidebar = L.control.sidebar('sidebar').addTo(map);

    });

}



function populateMap(map, dataset, createSideBar) {

    if (dataset.length > 0) {

        var signals_on_flash_layer = new L.featureGroup();
        
        for (var i = 0; i < dataset.length; i++) {   
            
            if(dataset[i].latitude > 0) {

                var status = +dataset[i].operation_state;

                var lat = dataset[i].latitude;
        
                var lon = dataset[i].longitude;

                var address = dataset[i].intersection_name;

                var status_time = formatDateTime( new Date(dataset[i].status_datetime) );

                var atd_signal_id = dataset[i].atd_signal_id;

                var duration = formatDuration(dataset[i].status_datetime);
                
                var marker = L.marker([lat,lon], {
                        icon:  marker_icons['$' + status]
                    });
                
                marker.bindPopup(
                        "<b>Signal #" + atd_signal_id + ":</b> " + address + " <br>" +
                        "<b>Status: </b>" + STATUS_TYPES_READABLE[status] + 
                        "<br><b>Updated:</b> " + status_time +
                        "<br><b>Duration:</b> " + duration
                    )
                    
                    marker.addTo(signals_on_flash_layer);

                    signal_markers['$' + atd_signal_id] = marker;

            }

        }
        
        signals_on_flash_layer.addTo(map);

        map.fitBounds(
            signals_on_flash_layer.getBounds(),
                {
                    paddingTopLeft: [80, 80],
                    maxZoom: 14

                }
            );
    }

}

function createTableListeners() {

    //  zoom to and highlight feature from table click
    d3.selectAll(".tableRow").on("click", function(d){

        var signal_id = d3.select(this).attr("id");

        map.setView(signal_markers[signal_id].getLatLng(), 14);

        signal_markers[signal_id].openPopup();

        //  location.href = $(this).find("a").attr("href");  // http://stackoverflow.com/questions/4904938/link-entire-table-row

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

function getLogData(url) {
    $.ajax({
        'async' : false,
        'global' : false,
        'cache' : false,
        'url' : url,
        'dataType' : "json",
        'success' : function (data) {
            postUpdateDate(data, "info-1");
        }
    
    }); //end get data

}



function populateTable(dataset) {

    var rows = d3.select("tbody")
        .selectAll("tr")
        .data(dataset)
        .enter()
        .append("tr")
        .filter(function(d){
            return d.operation_state > 0;
        })
        

    d3.select("tbody").selectAll("tr")
        .each(function (d) {

            d3.select(this).attr("id", function(d) {
                    return "$" + d.atd_signal_id;
                })
                .attr("class", "tableRow");
            
            d3.select(this).append("td").html("<a href='#info-1'>" + d.intersection_name + "</a>");

            d3.select(this).append("td").html(d.atd_signal_id);
            
            d3.select(this).append("td").html(STATUS_TYPES_READABLE[d.operation_state]);
            
            d3.select(this).append("td").html( formatDateTime( new Date(d.status_datetime) ) );

            d3.select(this).append("td").html( formatDuration(d.status_datetime) );
    
        });

    createTableListeners();


    default_map_size = document.getElementById('data-row').clientHeight;
    
    console.log(document.getElementById('data-row').clientHeight);
    
    d3.select("#map")
        .transition(t2)
        .style("height", default_map_size + "px");

    setTimeout(function(){ map.invalidateSize()}, 600);


} //  end populateTable

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





