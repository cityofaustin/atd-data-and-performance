var map, feature_layer, data, highlighted_marker;

var requests_url = '../components/data/fake_request_data.json';

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

var default_filters = {
        'request_type' : [ 'TRAFFIC' ],
        'request_status' : [ 'UNDER_EVALUATION']
    };

var active_filters = default_filters;

var default_view = true;

var default_style = {
    color: '#fff',
    weight: 1,
    fillColor: '#7570b3',
    fillOpacity: .8
}

var highlight_style = {
    color: '#fff',
    weight: 1,
    fillColor: '#d95f02',
    fillOpacity: .9
}

var table_height = '40vh';

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

            //  clear existing higlight / popup
            if (highlighted_marker) {

                highlighted_marker.setStyle(default_style);

            }

            highlightMarker(marker_id);

    });

}



function makeMap(divId, options) {

    //  mappy map
    L.Icon.Default.imagePath = '../components/images/';

    var layers = {
        Stamen_TonerLite: L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
            attribution : 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            subdomains : 'abcd',
            maxZoom : 20,
            ext : 'png'
        })
    }

    var map = new L.Map(divId, options)
        .addLayer(layers['Stamen_TonerLite']);

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




function appendInfoText(data) {

    d3.selectAll('.loading').remove();

    var selection = d3.selectAll('.info')
        .data(data)
        .append('text')
        .text(function(d) {
            return d.init_val;
        });

    return selection;

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

            if (highlighted_marker) {

                highlighted_marker.setStyle(default_style);

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
                        return "<a class='tableRow' id='$" + full.atd_location_id + "' >" + data + "</a>";
                    }
                },
                { data: 'request_type', "searchable": false },
                { data: 'request_status', "searchable": false },

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


function getActiveIds(table_div) {
    var ids = $('.tableRow').map(function(index) {
        return this.text; 
    });
}



function createMarkers(data, style) {

    for (var i = 0; i < data.length; i++) {   

        var popup_text = '';
        
        var location = data[i].location.replace('(','').replace(')','').split(',');
        
        var lat = location[0];

        var lon = location[1];

        data[i]['marker'] = L.circle([lat,lon], 500)
          .setStyle(style)
          .bindPopup('GREAT POPUP!')
          .on('click', markerClick);

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
        
        var table_div_height = document.getElementById('data-row').clientHeight;

        d3.select("#map")
            .transition(t2)
            .style("height", table_div_height + "px");            

    }, 200);
}
    


function getMarkers(source_data, id_array) {
    
    var layer = new L.featureGroup();

    for (var i = 0; i < source_data.length; i++) {
        
        if ( id_array.indexOf( '$' + source_data[i]['atd_location_id']) > -1 ) {
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

    map.fitBounds(feature_layer.getBounds());    

}



function setMarkerSizes(data) {

    var zoom = map.getZoom();

    for (var i = 0; i < data.length; i++){

        data[i].marker.setRadius(SCALE_THRESHOLDS["$"+ zoom]);

    }

}



function highlightMarker(marker) {

    for (var i = 0; i < data.length; i++ ) {
    
        if ('$' + data[i].atd_location_id == marker ) {
         
            map.fitBounds(
                data[i].marker.getBounds(),
                { maxZoom: 16 }

            );

            highlighted_marker = data[i].marker;

            highlighted_marker.setStyle(highlight_style).openPopup();

        }
    }
}


function markerClick(e) {

    if (highlighted_marker) {

        highlighted_marker.setStyle(default_style);

    }

    highlighted_marker = this;

    highlighted_marker.setStyle(highlight_style).openPopup();


}















