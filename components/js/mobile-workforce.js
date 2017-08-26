//  todo:
//  link filters to map
//  keyup searching

var map;

var curr_dataset = 'service_requests';

var show_modal = false;

var search_radius = 250 //  meters

var map_options = {
    center : [30.28, -97.735],
    zoom : 10,
    minZoom : 1,
    maxZoom : 20,
    scrollWheelZoom: true,
    zoomControl: false
};

var table_cols = ['Location', 'Issue', 'Status', 'Date'];

var markers = {
    'signal_marker' : new L.ExtraMarkers.icon({
        icon: 'fa-car',
        markerColor: 'red',
        shape: 'circle',
        prefix: 'fa'
    }),
    'service_request_new' : new L.ExtraMarkers.icon({
        icon: 'fa-exclamation-triangle',
        markerColor: 'red',
        shape: 'circle',
        prefix: 'fa'
    }),
    'service_request_in_progress' : new L.ExtraMarkers.icon({
        icon: 'fa-wrench',
        markerColor: 'blue',
        shape: 'circle',
        prefix: 'fa'
    }),
    'service_request_repairs_complete' : new L.ExtraMarkers.icon({
        icon: 'fa-check-circle',
        markerColor: 'green',
        shape: 'circle',
        prefix: 'fa'
    })
}

var search_area_style = {
    'stroke' : false,
    'color' : 'gray',
    'fillColor' : 'black',
    'fillOpacity' : '.2'
};

var asset_types = {
    'signals' : {
        'socrata_resource' : 'xwqn-2f78',
        'socrata_name_field' : 'location_name',
        'socrata_location_field' : 'location',
        'socrat_record_id_field' : 'id',
        'knack_form_field' : 'field_2',
        'knack_view' : 'view_id',
        'knack_scene' : 'scene_id'
    },
    'dms' : {},
    'school_beacon' : {},
    'flasher' : {}
}


var config = { 
    'service_requests' : {
        //  field_1388 - location
        //  field_1446 - details
        //  field_1636 - status
        //  field_1445 - type
        //  field_1517 - date
        'name' : 'service_requests',
        'data' : [],
        'display_name' : 'Service Requests',
        'rowId' : 'id',
        'sceneKey' : 'scene_514',
        'viewKey' : 'view_1552',
        'divId' : 'data_table',
        'lon' : 'field_1402',
        'lat' : 'field_1401',
        popup : function(record) {

            return '<b> ' + record.field_1388 + '<b><br>' + record.field_1446;        
        },
        'filterField' : 'field_1636',
        'filters' : [
            {
                'display_name' : 'New',
                'value' : 'new',
                'icon' : 'fa-exclamation-triangle',
                'icon_color' : '#832025',
                'marker' : 'service_request_new'
            },
            {
                'display_name' : 'In Progress',
                'value' : 'in_progress',
                'icon' : 'fa-wrench',
                'icon_color' : '#1865B1',
                'marker' : 'service_request_in_progress'
            },
            {
                'display_name' : 'Repairs Complete',
                'value' : 'repairs_complete',
                'icon' : 'fa-check-circle',
                'icon_color' : '#028102',
                'marker' : 'service_request_repairs_complete'
            }
        ]
    }
}



$(document).ready(function(){
    main();
});


function main(){

    map = makeMap('map', map_options);
    
    var cols = createTableCols(config[curr_dataset].divId, table_cols);

    getAllRecordsForObject(config[curr_dataset], handleData);

    var map_selectors = createMapSelectors('map_selectors', config[curr_dataset].filters);

    $(".btn-map-selector").on('click', function() {

        if ( $(this).hasClass('active') ) {
            $(this).removeClass('active').attr('aria-pressed', false);
        } else {
            $(this).addClass('active').attr('aria-pressed', true)
        }

        filterChange();
    })
}


function assetData() {
     // var issue_data = parse_url();
    var issue_data = {
        'lat' : 30.28,
        'lon' : -97.735,
        'location' : 'MARTIN LUTHER KING JR BLVD / SAN JACINTO BLVD',
        'issue_id' : 'TMC-17-0000294'
    };

    var data_type = 'signals';

    var issue_marker = issueMarker(issue_data);
    issue_marker.addTo(map).openPopup();
    search_area = L.circle(issue_marker._latlng, search_radius).setStyle(search_area_style).addTo(map);
    map.setView(issue_marker._latlng, 17);

    var query = build_spatial_query(
            data_types[data_type].socrata_resource,
            issue_data.lat,
            issue_data.lon,
            search_radius
        )
    var res = getAssetData(query, data_type);

}


function makeMap(divId, options) {

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

    var zoomHome = L.Control.zoomHome();
    zoomHome.addTo(map);

    return map;
}


function parse_url() {
    var asset_type
    var issue_id;
    var issue_lat;
    var issue_lon;
    return 'info';
}


function issueMarker(issue_data) {
    var lat = issue_data.lat;
    var lon = issue_data.lon;
    var loc = issue_data.location;
    var issue_id = issue_data.issue_id
    var issue_marker = L.marker([lat, lon])
        .bindPopup(loc + '<br>' + issue_id)

    return issue_marker
}


function query_by_location(asset_type) {

    var location;
    
    map.locate({
        setView: true,
        maxZoom: 17
    });

    map.on('locationerror', onLocationError);
    var query = map.on('locationfound', onLocationFound);

    function onLocationError(e) {
        alert(e.message);
    }

    function onLocationFound(e) {
        var radius = e.accuracy / 2;
        L.marker(e.latlng).addTo(map);
        L.circle(e.latlng, radius).addTo(map);

        var query = build_asset_query(datasets.signals, e.latitude, e.longitude, search_radius)
        getData(query);

    }
}


function build_spatial_query(resource, lat, lon, radius) {  //  search radius is in meters
    return 'https://data.austintexas.gov/resource/' + resource + '.json?$where=within_circle(location, ' + lat + ', ' + lon + ', ' + radius + ')&$order=distance_in_meters(location, "POINT (' + lon + ' ' + lat + ')")';
}


function build_attribute_query(resource, lat, lon, radius) {
    return 'https://data.austintexas.gov/resource/' + resource + '.json?$where=within_circle(location, ' + lat + ', ' + lon + ', ' + radius + ')&$order=distance_in_meters(location, "POINT (' + lon + ' ' + lat + ')")';
}


function getAssetData(url, asset_type) {
    $.ajax({
        'async' : false,
        'global' : false,
        'cache' : false,
        'url' : url,
        'dataType' : "json",
        'success' : function (data) {
            makeMarkers(data, asset_type);
        }
    
    }); //end get data

}

function makeMarkers(data, config) {

    if (data.length > 0) {
        var layer = new L.featureGroup();

        for (var i = 0; i < data.length; i++) {   
            var lat =  data[i][config.lat];
            var lon = data[i][config.lon];
            var filterVal = data[i][config.filterField];
            var filter = filterByKeyValue(config.filters, 'display_name', filterVal)
            if (!filter[0]) {
                continue
            }
            var marker = L.marker([lat,lon], {
                    icon:  markers[filter[0].marker]
            });
            
            var popup = config.popup(data[i]);
            marker.bindPopup(popup);
            
            config.data[i]['marker'] = marker;
            marker.addTo(layer);
        }
        
        layer.addTo(map);
    }

    map.invalidateSize();
    return layer;

}


function populateTable(data, config) {

    if ( $('#' + config.divId) ) {

        $('#' + config.divId).dataTable().fnDestroy();

    }

    table = $('#' + config.divId)
        .DataTable({
            data : data,
            rowId : config.rowId,
            scrollY : '55vh',
            scrollCollapse : false,
            bInfo : true,
            paging : false,
            autoWidth: true,
            order: [[ 3, "desc" ]],
            drawCallback : function( settings ) {
                createTableListeners();

                makeMarkers(data, config)

            },
            columns: [
                
                { data: 'field_1388',
                //  location
                    "render": function ( data, type, full, meta ) {
                        var location = data.split(',')[0];  //  grab street address only from data
                        return "<a class='tableRow' id='$" + full['id'] + "' '>" + location + "</a>";
                    }   
                },
                { data: 'field_1445',
                //  issue type
                    "render": function ( data, type, full, meta ) {
                        return data;
                    }
                },
                
                { data: 'field_1636',
                    "render": function ( data, type, full, meta ) {

                        var status = data;

                        var render_str = '';

                        var filters = config.filters
                        for (var i = 0; i < filters.length; i++) {

                            if (status.toUpperCase() == config.filters[i].display_name.toUpperCase() ) {
                                render_str = render_str + 
                                " <i class='table-icon fa " +
                                config.filters[i].icon +
                                "' style='background-color:" + config.filters[i].icon_color + "'></i> "
                                return render_str;
                            }

                        }
                        
                        
                    }

                },
                { data: 'field_1517',
                //  created date
                    "render": function ( data, type, full, meta ) {
                        return data;
                    }
                }

            ]
        })
        
    $("#" + config.divId + "_filter").remove();

}


function projectPoint(record, xField, yField) {
    
    var latLon = sp_to_wgs84(record[xField], record[yField]);
    record[xField] = latLon['lon'];
    record[yField] = latLon['lat'];
    return record;
}


function handleData(records, config) {
    
    config.data = records;

    for (var i = 0; i < config.data.length; i++) {
        config.data[i] = projectPoint(config.data[i], 'field_1402', 'field_1401');
    }
    
    populateTable(config.data, config)
}


function getAllRecordsForObject(config, callbackFunctionToHandleData, currentPage = 1, totalPages, allRecordsForObject = []) {
  
  if (!config.sceneKey || !config.viewKey) {
    throw new Error('Missing page or view key!');
  }

  if (!callbackFunctionToHandleData) {
    throw new Error('No callback function provided; make sure the data is handled somehow.');
  }

  // AJAX prep
  var url = 'https://api.knack.com/v1/pages/' + config.sceneKey + '/views/' + config.viewKey + '/records?page=' + currentPage + '&rows_per_page=500';
  
  var headers = {
    'X-Knack-Application-ID': '5815f29f7f7252cc2ca91c4f',
    'X-Knack-REST-API-Key': 'knack',
    'content-type':'application/json'
  };


  $.ajax({
    url: url,
    headers: headers,
    type: 'GET',
  }).done(function(responseData) {

    allRecordsForObject = allRecordsForObject.concat(responseData.records);
    // Handle records with our callback function
    callbackFunctionToHandleData(allRecordsForObject, config);

  });
}


function createTableCols(divId, col_array) {

    var cols = d3.select('#' + divId).select('thead')
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

function createMapSelectors(divId, obj_arr) {

    var selectors = d3.select("#" + divId)
        .selectAll('div')
        .data(obj_arr)
        .enter()
        .append('div')
        .attr('class', 'col-sm')
        .append('btn')
        .attr('type', 'button')
        .attr('data_id', function(d){
            return d.name;
        })
        .attr('class', 'btn btn-block btn-primary btn-map-selector')
        .attr('aria-pressed', function(d, i) {
            // class first button as 'active'
            if (i == 0) {
                return true;
            }
            else {
                return false;
            }
        })
        .classed('active', function(d, i) {
            // class first button as 'active'
            if (i == 0) {
                return true;
            }
            else {
                return false;
            }
        })
        .html(function(d){
            return '<i class="fa ' + d.icon + '" ></i> ' + d.display_name;
        });

    return selectors;
    
}



function filterByKeyValue(arr, key, value) {
    //  search an array of objects
    //  for a matching key/value
    return arr.filter(function(entry){ 
        return entry[key] == value;
    });

}


function createTableListeners() {

    d3.selectAll('tr')
        .on('click', function(d){
            $('#modal-popup-container').remove();
            var marker_id = d3.select(this).attr('id');
            zoomToMarker(marker_id, config[curr_dataset].data);
    });

}




function zoomToMarker(marker_id, data) {

    for (var i = 0; i < data.length; i++ ) {
    
        if (data[i][config[curr_dataset].rowId] == marker_id ) {
            
            marker = data[i].marker;

            if (show_modal) {

                map.closePopup();

                map.setView(marker._latlng, 16);
                
                var popup = marker._popup._content;
                $('#modal-info').append("<div id='modal-popup-container'>" + popup + "</div>");
                $('#dashModal').modal('toggle');

            } else {
                
                map.setView(marker._latlng, 17);

                marker.openPopup();

                map.invalidateSize();
 
            }

        }
    }
}



function filterChange() {
    filters = checkFilters();
    var data = filterByKeyExists(config[curr_dataset].data, filters);
    populateTable(data, config[curr_dataset]);
}


function checkFilters(){
    filters = [];
    $('btn.active').not(':hidden').each(function() {
        filters.push( $(this).attr('data_id'));
    });
    return Array.from(new Set(filters)); //  remove duplicates, which may arise from having 'hidden' filters based on display invalidateSize
}


function filterByKeyExists(data, filters) {
    return data.filter(function(record){
        return Object.keys(record).some( function(key){
            return (filters.indexOf(key) > -1);
        })
    })

}