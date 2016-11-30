var pizza;

var map;

var t_options = {
    ease : d3.easeQuad,
    duration : 500
};

var formats = {
    'round': function(val) { return Math.round(val) },
    'formatDateTime' : d3.timeFormat("%e %b %-I:%M%p"),
    'formatDate': d3.timeFormat("%x")
};

var assets = [
    {
        'name' : 'signals',
        'init_val' : 0,
        'resource_id' : 'p53x-x73x',
        'format' : 'round',
        'disp_fields' : ['atd_signal_id', 'location_name', 'modified_date' ]   
    },
    {
        'name' : 'phbs',
        'init_val' : 0,
        'resource_id' : 'p53x-x73x',
        'format' : 'round',
        'disp_fields' : ['atd_signal_id', 'location_name', 'modified_date' ]  
    },
    {
        'name' : 'cameras',
        'init_val' : 0,
        'resource_id' : 'p53x-x73x',
        'format' : 'round',
        'disp_fields' : ['atd_signal_id', 'location_name', 'modified_date' ]   
    },
    {
        'name' : 'sensors',
        'init_val' : 0,
        'resource_id' : 'p53x-x73x',
        'format' : 'round',
        'disp_fields' : ['atd_signal_id', 'location_name', 'modified_date' ]   
    }
];


var map_layers = {};

var map_markers = []

var visible_layers = new L.featureGroup();


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
        
        d3.select('.map')
            .style('margin-right', '10px')
            .style('margin-left', '10px');
    }

    main();

});



function main(){

    getAllTheData(assets);

    map = makeMap('map', map_options);

    for (var i = 0; i < assets.length; i++) {
        
        createMapLayer(assets[i]);

    } 

    var infos = appendInfoText(assets);

    transitionInfoStat(infos, t_options);

    var table = populateTable(assets[0].data, 'data_table');

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



function getAllTheData(config_array) {

    for (var i = 0; i < config_array.length; i++) {

            config_array[i].data = getOpenData(config_array[i].resource_id);
            
    }

    return;

}



function getOpenData(resource_id, options) {

    if (options != undefined) {
        if (!('filter' in options)) {
            
            options.filter = '';
            
        }
    } else {

        options = {};
        options.filter = ''

    }

    var url = 'https://data.austintexas.gov/resource/' + resource_id + '.json?$limit=2000' + options.filter;

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

    var selection = d3.selectAll('.info')
        .data(data)
        .append('text')
        .text(function(d) {
            return d.init_val;
        });

    return selection;

}



function populateTable(dataset, divId, filter_obj) {

    dataset = dataset.filter(function(row) {
        return row.signal_status == 'DESIGN' ||
          row.signal_status == 'CONSTRUCTION';
    });

    

    if (filter_obj) {

        //  filter dynamically!

    }

    table = $('#' + divId).DataTable({
        data: dataset,
        'bLengthChange': false,
        'bFilter': false,
        "autoWidth": false,
        columns: [

            { data: 'location_name' },

            { data: 'signal_type' },
            
            { data: 'signal_status' },

            { 
                data: 'modified_date',

                defaultContent: '',

                "render": function ( data, type, full, meta ) {
                    return formats.formatDate( new Date(data) );
                },

            }
            
        ]
    })
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



function createMapLayer(config_obj) {

    map_layers[config_obj.name] = new L.featureGroup();

    var data = config_obj.data;

    pizza = data;

    var zoom = map.getZoom();

      for (var i = 0; i < data.length; i++) {   

        var popup_text = '';

        var lat = data[i].location.latitude;

        var lon = data[i].location.longitude;

        for (var q = 0; q < config_obj.disp_fields.length; q++) {

            popup_text = popup_text + data[i][config_obj.disp_fields[q]] + '<br>';

        }

        var marker = L.circle([lat,lon], SCALE_THRESHOLDS['$' + zoom])
        .bindPopup(popup_text);
            
        marker.addTo(map_layers[config_obj.name]);

        map_markers.push(marker);

   }

}




function is_touch_device() {  //  via https://ctrlq.org/code/19616-detect-touch-screen-javascript
        return (('ontouchstart' in window)
      || (navigator.MaxTouchPoints > 0)
      || (navigator.msMaxTouchPoints > 0));
}


