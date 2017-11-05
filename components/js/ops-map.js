//  todo:
//  dummy commit
//  fix dms
//  modal loader
//  url parameters
//  what to do about requests missing lat/lon?
//      maybe dump them into a list that can be toggled?
//      ideally run them through COA geocoder
//      update socrata queries to selected specific fields of concern
//  create address name field on CSR records
//  test on IE and consider support
//  weird highlight behavior on search/toggle combos
//  handle when pane is longer than viewport (hide overflow?)
//  you have to preserve the browser location base url on refresh layers!
//  see: https://stackoverflow.com/questions/4740364/jquery-check-and-  -slash-from-the-end-of-url-read
//  target.replace(/\/$/, '');
//  also: https://stackoverflow.com/questions/824349/modify-the-url-without-reloading-the-page
//  move keyup escape to setstate business
//  boom! http://localhost:4000/ops-map/?layers=service_requests_new,cctv&featureid=209&layername=cctv#
//  init event fires populatetable multiple times via toggle layer
//  expanding details working! but weird pointer events happening

var map, basemap, table, feature_layer;

var q = d3.queue();

var max_zoom_to = 16;

var highlight_style = {
    weight: 2,
    fillOpacity : .2,
    color: '#0845a8'
};

//  init map state
//  to be updated by url params if they exist
var state = {
    'init_layers' : ['service_requests_new', 'service_requests_in_progress', 'incident_report'],
    'layers' : [],
    'search_layers' : [],
    'feature' : {
        'id' : '',
        'layer_name' : '',
        'marker' : '',
        'record' : '',
    },
    'showing_details' : false,
    'collapsed_details' : false,
    'showing_menu' : true,
    'searching' : false,
    'collapsed' : false,
    'curr_breakpoint' : '',
    'highlight_marker' : ''
}

$(document).ready(function(){
    $('#feature-details').hide();
    $('#close-search').hide();
    $('#mobile-card-expand').hide();
    $('#mobile-card-collapse').hide();
    getData(CONFIG);
});

function main(config) {
    resizedw();
    
    $(function () {
      $('[data-toggle="popover"]').popover()
    })

    map = createMap('map', MAP_OPTIONS);
    
    getParams(function(){
        updateData(state.layers, config);
    })
    
    createEventListeners();
    createLayerSelectListeners('map-layer-selectors', config);
    stateChange('init');
}


function createMap(divId, options) {
    //  mappy map
    L.Icon.Default.imagePath = '../components/images/';

    basemap = new L.tileLayer( 'http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
                attribution : 'Map tiles by <a href=\'http://stamen.com\'>Stamen Design</a>, <a href=\'http://creativecommons.org/licenses/by/3.0\'>CC BY 3.0</a> &mdash; Map data &copy; <a href=\'http://www.openstreetmap.org/copyright\'>OpenStreetMap</a>',
                subdomains : 'abcd',
                maxZoom : 20,
                ext : 'png'
    });

    map = new L.Map(divId, options)
        .addLayer(basemap);
    
    map.zoomControl.setPosition('bottomright');

    return map;
}


function populateTable(data, divId) {
    $('#data-table').hide();
    $('#' + divId).dataTable().fnDestroy();

    table = $('#' + divId)
        .DataTable({
            scrollY : '200px',  //  max table height
            scrollCollapse : true,
            data : data,
            bInfo : false,
            paging : false,
            drawCallback : function() {
                createTableListeners()
                clearMap();
                
                if (state.searching) {
                    //  map redrawing because of keyup
                    if ( $( '.sorting_1' ).length) {
                        //  show data table if there are search results
                        $('#data-table').show();
                    } else {
                       $('#data-table').hide();
                    }
                    
                    state.search_layers = getSearchMarkers();

                    //  update map with active search and base layers
                    addLayers(state.search_layers);   
                    //  set bounds to extent of search layer
                    adjustView(state.search_layers);
  
                } else {
                    //  map redrawing because of layer change
                    var layers = getConfigLayers(state.layers);
                    addLayers(layers);
                }


            },
            columns: [
                { 
                    data: 'display_value',
                
                    'render': function ( data, type, full, meta ) {
                        return '<a class=\'tableRow\' data-layer-name=\'' + full.layer_name + '\'id=\'$' + full.rowId +  '\'  \'>' +
                        '<i class=\'fa fa-' + CONFIG[full.layer_name].icon + '\' style=\'color:' + 
                        CONFIG[full.layer_name].icon_color + '\'></i> ' +
                         data + '</a>';
                    }   
                }
            ]
        })
        .on( 'draw.dt', function () {});
    
    $('#data-table_filter').remove();
}


function createEventListeners() {

    map.on('zoomend', function(){
        //  resize highlight marker on zoom
        if (map.hasLayer(state.highlight_marker)) {
            resizeMarker(state.highlight_marker);
        }
    });

    $('#map-btn-menu').on('click', function(){
        stateChange('map_menu_toggle');
    });

    $('#map-btn-home').on('click', function(){
        stateChange('map_home_toggle');
    });

    $('#search-input')
        .on('keyup', function () {
            state.searching = true;
            if (this.value) {
                //  search for features
                table.search( this.value ).draw();

                stateChange('search_input');

            } else {
                //  hide search results and (x) if no text in input
                $('#data-table').hide();
                $('#close-search').hide();
                closeSearch();
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
        
    })

    $('#close-feature-details').on('click', function() {
        //  close feature details when feature (x) is clicked
        //  map state is preserved
        stateChange('close_feature_details');

    })

     $('#close-menu').on('click', function() {
        stateChange('close_menu');
    })
    
    $(document).keyup(function(e) {
        //  esc key to cancel search input
        //  or to zoom home if not searching
        //  https://stackoverflow.com/questions/1160008/which-keycode-for-escape-key-with-jquery
        if (e.keyCode === 27) {
            if (state.searching) {
                closeSearch();

                if (state.showing_details) {
                    toggleDetails();    
                }

            } else {
                map.setView(MAP_OPTIONS.center, MAP_OPTIONS.zoom);
            }
        }
    });

     //  https://stackoverflow.com/questions/5489946/jquery-how-to-wait-for-the-end-of-resize-event-and-only-then-perform-an-ac
    var resize_timer;
    window.onresize = function(){
      clearTimeout(resize_timer);
      resize_timer = setTimeout(resizedw, 100);
    };

    return true;
}


function closeSearch() {
    document.getElementById('search-input').value = '';
    document.activeElement.blur();  //  clear focus from search input
    state.searching = false;
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

            if (config[layer_name].source == 'knack') {
                var req = knackViewRequest(config[layer_name]);
                layer_names.push(layer_name)
                q.defer(req.get)
            } else if (config[layer_name].source == 'socrata') {
                var req = socrataRequest(config[layer_name]);
                layer_names.push(layer_name);
                q.defer(req.get);
            } else if (config[layer_name].source == 'mapquest') {
                layer_names.push(layer_name);
                var empty = [];
                q.defer(handleBaseLayer, config[layer_name]);
            } else {
                alert('no method to handle this layer source');
            }

        }
        
    }

    q.awaitAll(function(error) {
        if (error) throw error;
        for ( var i = 0; i < arguments[1].length; i++ ) {
            var layer_name = layer_names[i];
            var layer = handleData(config[layer_name], arguments[1][i], function(layer){
                createMapLayerSelector(config[layer_name], 'map-layer-selectors');
                var markers = createMarkers(layer.data, config[layer_name]);
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


function handleBaseLayer(layer, callback) {
    createMapLayerSelector(layer, 'map-layer-selectors');
    callback(null);
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
    } else if (layer.source == 'mapquest') {
        // fire layer create function from layer config
        layer.layer = layer.layer_func();
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
    var url = config.base_url + resource_id + '.json';
    if (config.query) {
        url = url + '?$query=' + config.query;
    }
    return d3.json(url);
}


function createMarkers(data, config) {
    //  iterate through all records, adding markers to:
    //  the record itself and a master layer
    //  which contains all markers for the dataset

    //  master layer with all markers
    //  will not change after init
    var layer = new L.featureGroup();

    if (data.length > 0) {

        for (var i = 0; i < data.length; i++) {   
            var lat =  data[i][config.latField];
            var lon = data[i][config.lonField];

            if ( !lat || lat < 20) {
                //  skip records with missing or invalid latitude
                continue;
            }

            var marker = L.marker([lat,lon], {
                icon:  MARKERS[config.layer_name]
            })

            marker.rowId = '$' + data[i][config['rowIdField']];
            marker.layer_name = config.layer_name;
            
            marker.on('click', function(){
                var record = getRecord(this.rowId, this.layer_name, CONFIG);                

                stateChange('marker_click', { 
                    'hold_zoom' : true,
                    'layer_name' : this.layer_name,
                    'feature_id' : this.rowId,
                    'record' : record
                });

            });

            config.data[i]['marker'] = marker;
            marker.addTo(layer);
        }
        
    }

    config.layer = layer;
}


function addLayers(layers) {
    for (layer in layers) {
         layers[layer].addTo(map);
    }
}


function getMarker(rowId, layer_name) {
    var rowIdField = CONFIG[layer_name].rowIdField;

    for (var i = 0; i < CONFIG[layer_name].data.length; i++) {
        if (rowId == '$' + CONFIG[layer_name].data[i][rowIdField]) {
            return CONFIG[layer_name].data[i].marker;
        }  
    }
}


function adjustView(layers) {
    //  determine current map bounds
    //  and set map extent to fit

    var first_layer = layers[Object.keys(layers)[0]]
    var bounds = L.latLngBounds( first_layer );

    for (layer in layers) {
        bounds.extend( layers[layer].getBounds() )
    }

    map.fitBounds( bounds, { maxZoom: max_zoom_to } );    

    map.invalidateSize();

}


function addToTable(data, config, table_data) {
    //  homegenize and merge data to be displayed in one datatable
    for (var i = 0; i < data.length; i++) {
        var display_value = data[i][config.display_field];
        data[i]['display_value'] = display_value;
        var rec = {
            'layer_name' : config.layer_name,
            'rowId' : data[i][config.rowIdField],
            'display_value' : display_value,
        };

        table_data.push(rec);

    }

    return table_data;
}


function createTableListeners() {
    //  remove any existing click event
    $('#data-table').children('tbody').children('tr').off('click');
    //  zoom to marker on search results click
    $('#data-table').children('tbody').children('tr').on('click', function(obj) {

        //  get data from search results
        var rowId = $(this).find('a').attr('id');
        var layer_name = $(this).find('a').data('layer-name');
        //  get record
        var record = getRecord(rowId, layer_name, CONFIG);        
        
        stateChange('marker_click', { 
            'hold_zoom' : false,
            'layer_name' : layer_name,
            'feature_id' : rowId,
            'record' : record
        });

    });

}


function getRecord(rowId, layer_name, config) {
    var rowIdField = config[layer_name].rowIdField;
    for (var i = 0; i < config[layer_name].data.length; i++ ) {
        if ('$' + config[layer_name].data[i][rowIdField] == rowId ) {

            return config[layer_name].data[i];
        }
    }

}


function toggleMapControls() {
    if (!state.collapsed) {
        //  always show map controls when not collapsed
        $('#map-controls').show();
    } else {
        if (state.showing_details || state.showing_menu) {
           $('#map-controls').hide();
        } else {
            $('#map-controls').show();
        }    
    }
}


function toggleMenu() {
    $('#data-table').hide();
    
    if (state.showing_details) {
        $('#feature-details').hide();
        state.showing_details = false;
    }

    if (!state.showing_menu) {
        $('#map-menu').show();
        state.showing_menu = true;
    } else {
        $('#map-menu').hide();
        state.showing_menu = false;
    }

    toggleMapControls();
}


function toggleDetails() {
    
    if (!state.showing_details) {
    
        $('#map-menu').hide();
        $('#feature-details').show();
        state.showing_details = true;

    } else {
        $('#feature-details').hide();
        state.showing_details = false;

        if (state.showing_menu) {
            $('#map-menu').show();
        }
    }

    toggleMapControls();
}


function toggleHome() {
        //  reset view if menu 'home' button clicked;
        map.setView(MAP_OPTIONS.center, MAP_OPTIONS.zoom);
        
}


function populateDetails(divId, layer_name, record) {
   $('#' + 'feature-table').dataTable().fnDestroy();

    var details = CONFIG[layer_name].details(record);
    $('#' + divId).find('h3').html('<span class=\'map-menu-badge\' style=\'background-color: ' +
        CONFIG[layer_name].icon_color + '\' ><i class=\'fa fa-' + 
        CONFIG[layer_name].icon + '\' ></i></span> ' + CONFIG[layer_name].display_name);
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


function responsiveDetails() {
    if (state.collapsed && !(state.collapsed_details)) {
        //  hide feature details body and replace with expander button
        $('#card-body-wrapper').hide();
        $('#mobile-card-expand').show();
        $('#mobile-card-collapse').show();
        state.collapsed_details = true;
    } else if ((!state.collapsed) && state.collapsed_details) {
        $('#card-body-wrapper').show();
        $('#mobile-card-expand').hide();
        $('#mobile-card-collapse').hide();
        state.collapsed_details = false;
    }

    $('#feature-details').on('click', function() {
        if (state.collapsed && state.collapsed_details) {
            state.collapsed_details = false;
            $('#card-body-wrapper').show();
            $('#mobile-card-expand').hide();
        } else if (state.collapsed && (!state.collapsed_details)) {
            state.collapsed_details = true;
            $('#card-body-wrapper').hide();
            $('#mobile-card-expand').show();
        }
        
    })

}


function humanDate(timestamp) {
    //  https://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript
    // Create a new JavaScript Date object based on the timestamp
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    var date = new Date(timestamp*1000);
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getUTCFullYear();
    var formattedTime = month + '/' + day + '/' + year;
    return formattedTime;
}


function toPixels(latlng, callback) {
    var pixelPoint = map.latLngToContainerPoint(latlng);
    callback(pixelPoint);
}


function xOffset(pixelPoint, callback) {
    //  return map center x offset in pixels
    var doc_width = $(document).width();
    var overlay_width = $('#map-menu').width();
    var map_width = doc_width - overlay_width;
    var offset = map_width/2 - 250;  //  using a tempoary hardcode adjustment until overlay layout is finalized
    callback(pixelPoint, offset);
    
}


function zoomToMarker(marker, max_zoom=max_zoom_to) {
    //  zoom to a marker while accounting for overlay pane
    //  convert marker to pixels
    if (state.collapsed) {
        //  center on marker when collapsed
        //  you'll have to close menus to see marker
        fitMarker(marker, 0, max_zoom);

    } else {
        //  if not collapsed, zoom to offset point
        //  which avoids menu overlapping marker
        toPixels(marker._latlng, function(pixelPoint) {
            //  calculate offset distance in pixels
            xOffset(pixelPoint, function(pixelPoint, offset) {
                //  convert marker to bounds and add offset as padding
                fitMarker(marker, offset, max_zoom);
            });
        });
    }
    
}


function fitMarker(marker, offset, max_zoom=17) {
    var bounds = marker._latlng.toBounds(1)
    map.fitBounds(bounds, {
        paddingTopLeft: [offset, 0],
        paddingbottomRight: [0, 0],
        maxZoom: max_zoom
    });
}


function createMapLayerSelector(config, divId) {
    var popup = getPopup(config);
    console.log(popup);
    var selector = '<a href=\'#\' class=\'map-layer-toggle list-group-item\' data-layer-name=\'' 
        + config.layer_name + 
        '\' ' + popup +' ><span class=\'map-layer-toggle-icon ' + config.layer_name + '\' ><i class=\'fa fa-' + config.icon + '\'></i></span> '
        + config.display_name +
        '</a>';
    $('#' + divId).append(selector);

}


function updateData(layers, config) {
    //  refresh data objects based on current filters
    table_data = [];
    for (var i=0; i<layers.length; i++) {
        var layer_name = layers[i];
        if (config[layer_name].layer_type == 'markerLayer') {
            table_data = addToTable(config[layer_name].data, config[layer_name], table_data);        
        }
    }

    return table_data;
}


function createLayerSelectListeners(divId, config) {
    $('#' + divId).children().on('click', function() {
        toggleLayer(this);
    });
}


function toggleLayer(layer_selector) {
    //  set global layer change and searching statuses
    state.searching = false;

    var layer_name = $(layer_selector).data('layer-name');
    var layer_index = state.layers.indexOf(layer_name);
    
    if (state.layers.indexOf(layer_name) == -1){
        //  add layer if not in state
        state.layers.push(layer_name);
        //  add toggle class to selector and icon span
        $(layer_selector).addClass('toggled');
        $(layer_selector).find('span').addClass('toggled');  


    } else {
        //  remove layer if alreday in state
        state.layers.splice(layer_index, 1);
        $(layer_selector).removeClass('toggled')
        $(layer_selector).find('span').removeClass('toggled');
    }

    //  redraw search results and map
    var data = updateData(state.layers, CONFIG);
    populateTable(data, 'data-table');

}


function highlightMarker(marker) {
    //  apply a circle marker around 
    
    if (map.hasLayer(state.highlight_marker)) {
        state.highlight_marker.removeFrom(map);
    }
    
    var highlight = getHighlight(marker);

    highlight.addTo(map);
    state.highlight_marker = highlight;
    
}
    

function getHighlight(marker) {
    var marker_size = markerRadius();

    return L.circle(marker._latlng, {
            className: 'marker-highlight',
            radius: marker_size,
            className: 'blinking'
        })
        .setStyle(highlight_style);
}

   
function markerRadius() {
    var zoom = map.getZoom()
    return HIGHLIGTH_MARKER_SIZE['$' + zoom];
}


function resizeMarker(marker) {
    var marker_size = markerRadius();
    marker.setRadius(marker_size);
}


function clearMap() {
    //  remove active layers from map
    //
    //  using map.eachLayer() method was bugging out
    //  so instead we keep track of active layers and
    //  remove them explicitly
    for (layer in state.search_layers) {
        state.search_layers[layer].removeFrom(map);
    }
    
    for (dataset in CONFIG) {
        CONFIG[dataset].layer.removeFrom(map);
    }

}


function getSearchMarkers() {

    var search_layers = {};
    //  Iterate through all rows in search results
    //  Find marker and add to corresponding search layer
    $('.tableRow').each(function(i, obj) {
        var rowId = obj.id;
        var layer_name = $(obj).data('layer-name');
        var marker = getMarker(rowId, layer_name); 
        if ( !search_layers.hasOwnProperty(layer_name) ) {
            search_layers[layer_name] = new L.featureGroup();
        }
        marker.addTo(search_layers[layer_name]);
    });

    return search_layers;

}


function getBaseLayers(layer_names) {
    //  get layers of type baseLayer from config
    var layers = {};
    for (var i=0; i<layer_names.length; i++) {
        var layer_name = layer_names[i];
        if (CONFIG[layer_name].layer_type == 'baseLayer') {
            layers[layer_name] = CONFIG[layer_name].layer;
        }
    }
    return layers;
}


function getConfigLayers(layer_names) {
    var layers = {};
    
    for (var i=0; i<layer_names.length; i++) {
        var layer_name = layer_names[i];
        layers[layer_name] = CONFIG[layer_name].layer;
    }
    
    return layers;
}


function resizedw(){
    //  update UI when window is resized
    var prev_breakpoint = state.curr_breakpoint;
    state.curr_breakpoint = breakpoint();

    if (state.curr_breakpoint != prev_breakpoint) {
        
        if (state.curr_breakpoint === 'xs' || state.curr_breakpoint === 'sm' || state.curr_breakpoint === 'md') { 
            state.collapsed = true;
            $('#feature-details').css('cursor', 'pointer');
            toggleMapControls();
        } else {
            state.collapsed = false;
            $('#feature-details').css('cursor', 'default');
            toggleMapControls();
        }

        responsiveDetails();
    }
}


function getParam(name) {
    //  https://stackoverflow.com/questions/11582512/how-to-get-url-parameters-with-javascript/11582513#11582513
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}


function getParams(callback) {
    var layers = getParam('layers');

    if (layers) { 
        layers =  layers.split(',') 
        state.init_layers = layers;
    }
    
    var feature_id = '$' + getParam('featureid');
    var layer_name = getParam('layername')
    
    if (feature_id && layer_name) {
        state.feature.id = feature_id;
        state.feature.layer_name = layer_name;
    }
    
    callback(layers);

}

                
function setState(state, param, val) {

    state[param]=val;

    refreshParams(state);
    
}


function refreshParams(state) {
    //  add params to window.location
    //  https://stackoverflow.com/questions/8737615/append-a-param-onto-the-current-url
    var loc = '';
    
    if (state.layers) {
        //  add layers
        loc += '?layers=' + state.layers.join(',')
        
        if (state.feature.id) {
            loc += '&feature=' + 
            state.feature.id +
            'layer=' + state.feature.layer_name
        }

    }

    location.href = loc;

    return loc;

}


function stateChange(event, options) {
    //  function to manage map state during ui events
    //  and page init and when url params
    if (event=='init') {
        
        if (state.feature.id && state.feature.layer_name) {
            
            var record = getRecord(state.feature.id, state.feature.layer_name, CONFIG);
            if (record) {
                state.feature.record = record;
                stateChange('marker_click', { 'hold_zoom' : false });
            } else {
                alert('record and/or layer not found');
            }
        }

        $('#map-layer-selectors').children().each(function () {
            //  iteratere through map selectors and toggle default layers
            var layer_name = $(this).data('layer-name');

            if (state.init_layers.indexOf(layer_name) >= 0) {
                toggleLayer(this);
            }
            
        });

    } else if (event=='map_menu_toggle') {
        toggleMenu();

    } else if (event=='map_home_toggle') {

        if (state.showing_details) {
            toggleDetails();
        }

        toggleHome();
        closeSearch();

    } else if (event=='search_input') {

        $('#map-menu').hide();
        state.showing_menu = false;
        //  ensure details pane closes by toggling
        // details as if showing_details is true
        if (state.showing_details) {
            toggleDetails();
        }

        $('#close-search').show();

    } else if (event=='close_feature_details') {
        
        if (map.hasLayer(state.highlight_marker)) {
            state.highlight_marker.removeFrom(map);
        }

        toggleDetails();
        closeSearch();     

    }  else if (event=='close_menu') {
        //  close menu when (x) is clicked
        //  map state is preserved
        state.showing_menu = false;
        $('#map-menu').hide();
        toggleMapControls();

    } else if (event=='marker_click') {

        if (options.hold_zoom) {
            //  hold current zoom when clicking on marker
            var max_zoom = map.getZoom();
        } else {            
            var max_zoom = max_zoom_to;
        }
        
        //  update globals
        state.feature.layer_name = options.layer_name;
        state.feature.id = options.rowId;
        state.feature.record = options.record;

        zoomToMarker(options.record.marker, max_zoom=max_zoom);
        highlightMarker(options.record.marker);
        populateDetails('feature-details', options.layer_name, options.record);

        $('#data-table').hide();
                
        if (!state.showing_details) {
            toggleDetails();
        }

    }
        
}


function getPopup(config) {
    //  return bootstrap popup html that can be inserted into dom element properties
    return 'data-container=\'body\' data-trigger=\'hover\' data-toggle=\'popover\' data-placement=\'top\' data-content=\'' + config.popup_text + '\'';
}



