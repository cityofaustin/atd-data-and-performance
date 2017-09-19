//  todo:
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
//  you have to preserve the base url on refresh layers!
//  see: https://stackoverflow.com/questions/4740364/jquery-check-and-remove-slash-from-the-end-of-url-read
//  target.replace(/\/$/, '');
//  also: https://stackoverflow.com/questions/824349/modify-the-url-without-reloading-the-page
//  if map menu was open, show it on close feature details
//  move keyup escape to setstate business
//  boom! http://localhost:4000/ops-map/?layers=service_requests_new,cctv&featureid=209&layername=cctv#

var map, basemap, table, feature_layer, highlight;

//  If table/map are updating from layer selector toggle,
var q = d3.queue();

var max_zoom_to = 16;

//  init map state
//  to be updated by url params if they exist

var state = {
    'init_layers' : ['service_requests_new', 'service_requests_in_progress', 'incident_report'],
    'layers' : [],
    'feature' : {
        'id' : '',
        'layer_name' : '',
        'marker' : '',
        'record' : '',
    },
    'showing_deatils' : false,
    'showing_menu' : true,
    'searching' : false,
    'collapsed' : false,
    'curr_breakpoint' : ''
}

$(document).ready(function(){
    getData(CONFIG);
});

function main(config) {
    resizedw();
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
                attribution : 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
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
                createTableListeners();
                clearMap();

                
                if (state.searching) {
                    //  map redrawing because of keyup
                    if ( $( ".sorting_1" ).length) {
                        //  show data table if there are search results
                        $('#data-table').show();
                    } else {
                       $('#data-table').hide();
                    }
                    
                    var layers = getSearchMarkers();
                    addLayers(layers);   
                    adjustView(layers);
  
                } else {
                    //  map redrawing because of layer change
                    var layers = getConfigLayers(state.layers);
                    addLayers(layers);   

                }


            },
            columns: [
                { 
                    data: 'display_value',
                
                    "render": function ( data, type, full, meta ) {
                        return "<a class='tableRow' data-layer-name='" + full.layer_name + "' id='$" + full.rowId + "' '>" +
                        "<i class='fa fa-" + CONFIG[full.layer_name].icon + "' style='color:" + CONFIG[full.layer_name].icon_color + "'></i> " +
                         data + "</a>";
                    }   
                }
            ]
        })
        .on( 'draw.dt', function () {});
    
    $('#data-table_filter').remove();
}


function createEventListeners() {
    map.on('click', function() {
        map.removeLayer(highlight);
    });

    map.on('zoomend', function(){
        //  resize highlight marker on zoom
        if (map.hasLayer(highlight)) {
            resizeMarker(highlight);
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
    
        if (map.hasLayer(highlight)) {
          map.removeLayer(highlight);  
        }     

        
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
                layer_names.push(config[layer_name].layer_name)
                q.defer(req.get)
            } else if (config[layer_name].source == 'socrata') {
                var req = socrataRequest(config[layer_name]);
                layer_names.push(config[layer_name].layer_name);
                q.defer(req.get);
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

    //  empty search layer that will be populated
    //  dynamically by search results
    var layer_searching = new L.featureGroup();

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
                state.feature.layer_name = this.layer_name;
                state.feature.id = this.rowId;
                state.feature.record = record;
                stateChange('marker_click', { 'hold_zoom' : true });

            });

            config.data[i]['marker'] = marker;
            marker.addTo(layer);
        }
        
    }

    config.layer = layer;
    config.layer_searching = layer_searching;
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
    //  zoom to marker on search results click

    $("tr").on('click', function(obj) {

        //  get data from search results
        state.feature.id = $(this).find("a").attr("id");
        state.feature.layer_name = $(this).find("a").data('layer-name');
        //  get record
        var record = getRecord(state.feature.id, state.feature.layer_name, CONFIG);
        state.feature.record = record;
        stateChange('marker_click', { 'hold_zoom' : false });

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
        $("#map-controls").show();
    } else {
        
        if (state.showing_details || state.showing_menu) {
           $("#map-controls").hide();
        } else {
            $("#map-controls").show();
        }    
    }
}


function toggleMenu() {
     $("#data-table").hide();
    if (state.showing_details) {
        $("#feature-details").hide();
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
    if (state.showing_menu) {
        $('#map-menu').hide();
        state.showing_menu = false;
    }

    if (!state.showing_details) {
        $('#feature-details').show();
        state.showing_details = true;
    } else {
        $('#feature-details').hide();
        state.showing_details = false;
    }

    toggleMapControls()
}


function toggleHome() {
        //  reset view if menu 'home' button clicked;
        map.setView(MAP_OPTIONS.center, MAP_OPTIONS.zoom);
        
        if (map.hasLayer(highlight)) {
            map.removeLayer(highlight);  
        } 
}


function populateDetails(divId, layer_name, record) {
   $('#' + 'feature-table').dataTable().fnDestroy();

    var details = CONFIG[layer_name].details(record);
    $('#' + divId).find('h3').html("<span class=\" map-menu-badge\" style=\"background-color: " + CONFIG[layer_name].icon_color + "\" ><i class='fa fa-" + CONFIG[layer_name].icon + "'></i></span> " + CONFIG[layer_name].display_name);
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
    var overlay_width = $("#map-menu").width();
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

    var selector = "<a href=\"#\" class=\"map-layer-toggle list-group-item\" data-layer-name=\"" 
        + config.layer_name + 
        "\" ><span class=\"map-layer-toggle-icon " + config.layer_name + "\" ><i class=\"fa fa-" + config.icon + "\"></i></span> "
        + config.display_name +
        "</a>";
    $('#' + divId).append(selector);

}


function updateData(layers, config) {
    //  refresh data objects based on current filters
    table_data = [];

    for (var i=0; i<layers.length; i++) {
        var layer_name = layers[i];
        table_data = addToTable(config[layer_name].data, config[layer_name], table_data);        
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
        $(layer_selector).addClass("toggled");
        $(layer_selector).find("span").addClass("toggled");  


    } else {
        //  remove layer if alreday in state
        state.layers.splice(layer_index, 1);
        $(layer_selector).removeClass("toggled")
        $(layer_selector).find("span").removeClass("toggled");
    }

    //  redraw search results and map
    var data = updateData(state.layers, CONFIG);
    populateTable(data, 'data-table');

}


function highlightMarker(marker) {
    if (map.hasLayer(highlight)) {
        map.removeLayer(highlight);  
    } 
    var marker_size = markerRadius();

    highlight = L.circle(marker._latlng, {
            className: 'marker-highlight',
            radius: marker_size,
        })
        .setStyle({
            stroke: false,
            fillOpacity : .5,
            color: 'rgb(66, 134, 244)'
        })
        .addTo(map);

    //  animateMarker();
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
    map.eachLayer(function(layer){
        if (layer==basemap) {
            return
            
        } else {
            map.removeLayer(layer);
        }

    });
                
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


function getConfigLayers(layer_names) {
    var layers = {};
    
    for (var i=0; i<layer_names.length; i++) {
        var layer_name = layer_names[i];
        layers[layer_name] = CONFIG[layer_name].layer;
    }
    
    return layers;
}


function animateMarker() {
    //  not currently using, but one could do this:
    //  https://bl.ocks.org/d3noob/bf44061b1d443f455b3f857f82721372
    var markers = d3.selectAll(".marker-highlight")
    var ease = d3.easeCircleIn;
    var color1 = "rgb(255, 255, 255)";
    var color2 = "rgb(242, 197, 0)";

    repeat();
    
    function repeat() {

      markers
        .transition()   
        .ease(ease)    
        .duration(400)
        .attr('opacity', .7)
        .attr('fill', color2)
        .transition()      
        .duration(1000)    
        .attr('opacity', .1)
        .attr('fill', color1)
        .on("end", repeat);
    };

}



function resizedw(){

    var prev_breakpoint = state.curr_breakpoint;
    state.curr_breakpoint = breakpoint();

    if (state.curr_breakpoint != prev_breakpoint) {
        
        if (state.curr_breakpoint === 'xs' || state.curr_breakpoint === 'sm' || state.curr_breakpoint === 'md') { 
            state.collapsed = true;
            toggleMapControls();
        } else {
            state.collapsed = false;
            toggleMapControls();
        }
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
        loc += "?layers=" + state.layers.join(",")
        
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
        $('#feature-details').hide();
        $('#close-search').hide();

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
        
        //  remove highlight
        if (map.hasLayer(highlight)) {
              map.removeLayer(highlight);  
        } 

        $('#close-search').show();

    } else if (event=='close_feature_details') {

        document.getElementById('search-input').value = '';
        
        $('#close-search').hide();
        
        toggleDetails();        
        
        if (map.hasLayer(highlight)) {
          map.removeLayer(highlight);  
        }
    }  else if (event=='close_menu') {
        //  close menu when (x) is clicked
        //  map state is preserved
        showing_menu = false;
        $('#map-menu').hide();
        toggleMapControls();

    } else if (event=='marker_click') {
        
        if (options.hold_zoom) {
            //  hold current zoom when clicking on marker
            var max_zoom = map.getZoom();
        } else {            
            var max_zoom = max_zoom_to;
        }
        
        zoomToMarker(state.feature.record.marker, max_zoom=max_zoom);

        highlightMarker(state.feature.record.marker);

        populateDetails('feature-details', state.feature.layer_name, state.feature.record);

        $('#data-table').hide();
                
        if (!state.showing_details) {
            toggleDetails();
        }

        if (state.showing_menu) {
            toggleMenu();
        }
        
    }
    
    
}




