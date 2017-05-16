// assumes one record per device-type per location
// to do:
// align table icons
// checkbox data selctors
// scroll zoom
// status pop-ups in data table
// map expander
// home button

var data_master, map, feature_layer, table, default_bounds;

var init = true;

var q = d3.queue();

var location_id_field = "atd_location_id";
var comm_status_field = "ip_comm_status";
var comm_status_date_field = "comm_status_datetime_utc";

var device_data = [
    {
        'name' : 'traffic_signal',
        'display_name' : 'Signal',
        'resource_id' : 'xwqn-2f78',
        'id_field' : 'signal_id',
        'query' : 'select * where control in ("PRIMARY") and signal_status in ("TURNED_ON") limit 10000'
    },
    {
        'name' : 'cctv',
        'display_name' : 'CCTV',
        'resource_id' : 'fs3c-45ge',
        'id_field' : 'camera_id',
        'query' : 'select * where upper(camera_mfg) not in ("GRIDSMART")'
    },
    {
        'name' : 'gridsmart',
        'display_name' : 'GRIDSMART',
        'resource_id' : 'fs3c-45ge',
        'id_field' : 'atd_camera_id',
        'query' : 'select * where upper(camera_mfg) LIKE ("%25GRIDSMART%25")'
    },
    {
        'name' : 'travel_sensor',
        'display_name' : 'Sensor',
        'resource_id' : 'wakh-bdjq',
        'id_field' : 'sensor_id',
        'query' : 'select latitude,longitude,sensor_type,atd_location_id,location_name,ip_comm_status,comm_status_datetime_utc where sensor_status in ("TURNED_ON")'
    }
];


var map_options = {
        center : [30.27, -97.74],
        zoom : 13,
        minZoom : 1,
        maxZoom : 20
};

var img_url_base = 'http://162.89.4.145/CCTVImages/CCTV';


var default_style = { 
    'ONLINE' : {
        color: '#fff',
        weight: 1,
        fillColor: '#056315',
        fillOpacity: .8
    },
    'OFFLINE' : {
        color: '#fff',
        weight: 1,
        fillColor: '#a52626',
        fillOpacity: .8  
    }
};

var table_height = '60vh';

var t_options = {
    ease : d3.easeQuad,
    duration : 500
};

var t1 = d3.transition()
    .ease(t_options.ease)
    .duration(t_options.duration);

var t2 = d3.transition()
    .ease(t_options.ease)
    .duration(t_options.duration);


var formats = {
    'round': function(val) { return Math.round(val) },
    'formatDateTime' : d3.timeFormat("%e %b %-I:%M%p"),
    'formatDate' : d3.timeFormat("%x"),
    'formatTime' : d3.timeFormat("%I:%M %p"),
    'thousands' : d3.format(",")
};


var coa_net_passthrough = 'http://172.16.1.5/CoaTools'



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


$(document).ready(function(){

    $('[data-toggle="popover"]').popover();

    if (is_touch_device()) {
        
        d3.select('#map')
            .style('margin-right', '10px')
            .style('margin-left', '10px');
    }

    for (var i = 0; i < device_data.length; ++i) {

        if ( 'resource_id' in device_data[i] ) {

            var url = buildSocrataUrl(device_data[i]);

            var name = device_data[i]['name'];

            q.defer(d3.json, url)

        }

    }

    q.awaitAll(function(error) {

        if (error) throw error;

        for ( var i = 0; i < arguments[1].length; i++ ) {
            device_data[i].data = arguments[1][i];

        }

        main(device_data);

    });

});



function is_touch_device() {  //  via https://ctrlq.org/code/19616-detect-touch-screen-javascript
        return (('ontouchstart' in window)
      || (navigator.MaxTouchPoints > 0)
      || (navigator.msMaxTouchPoints > 0));
}



function main(data) {

    data_master = groupByLocation(data);

    map = makeMap('map', map_options);

    data_master = createMarkers(data_master, default_style);

    var filters = checkFilters();
    
    var filtered_data = filterData(data_master, filters);
    
    populateTable(filtered_data, 'data_table', true);

    $('#search_input').on( 'keyup', function () {
    
        table.search( this.value ).draw();

    } );

    map.on('zoomend', function() {
        setMarkerSizes(data_master);
    });

    $(".device-selector").on('change', filterChange);

    createTableListeners();
}



function buildSocrataUrl(data) {

    var resource_id = data.resource_id;
    
    var url = 'https://data.austintexas.gov/resource/' + resource_id + '.json';

    if (data.query) {

        url = url + '?$query=' + data.query;


    }
    
    return url;
}


function findWithAttr(array, attr, value) {
    //    http://stackoverflow.com/questions/7176908/how-to-get-index-of-object-by-its-property-in-javascript
    for (var i = 0; i < array.length; i += 1) {
        if(array[i][attr] === value) {
            return i;
        }
    }
    return -1;
}


function groupByLocation(data) {

    var data_master = [];

    for (var i = 0; i < device_data.length; ++i) {

        for (var q = 0; q < device_data[i].data.length; q++) {  
            
            var location = device_data[i].data[q][location_id_field];
            
            var current_id = data_master.length + 1

            var loc_exists = data_master.some(function (loc) {
                return loc.location === location;
            });

            if (!(loc_exists)) {
                //  build location record        
                var device_name = device_data[i]['name'];
                
                var new_loc = {
                    'location' : location,
                    'latitude' : device_data[i].data[q].latitude,
                    'longitude' : device_data[i].data[q].longitude,
                    'location_name' : device_data[i].data[q].location_name,
                };

                //  append device-specifc attributes    
                new_loc[device_name] = {
                        'status' : device_data[i].data[q][comm_status_field],
                        'status_date' : device_data[i].data[q][comm_status_date_field],
                        'device_id' : device_data[i].data[q][device_data[i]['id_field']]
                };
                
                data_master.push(new_loc);

            } else {
                // location exists
                //  append device-specifc attributes
                var index = findWithAttr(data_master, 'location', location);
                
                data_master[index][device_data[i].name] = {
                    'status' : device_data[i].data[q][comm_status_field],
                    'status_date' : device_data[i].data[q][comm_status_date_field],
                    'device_id' : device_data[i].data[q][device_data[i]['id_field']]
                };       
            }
        }
    }
    return data_master;
}



function makeMap(divId, options) {

    //  mappy map
    L.Icon.Default.imagePath = '../components/images/';

    var layers = {
        carto_positron: L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
            subdomains: 'abcd',
            maxZoom: 19
        }),

        stamen_toner_lite: L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
            attribution : 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            subdomains : 'abcd',
            maxZoom : 20,
            ext : 'png' 
        })
    }

    var map = new L.Map(divId, options)
        .addLayer(layers['stamen_toner_lite']);

    default_bounds = map.getBounds();
    console.log(default_bounds);
    return map;

}




function createMarkers(data, style) {
    //  create markers and layers for each device type
    for (var i = 0; i < data.length; i++) {
        
        var marker_style = style['OFFLINE'];

        var location_name = data[i].location_name;

        var lat = data[i].latitude;
        
        var lon = data[i].longitude;

        var popup_text = '<b>' + location_name +  '</b>';

        var img_url = false;

        for (var q = 0; q < device_data.length; q++) {
            
            if (device_data[q]['name'] in data[i]) {
                
                if (device_data[q]['name'] == 'cctv') {
                    var id = data[i]['cctv']['device_id'];
                    var img_url = img_url_base + id + '.jpg';
                }

                popup_text = popup_text
                + '<br>' + device_data[q]['display_name'] + ": "+ data[i][device_data[q]['name']]['status']
                + ' at ' + formats['formatDateTime']( new Date(data[i][device_data[q]['name']]['status_date']));

            }
        }

        if (img_url) {
            popup_text = "<a href=" + coa_net_passthrough + " target=_blank ><img src=" + img_url + " width=300 /></a><br>" + popup_text;
        }

        if (popup_text.indexOf('ONLINE') > -1 ) {
            marker_style = style['ONLINE'];
        }

        data[i]['marker'] = L.circle([lat,lon], 500)
          .bindPopup(popup_text)
          .setStyle(marker_style)

    }
    
    return data;

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
                adjustView(feature_layer);    
            });            

    }, 200);

}
    


function getMarkers(source_data, id_array) {
    
    var layer = new L.featureGroup();

    for (var i = 0; i < source_data.length; i++) {
        
        if ( id_array.indexOf( '$' + source_data[i]['location']) > -1 ) {
            source_data[i]['marker'].addTo(layer);
        }

    }

    return layer
}



function updateMap(layer) {

    if ( map.hasLayer(feature_layer) ) {
        map.removeLayer(feature_layer);
    }

    feature_layer = layer

    feature_layer.addTo(map);

    var bounds = feature_layer.getBounds()

    adjustView(layer);    


}



function populateTable(data, divId) {

    if ( $('#' + divId) ) {

        $('#' + divId).dataTable().fnDestroy();

    }

    table = $('#data_table')
        .on( 'init.dt', function () {
            console.log('init');
            $('[data-toggle="popover"]').popover();

            if (data.length > 0) {
                adjustMapHeight();    
            }

        })
        //  update map after table search
        .on( 'draw.dt', function () {
            
            var ids = [];

            $('.tableRow').each(function(i, obj) {
                ids.push(obj.id);
            });

            var marker_layer = getMarkers(data, ids);    
            
            updateMap(marker_layer);

        })
        .DataTable({
            data : data,
            rowId : 'location',
            scrollY : table_height,
            scrollCollapse : false,
            bInfo : true,
            paging : false,
            autoWidth: false,
            columns: [

                { data: 'location_name',
                    "render": function ( data, type, full, meta ) {

                        if ('location' in full) {
                            return "<a class='tableRow' id='$" + full.location + "' '>" + data + "</a>";
                        } else {
                            return '';
                        }
                    }
                },

                { data: 'cctv',
                    "render": function ( data, type, full, meta ) {
                        
                        if ('cctv' in full) {
                            if (full['cctv']['status'] == 'ONLINE') {
                                return "<i class='fa fa-check-circle' style='color:green'></i>";
                            } else {
                                return "<i class='fa fa-exclamation-triangle' style='color:darkred'></i>";
                            }
                        } else {
                            return ""
                        }
                    }

                },
                { data: 'gridsmart',
                    "render": function ( data, type, full, meta ) {
                        
                        if ('gridsmart' in full) {
                            if (full['gridsmart']['status'] == 'ONLINE') {
                                return "<i class='fa fa-check-circle' style='color:green'></i>";
                            } else {
                                return "<i class='fa fa-exclamation-triangle' style='color:darkred'></i>";
                            }
                        } else {
                            return ""
                        }
                    }

                },
                { data: 'travel_sensor',
                    "render": function ( data, type, full, meta ) {
                        
                        if ('travel_sensor' in full) {

                            if (full['travel_sensor']['status'] == 'ONLINE') {
                                return "<i class='fa fa-check-circle' style='color:green'></i>";

                            } else {

                                return "<i class='fa fa-exclamation-triangle' style='color:darkred'></i>";

                            } 
                        } else {
                                
                            return ""
                        }
                    }
                },
                { data: 'signal',
                    "render": function ( data, type, full, meta ) {
                        
                        if ('traffic_signal' in full) {

                            if (full['traffic_signal']['status'] == 'ONLINE') {
                                return "<i class='fa fa-check-circle' style='color:green'></i>";

                            } else {

                                return "<i class='fa fa-exclamation-triangle' style='color:darkred'></i>";

                            } 
                        } else {
                                
                            return ""
                        }
                    }
                }
            ]
        })
        

    d3.select("#data_table_filter").remove();

    createTableListeners();

}


function setMarkerSizes(data) {

    var zoom = map.getZoom();
    for (var i = 0; i < data.length; i++){
        data[i].marker.setRadius(SCALE_THRESHOLDS["$"+ zoom]);
    }

}




function zoomToMarker(marker, data) {

    for (var i = 0; i < data.length; i++ ) {
    
        if ('$' + data[i].location == marker ) {
         
            map.fitBounds(
                data[i].marker.getBounds(),
                { maxZoom: 16 }

            );

            map.invalidateSize();

            data[i].marker.openPopup();

        }
    }
}



function checkFilters(){

    filters = [];

    $('.active').each(function() {
        filters.push( this.id );
    });

    return filters;

}



function filterData(data, filters) {

    return data.filter(function(record){
        return Object.keys(record).some( function(key){
            return (filters.indexOf(key) > -1);
        })
    })

}



function filterChange() {
    var filters = checkFilters();
    
    var data = filterData(data_master, filters);

    populateTable(data, 'data_table', false);
        
}




function adjustView(layer) {
    console.log('adjust_view');

    setMarkerSizes(data_master);

    if (layer) {
        var bounds = layer.getBounds()
    } else {
        var bounds = {};
    }

    if (Object.keys(bounds).length === 0 && bounds.constructor === Object) {
        //  http://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object
        //  empty bounds
        map.setView(map_options.center, map_options.zoom);
    } else {
        map.fitBounds(bounds, { maxZoom: 16 });    
    }

    map.invalidateSize();

}



function createTableListeners() {

    d3.selectAll(".tableRow")
        .on("click", function(d){

            var marker_id = d3.select(this).attr("id");

            zoomToMarker(marker_id, data_master);
    });

}
