var map, feature_layer, data, table;

var requests_url = 'https://data.austintexas.gov/resource/fs3c-45ge.json?$query= SELECT atd_camera_id, location_name, location';

var formats = {
    'round': function(val) { return Math.round(val) },
};

var map_layers = {};

var map_expanded = false;

var collapsed_class = 'col-sm-6';

var expanded_class = 'col-sm-12';

var default_view = true;

var default_style = {
    color: '#fff',
    weight: 1,
    fillColor: '#237FB4',
    fillOpacity: .8
}

var icon_lookup = {
    'PHB' : 'fa-male',
    'TRAFFIC' : 'fa-car'
}

var table_height = '60vh';

var popup_width = '100px';

var current_table_height;

var t_options = {
    ease : d3.easeQuad,
    duration : 500
};

var t2 = d3.transition()
    .ease(t_options.ease)
    .duration(t_options.duration);

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
        })
    }

    var map = new L.Map(divId, options)
        .addLayer(layers['carto_positron']);

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
            rowId : 'atd_camera_id',
            scrollY : table_height,
            scrollCollapse : true,
            bInfo : false,
            paging : false,
            columns: [
                
                { data: 'atd_camera_id' },

                { data: 'location_name',
                    "render": function ( data, type, full, meta ) {
                        return "<a class='tableRow' id='$" + full.atd_camera_id + "' '>" + data + "</a>";
                    }
                }
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

    base_url = 'https://raw.githubusercontent.com/cityofaustin/transportation-data-publishing/master/data/cam_img/'

    for (var i = 0; i < data.length; i++) {   
        
        var location_name = data[i].location_name;

        var id = data[i].atd_camera_id

        var lat = data[i]["location"]["coordinates"][1];
        
        var lon = data[i]["location"]["coordinates"][0];

        data[i]['marker'] = L.circle([lat,lon], 500)
          .setStyle(style)
          .bindPopup( "<img src=" + base_url + id + ".jpg width=300 /></br>" +  id + ': ' + location_name)

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
        
        if ( id_array.indexOf( '$' + source_data[i]['atd_camera_id']) > -1 ) {
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
    
        if ('$' + data[i].atd_camera_id == marker ) {
         
            map.fitBounds(
                data[i].marker.getBounds(),
                { maxZoom: 16 }

            );

            map.invalidateSize();

            data[i].marker.openPopup();

        }
    }
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











