var map, feature_layer, data, table;

var requests_url = 'https://data.austintexas.gov/resource/yfa7-33gh.json';

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
};

var map_layers = {};

var map_expanded = false;

var collapsed_class = 'col-sm-6';

var expanded_class = 'col-sm-12';

var default_view = true;

var default_style = {
    'PHB': {
        color: '#fff',
        weight: 1,
        fillColor: '#a65628',
        fillOpacity: .8
    },
    'TRAFFIC' : {
        color: '#fff',
        weight: 1,
        fillColor: '#237FB4',
        fillOpacity: .8
    }
}

var icon_lookup = {
    'PHB' : 'fa-male',
    'TRAFFIC' : 'fa-car'
}

var table_height = '40vh';

var current_table_height;

var map_options = {
        center : [30.28, -97.735],
        zoom : 10,
        minZoom : 1,
        maxZoom : 20,
        scrollWheelZoom: false
    };

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
    
    var request_data = getOpenData(requests_url);

    var request_data = filterUnique(request_data);

    main(request_data);

});

d3.select('#map-expander').on('click', function(){

    if (map_expanded) {
        
        map_expanded = false;
        collapseMap('table_col', 'map_col');

    } else {
        
        map_expanded = true;

        expandMap('table_col', 'map_col');
    }

})

function main(request_data){

    map = makeMap('map', map_options);

    data = createMarkers(request_data, default_style);

    populateTable(data);

    $('#search_input').on( 'keyup', function () {
        table.search( this.value ).draw();
    } );

    map.on('zoomend', function() {

        setMarkerSizes(data);

    });

    d3.selectAll(".tableRow")
        .on("click", function(d){

            var marker_id = d3.select(this).attr("id");

            var eval_type = d3.select(this).attr("data-eval-type");

            zoomToMarker(marker_id);
    });

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

    return map;

}


function getOpenData(resource_id, options) {

    var url = requests_url;  // testing

    if (options != undefined) {
        if (!('filter' in options)) {
            
            options.filter = '';
            
        }
    } else {

        options = {};
        options.filter = ''

    }

    //  fvar url = 'https://data.austintexas.gov/resource/' + resource_id + '.json?$limit=2000' + options.filter;

    var request_data = $.ajax({
        'async' : false,
        'global' : false,
        'cache' : false,
        'url' : url,
        'dataType' : 'json',
        'success' : function (data) {
            return data;
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log(textStatus, errorThrown);
        }

    }); //end get data

    return request_data.responseJSON;

}



function populateTable(data, divId, filters) {
    
    if ( $('#' + divId) ) {

        $('#' + divId).dataTable().fnDestroy();

    }

    table = $('#data_table')
        .on( 'init.dt', function () {
        
            $('[data-toggle="popover"]').popover();

            adjustMapHeight();

        })
        //  update map after table search
        .on( 'draw.dt', function () {
            
            var ids = [];

            $('.tableRow').each(function(i, obj) {
                ids.push(obj.id);
            });

            if (ids.length > 0 ) {
                var markers = getMarkers(data, ids);

                updateMap(markers);

            }

        })
        .DataTable({
            data : data,
            rowId : 'system_id',
            scrollY : table_height,
            scrollCollapse : true,
            bInfo : false,
            paging : false,
            columns: [
                
                { data: 'location_name',
                    "render": function ( data, type, full, meta ) {
                        return "<a class='tableRow' id='$" + full.request_id + "' data-eval-type =" + full.eval_type + ">" + data + "</a>";
                    }
                },
                
                { data: 'eval_type', "searchable": false,
                   "render": function ( data, type, full, meta ) {
                        
                        if (full.eval_type == 'TRAFFIC') {
                            return "<span style='font-weight: bold; color: " + default_style[full.eval_type]['fillColor'] + ";' ><i class='fa fa-car' ></i> " + full.eval_type + "</span>";
                        
                        } else {
                             return "<span style='font-weight: bold; color: " + default_style[full.eval_type]['fillColor'] + ";' ><i class='fa fa-female' ></i> " + full.eval_type + "</span>";
                        
                        }
                    }
                },

                { data: 'request_status' }
            ]
        });

    d3.select("#data_table_filter").remove();

}





function transitionInfoStat(selection, options) {

    var t = d3.transition()
        .ease(options.ease)
        .duration(options.duration);

    selection.transition(t)  //  do this for each selection in sequence
        .tween('text', function () {
            
            var that = d3.select(this);

            var new_value = that.data()[0].data.length;
            
            var i = d3.interpolate(0, new_value);
            
            return function (t) {
            
                that.text( formats['round'](i(t)) );  // how to access the format type from the 'this' data?
            
            }

        });

    return selection;

}



function createMarkers(data, style) {

    for (var i = 0; i < data.length; i++) {   
        
        var location_name = data[i].location_name;

        var status = data[i].request_status;

        var eval_type = data[i].eval_type;

        var lat = data[i].latitude;
        
        var lon = data[i].longitude;

        var request_note = ''
        
        if (data[i].request_note) {
            var request_note = data[i].request_note;
        }

        data[i]['marker'] = L.circle([lat,lon], 500)
          .setStyle(style[eval_type])
          .bindPopup( '<b><i class="fa ' + icon_lookup[eval_type] + '" ></i> ' + eval_type  + ' REQUEST </b></br>' + location_name + '</br> Status: ' + status + '</br> <i>' + request_note + '</i>')
          .setStyle(style)
          .bindPopup( '<b><i class="fa ' + icon_lookup[eval_type] + '" ></i> ' + eval_type  + ' REQUEST </b></br>' + location_name + '</br> Status: ' + status + '</br> <i>' + request_note + '</i>')

    }
    
    return data;

}



function filterData(data, filters) {

    var filtered_data = [];

    for (var i = 0; i < data.length; i++) { 

        if ( matchesFilters( data[i], filters ) ) {

            //  inspired by https://blogs.kent.ac.uk/websolutions/2015/01/29/filtering-map-markers-with-leaflet-js-a-brief-technical-overview/
           filtered_data.push( data[i] );

        }

    }

    return filtered_data;

}



function matchesFilters(data, filters) {

    for (var filter in filters) {

        if ( filters[filter].indexOf( String(data[filter] ).toUpperCase() ) < 0 ) {

            return false;

        }

    }

    return true;

}



function createFeatureLayer(data) {

    var layer = new L.featureGroup();

    for (var i = 0; i < data.length; i++) {

        data[i].marker.addTo(layer);

    }

    return layer;

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
                map.fitBounds(feature_layer.getBounds());
            });            

        console.log(table_div_height);

    }, 200);

}
    


function getMarkers(source_data, id_array) {
    
    var layer = new L.featureGroup();

    for (var i = 0; i < source_data.length; i++) {
        
        if ( id_array.indexOf( '$' + source_data[i]['request_id']) > -1 ) {
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

    map.fitBounds(feature_layer.getBounds(), { maxZoom: 16 });    

    map.invalidateSize();

}



function setMarkerSizes(data) {

    var zoom = map.getZoom();

    for (var i = 0; i < data.length; i++){

        data[i].marker.setRadius(SCALE_THRESHOLDS["$"+ zoom]);

    }

}



function zoomToMarker(marker) {

    for (var i = 0; i < data.length; i++ ) {
    
        if ('$' + data[i].request_id == marker ) {
         
            map.fitBounds(
                data[i].marker.getBounds(),
                { maxZoom: 16 }

            );

            map.invalidateSize();

            data[i].marker.openPopup();

        }
    }
}



function filterUnique(dataset) {
    
    var unique_request_ids = [];

    var unique_records = [];

    for (var i = 0; i < dataset.length; i++) {

        if (unique_request_ids.indexOf(dataset[i].request_id) < 0) {
            
            unique_request_ids.push(dataset[i].request_id);

            unique_records.push(dataset[i]);

        }

    }

    return unique_records;

}



function expandMap(table_div_id, map_div_id) {
    
    d3.select('#' + table_div_id).attr("class", expanded_class + ' full_width');

    d3.select('#' + map_div_id).attr("class", expanded_class + ' full_width');

    d3.select("#map")
                
                .transition(t2)
                .style("height", window.innerHeight + "px")
                .on("end", function() {
                    map.invalidateSize();
                    map.fitBounds(feature_layer.getBounds());
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
            map.fitBounds(feature_layer.getBounds());


        });            ;

    table.draw();

}











