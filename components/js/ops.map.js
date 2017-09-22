//  todo:
//  what to do about requests missing lat/lon?
//  maybe dump them into a list that can be toggled?
//  ideally run them through COA geocoder
//  update socrata queries to selected specific fields of concern
//  'filters' is not the right place to assign markers in config
//          add layers/get more data
//  create address name field on CSR records
//  overlay on small display
//  hide #map-controls on collapse when details are showing
//  test on IE and consider support
//  weird highlight behavior on search/toggle combos

var map, basemap, table, feature_layer, highlight;

//  if table/map are updating from layer selector toggle,
//  layer_change is true and is referenced when updating datatable
//  to determine if search results table (data table) should be shown
var layer_change = true;   
var searching = false;
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
    map = createMap('map', MAP_OPTIONS);
    var data = updateData(config)
    populateTable(data, 'data-table');
    createEventListeners();
    createTableListeners();
    createLayerSelectListeners('map-layer-selectors', config);
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
    
    //  $('#loader').modal('toggle');

    var zoomHome = L.Control.zoomHome({position : 'bottomright'});
    zoomHome.addTo(map);
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

                clearMap();

                //  if map is redrawing because of keyup
                if (searching) {

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
                    //  layers added or removed
                    var layers = getConfigLayers();
                    addLayers(layers);   
                }


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

    $('#map-menu-btn').on('click', function(){
        toggleMenu();
    });

    $('#search-input')
        .on('keyup', function () {
            layer_change = false;
            searching = true;
            if (this.value) {
                //  search for features
                table.search( this.value ).draw();
                $('#close-search').show();

                $('#map-menu').hide();
                showing_menu = false;

                 $('#feature-details').hide();
                 showing_details = false;
                
                if (map.hasLayer(highlight)) {
                      map.removeLayer(highlight);  
                } 

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
        document.getElementById('search-input').value = '';
        $('#close-search').hide();
        toggleDetails();
        
        if (map.hasLayer(highlight)) {
          map.removeLayer(highlight);  
        }

    })
    
    $(document).keyup(function(e) {
        //  esc key to cancel search input
        //  or to zoom home if not searching
        //  https://stackoverflow.com/questions/1160008/which-keycode-for-escape-key-with-jquery
        if (e.keyCode === 27) {
            if (searching) {
                closeSearch();

                if (showing_details) {
                    toggleDetails();    
                }

            } else {
                map.setView(MAP_OPTIONS.center, MAP_OPTIONS.zoom);

            }
        }
    });

    return true;
}

function closeSearch() {
    document.getElementById('search-input').value = '';
    document.activeElement.blur();  //  clear focus from search input
    searching = false;
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

            if (config[layer_name].init_load) {

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
                addMapLayerSelector(config[layer_name], 'map-layer-selectors');
                
                //  set initial visibility state of layer
                if (config[layer_name].init_display) {
                    config[layer_name].active = true;
                } else {
                    config[layer_name].active = false;
                }
                
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
    var url = 'https://data.austintexas.gov/resource/' + resource_id + '.json';
    if (config.query) {
        url = url + '?$query=' + config.query;
    }
    return d3.json(url);
}


function createMarkers(data, config) {
    //  iterate through all records, adding markers to:
    //  the record itself
    //  a master layer which contains all markers for the dataset

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
                highlightMarker(record.marker);
                
            });
            
            //  var popup = config.popup(data[i]);
            //  marker.bindPopup(popup);

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


function removeLayer(layers) {

}


function filterByKeyValue(arr, key, value) {
    //  search an array of objects
    //  for a matching key/value
    return arr.filter(function(entry){ 
        return entry[key] == value;
    });

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

    var first_layer = layers[Object.keys(layers)[0]]
    var bounds = L.latLngBounds( first_layer );

    for (layer in layers) {
        bounds.extend( layers[layer].getBounds() )
    }

    map.fitBounds( bounds, { maxZoom: 16 } );    

    map.invalidateSize();

}


function addToTable(data, config, table_data) {
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

    return table_data;
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
        highlightMarker(record.marker);
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
     $("#data-table").hide();
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

//  we have a filters object
//  add to filters object when get data
//  create map selector, too
//  we update the table data with the filters object
//  and re-create the layers

function addMapLayerSelector(config, divId) {
    
    if (config.init_display) {
        //  apply toggled layer class
        //  according to config
        var toggle_class = 'toggled';        
    } else {
        var toggle_class = '';
    }

    var selector = "<a href=\"#\" class=\"map-layer-toggle list-group-item " + toggle_class + "\" data-layer-name=\"" + config.name + "\" ><i class=\"fa fa-" + config.icon + "\"></i> " + config.display_name + "</a>";
    $('#' + divId).append(selector);

}


function updateData(config) {
    //  refresh data objects based on current filters
    table_data = [];

    for (var layer_name in config) {
        if (config[layer_name].active) {
            table_data = addToTable(config[layer_name].data, config[layer_name], table_data);        
        }
    }

    return table_data;
}



function createLayerSelectListeners(divId, config) {
    $('#' + divId).children().on('click', function() {
        var layer_name = $(this).data('layer-name');
        layer_change = true;

        //  set activation state of layer
        if (config[layer_name].active) {
            config[layer_name].active = false;
            $(this).removeClass("toggled");
        } else {
            config[layer_name].active = true;
            $(this).addClass("toggled");
        }

        var data = updateData(config);
        populateTable(data, 'data-table');
    });
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
            color: '#4250f4'
        })
        .addTo(map);
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
        map.removeLayer(layer);
    });
                
    map.addLayer(basemap);
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


function getConfigLayers() {
    var layers = {};
    for (dataset in CONFIG) {
        if (CONFIG[dataset].active) {
            layers[dataset] = CONFIG[dataset].layer;
        }
    }
    return layers;
}








                