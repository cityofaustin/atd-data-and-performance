//  todo:
//  what to do about requests missing lat/lon?
//  maybe dump them into a list that can be toggled?
//  ideally run them through COA geocoder
//  update socrata queries to selected specific fields of concern
//  'filters' is not the right place to assign markers in config
//          add layers/get more data
//  create address name field on CSR records
//  google maps link
//  overlay on small display
//  layer selectors
//  hide #map-controls on collapse when details are showing

var map, table, feature_layer;
var map_center;
var table_data = [];
var markers = [];
var showing_details = false;
var showing_menu = false;
var q = d3.queue();

$(document).ready(function(){
    // $('#loader').modal('toggle');
    $('#map-menu').show();
    showing_menu = true;
    $('#feature-details').hide();
    $('#close-search').hide();
    getData(CONFIG);
    
});

function main(config) {
    makeMap('map', MAP_OPTIONS);
    populateTable(table_data, 'data-table');
    makeEventListeners();
    createTableListeners();
}

function makeMap(divId, options) {
    //  mappy map
    L.Icon.Default.imagePath = '../components/images/';

    var layers = {
        stamen_toner_lite: L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
            attribution : 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            subdomains : 'abcd',
            maxZoom : 20,
            ext : 'png'
        })
    }

    map = new L.Map(divId, options)
        .addLayer(layers['stamen_toner_lite'])
        .on('resize', function() {
        });
    
    //  $('#loader').modal('toggle');

    var zoomHome = L.Control.zoomHome({position : 'bottomright'});
    zoomHome.addTo(map);
    return map;

}


function populateTable(data, divId

    ) {
    $('#data-table').hide();

    table = $('#' + divId)
        .DataTable({
            scrollY : '200px',  //  max table height
            scrollCollapse : true,
            data : data,
            bInfo : false,
            paging : false,
            drawCallback : function( settings ) {
                //  create map layer from table rows
                //  i.e., the table contents always drives
                //  the map contents
                var ids = [];
                $('.tableRow').each(function(i, obj) {
                    var rowId = obj.id;
                    var layer_name = $(obj).data('layer-name');
                    ids.push({ 
                            'rowId' : rowId, 
                            'layer_name' : layer_name,
                        });
                });
                var marker_layer = getMarkers(ids); 
                updateMap(marker_layer);   
            
            },
            columns: [
                { 
                    data: 'display_value',
                
                    "render": function ( data, type, full, meta ) {
                        return "<a class='tableRow' data-layer-name='" + full.layer_name + "' id='$" + full.rowId + "' '>" + data + "</a>";
                    }   
                }
            ]
        })
        .on( 'draw.dt', function () {
            $('#data-table').hide();

            if ( $( ".sorting_1" ).length) {
                $('#data-table').show();
            } else {
               $('#data-table').hide();
            }
        });
    
    $('#data-table_filter').remove();
}


function makeEventListeners() {
    
    $('#map-menu-btn').on('click', function(){
        toggleMenu();
    });

    $('#search-input')
        .on('keyup', function () {
            if (this.value) {
                //  search for features
                $('#close-search').show();
                table.search( this.value ).draw();
                $('#map-menu').hide();
            } else {
                //  hide search results and (x) if no text in input
                $('#data-table').hide();
                $('#close-search').hide();
                toggleDetails();
            }
        })
        .on('click', function () {
            //  close collapse menu when search is active
            $('#collapse-menu').collapse('hide');
        });

    $('#collapse-menu').on('show.bs.collapse', function () {
         //  hide search results when menu activated
         $('#data-table').hide();
    })

    $('#close-search').on('click', function() {
        //  close search when (x) is clicked
        closeSearch();
        toggleDetails();
    })

    $('#close-feature-details').on('click', function() {
        //  close feature details when feature (x) is clicked
        //  map state is preserved
        document.getElementById('search-input').value = '';
        $('#close-search').hide();
        toggleDetails();
        map.closePopup();
    })
    
    $(document).keyup(function(e) {
        //  esc key to cancel search input
        //  https://stackoverflow.com/questions/1160008/which-keycode-for-escape-key-with-jquery
        if (e.keyCode === 27) {
            
            closeSearch();
            
            if (showing_details) {
                toggleDetails();    
            }
        }
    });

    return true;
}

function closeSearch() {
    document.getElementById('search-input').value = '';
    table.search('').draw();
    $('#data-table').hide();
    $('#close-search').hide();
}

function getData(config) {    
    //  store request names here so we we can assign
    //  data to proper config objects in q.awaitAll
    var layer_names = [];  

    for (var layer_name in config) {
        if (config.hasOwnProperty(layer_name)) {

            if (config[layer_name].init_display) {

                if (config[layer_name].source == 'knack') {
                    var req = knackViewRequest(config[layer_name]);
                    layer_names.push(config[layer_name].name)
                    q.defer(req.get)
                } else if (config[layer_name].source == 'socrata') {
                    var req = socrataRequest(config[layer_name]);
                    layer_names.push(config[layer_name].name);
                    q.defer(req.get);
                } else {
                    alert('no method to handle this layer source');
                }
            }
        }
        
    }

    q.awaitAll(function(error) {
        if (error) throw error;
        for ( var i = 0; i < arguments[1].length; i++ ) {
            var layer_name = layer_names[i];

            var layer = handleData(config[layer_name], arguments[1][i], function(layer){
                addToTable(layer.data, config[layer_name]);
                
                var markers = makeMarkers(layer.data, config[layer_name]);
                return markers;
            });
            
        }
        main(config);
    });
}


function knackViewRequest(config, currentPage=1) {
    var url = 'https://api.knack.com/v1/pages/' + config.sceneKey + '/views/' + config.viewKey + '/records?page=' + currentPage + '&rows_per_page=500';
    return d3.json(url)
        .header('X-Knack-Application-ID', config.appId)
        .header('X-Knack-REST-API-Key', 'knack')
        .header('content-type','application/json');
}


function handleData(layer, data, callback) {
    //  handle app-specific data
    //  and assign data to config layer
    if (layer.source == 'knack') {    
        if (layer.spatial_ref == 'stateplane') {
            //  project to wgs84
            for (var i = 0; i < data.records.length; i++) {
                layer.data[i] = projectPoint(data.records[i], layer.lonField, layer.latField);
            }
        } else {
            layer.data = data.records;
        }
        callback(layer);
    } else if (layer.source == 'socrata') {
        layer.data = data;
        callback(layer);
    } else {
        alert('Unable to handle undefined datasource!');
    }

}


function projectPoint(record, xField, yField) {    
    var latLon = sp_to_wgs84(record[xField], record[yField]);
    record[xField] = latLon['lon'];
    record[yField] = latLon['lat'];
    return record;
}


function socrataRequest(config) {
    var resource_id = config.resource_id;
    var url = 'https://data.austintexas.gov/resource/' + resource_id + '.json';
    if (config.query) {
        url = url + '?$query=' + config.query;
    }
    return d3.json(url);
}


function makeMarkers(data, config) {

    if (data.length > 0) {

        for (var i = 0; i < data.length; i++) {   
            var lat =  data[i][config.latField];
            var lon = data[i][config.lonField];

            var filterVal = data[i][config.filterField];
            
            //  get filter config
            var filter = filterByKeyValue(config.filters, 'value', filterVal)
            if (!filter[0]) {
                continue
            }

            var marker = L.marker([lat,lon], {
                icon:  MARKERS[filter[0].marker]
            })

            marker.rowId = '$' + data[i][config['rowIdField']];
            marker.layer_name = config.name;
            
            marker.on('click', function(){
                $('#data-table').hide();
                var record = findRecord(this.rowId, this.layer_name, CONFIG);
                populateDetails('feature-details', this.layer_name, record);
                if (!showing_details) {
                    toggleDetails();
                }
                var zoom = map.getZoom();
                zoomToMarker(record.marker, zoom);
                
            });
            
            var popup = config.popup(data[i]);
            marker.bindPopup(popup);

            config.data[i]['marker'] = marker;
        }
        
    }

}


function updateMap(layer) {
    if ( map.hasLayer(feature_layer) ) {
        map.removeLayer(feature_layer);
    }

    feature_layer = layer;
    feature_layer.addTo(map);
   adjustView(layer);    
}


function filterByKeyValue(arr, key, value) {
    //  search an array of objects
    //  for a matching key/value
    return arr.filter(function(entry){ 
        return entry[key] == value;
    });

}


function getMarkers(id_data) {
    //  get markers for all rows in data
    //  and add feature layer
    var layer = new L.featureGroup();

    for (var i = 0; i < id_data.length; i++){
        //  get row properties
        var layer_name = id_data[i].layer_name;
        var rowId = id_data[i].rowId;
        var rowIdField = CONFIG[layer_name].rowIdField;
        
        //  find matching marker in config master data
        for (var q = 0; q < CONFIG[layer_name].data.length; q++) {
            if (rowId == '$' + CONFIG[layer_name].data[q][rowIdField]) {
                CONFIG[layer_name].data[q].marker.addTo(layer);
                continue;
            }
        }
    }

    return layer;
}


function adjustView(layer) {

    if (layer) {
        var bounds = layer.getBounds()
    } else {
        var bounds = {};
    }

    if (Object.keys(bounds).length === 0 && bounds.constructor === Object) {
        //  http://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object
        //  empty bounds
        map.setView(MAP_OPTIONS.center, MAP_OPTIONS.zoom);
    } else {
        map.fitBounds(bounds, { maxZoom: 16 });    
    }

    map.invalidateSize();

}


function addToTable(data, config) {
    //  homegenize and merge data to be displayed one datatable
    for (var i = 0; i < data.length; i++) {
        var display_value = data[i][config.display_field];
        display_value = config.processDisplayField(display_value);
        data[i]['display_value'] = display_value;
        var rec = {
            'layer_name' : config.name,
            'rowId' : data[i][config.rowIdField],
            'display_value' : display_value,
        };

        table_data.push(rec);
    }

    return data;
}


function createTableListeners() {
    
    $("tr").on('click', function(obj) {
        //  get data from search results
        var rowId = $(this).find("a").attr("id");
        var layer_name = $(this).find("a").data('layer-name');
        //  get record, zoome to corresponding marker
        var record = findRecord(rowId, layer_name, CONFIG);
        //  hide search results
        $('#data-table').hide();
        //  update details pane and toggle it if necessary
        populateDetails('feature-details', layer_name, record);
        if (!showing_details) {
            toggleDetails();    
        }
        //  zoom to marker and open popup
        zoomToMarker(record.marker);
        record.marker.openPopup();
    });

}


function findRecord(rowId, layer_name, config) {
    //  offset zoom when overlay panel is visible

    var rowIdField = config[layer_name].rowIdField;
    for (var i = 0; i < config[layer_name].data.length; i++ ) {
        if ('$' + config[layer_name].data[i][rowIdField] == rowId ) {
            return config[layer_name].data[i];
        }
    }
}

function toggleMenu() {
    if (showing_details) {
        $("#feature-details").hide();
        showing_details = false;
    }
    if (!showing_menu) {
        $('#map-menu').fadeIn();
        showing_menu = true;
    } else {
        $('#map-menu').fadeOut();
        showing_menu = false;
    }
    
}

function toggleDetails() {
    if (showing_menu) {
        $('#map-menu').hide();
        showing_menu = false;
    }

    if (!showing_details) {
        $('#feature-details').fadeIn();
        showing_details = true;
    } else {
        $('#feature-details').fadeOut();
        showing_details = false;
    }
}


function populateDetails(divId, layer_name, record) {
    console.log(record);
   $('#' + 'feature-table').dataTable().fnDestroy();

    var details = CONFIG[layer_name].details(record);
    $('#' + divId).find('h3').html("<i class='fa fa-phone-square'></i> " + CONFIG[layer_name].display_name);
    $('#' + divId).find('p').text(details[0].value);

    if (CONFIG[layer_name].image_url) {
        var image_url = CONFIG[layer_name].image_url(record);
        $('#' + divId).find('a').attr('href', image_url).show();
        $('#' + divId).find('img').attr('src', image_url);
    } else {
        $('#' + divId).find('a').attr('href', '').hide();
        $('#' + divId).find('img').attr('src', '');
    }

    details.splice(0, 1); //  remove 'header' elem
    var feature_table = $('#' + 'feature-table')
        .DataTable({
            scrollCollapse : true,
            data : details, 
            bInfo : false,
            bSort : false,
            paging : false,
            columns: [
                { 
                    data: 'name' 
                },
                { 
                    data: 'value' 
                }
            ]
        });

    $('#feature-table_filter').remove();
}


function toPixels(latlng, callback) {
    var pixelPoint = map.latLngToContainerPoint(latlng);
    callback(pixelPoint);
}


function xOffset(pixelPoint, callback) {
    //  return map center x offset in pixels
    var doc_width = $(document).width();
    var overlay_width = $("#map-menu").width();
    var map_width = doc_width - overlay_width;
    var offset = map_width/2 - 250;  //  using a tempoary hardcode adjustment until overlay layout is finalized
    callback(pixelPoint, offset);
    
}


function zoomToMarker(marker, max_zoom=17) {
    //  zoom to a marker while accounting for overlay pane
    //  convert marker to pixels
    toPixels(marker._latlng, function(pixelPoint) {
        //  calculate offset distance in pixels
        xOffset(pixelPoint, function(pixelPoint, offset) {
            //  convert marker to bounds and add offset as padding
            fitMarker(marker, offset, max_zoom);
        });
    });
    
}


function fitMarker(marker, offset, max_zoom=17) {
    var bounds = marker._latlng.toBounds(1)
    map.fitBounds(bounds, {
        paddingTopLeft: [offset, 0],
        paddingbottomRight: [0, 0],
        maxZoom: max_zoom
    });
}

