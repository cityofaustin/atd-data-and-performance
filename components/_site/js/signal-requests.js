var pizza;

var map;

var t_options = {
    ease : d3.easeQuad,
    duration : 500
};

var formats = {
    'round': function(val) { return Math.round(val) },
};

var map_layers = {};

var default_filters = {
        'request_year' : [ '2015', '2016' ],
        'request_type' : [ 'TRAFFIC', 'PHB' ],
        'request_status' : [ 'STUDY', 'CONSTRUCTION']
    };

var default_style = {
    color: '#fff',
    weight: 1,
    fillColor: '#7570b3',
    fillOpacity: .8
}

var active_filters = default_filters;

var map_options = {
        center : [30.28, -97.735],
        zoom : 10,
        minZoom : 1,
        maxZoom : 20,
        scrollWheelZoom: false
    };

var requests_url = '../components/data/fake_request_data.json';

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
        
        d3.select('.map')
            .style('margin-right', '10px')
            .style('margin-left', '10px');
    }

    main();

});

function main(){

    var request_data = getOpenData(requests_url);

    map = makeMap('map', map_options);

    request_data = createMarkers(request_data, default_style);

    var filtered_data = filterData(request_data, default_filters);

    var feature_layer = createFeatureLayer(filtered_data);

    feature_layer.addTo(map);

    map.fitBounds(feature_layer.getBounds());

    populateTable(filtered_data);


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

    var data = $.ajax({
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

    return data.responseJSON;

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

        })
        .DataTable({
            data: data,
            rowId: 'system_id',
            'bLengthChange': false,
            'bInfo' : false,
            'bFilter' : false,
            columns: [
                { data: 'location_name' },
                { data: 'request_type' },
                { data: 'request_status' }

            ]
        });
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

        var popup_text = '';
        
        var location = data[i].location.replace('(','').replace(')','').split(',');
        
        var lat = location[0];

        var lon = location[1];

        data[i]['marker'] = L.circle([lat,lon], 500)
          .setStyle(style)
          .bindPopup('GREAT POPUP!');

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

    var feature_layer = new L.featureGroup();

    for (var i = 0; i < data.length; i++) {

        data[i].marker.addTo(feature_layer);

    }

    return feature_layer;

}



function is_touch_device() {  //  via https://ctrlq.org/code/19616-detect-touch-screen-javascript
        return (('ontouchstart' in window)
      || (navigator.MaxTouchPoints > 0)
      || (navigator.msMaxTouchPoints > 0));
}














































