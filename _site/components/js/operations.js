var pizza;

var t_options = {
    ease : d3.easeQuad,
    duration : 500
};

var formats = {
    'round': function(val) { return Math.round(val) }
};

var assets = [
    {
        'name' : 'signals',
        'init_val' : 0,
        'resource_id' : 'p53x-x73x',
        'format' : 'round'
    },
    {
        'name' : 'phbs',
        'init_val' : 0,
        'resource_id' : 'p53x-x73x',
        'format' : 'round'
    },
    {
        'name' : 'cameras',
        'init_val' : 0,
        'resource_id' : 'p53x-x73x',
        'format' : 'round'
    },
    {
        'name' : 'sensors',
        'init_val' : 0,
        'resource_id' : 'p53x-x73x',
        'format' : 'round'
    }
];




var map_options = {
        center : [30.28, -97.735],
        zoom : 10,
        minZoom : 1,
        maxZoom : 20,
        scrollWheelZoom: false
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

    var map = makeMap('map', map_options);

    getAllTheData(assets);

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


function LogIt(one, two){
    console.log(one);
    console.log(two);
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

    console.log(url);

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



function populateTable(dataset, divId) {

    table = $('#' + divId).DataTable({
        data: dataset,
        'bLengthChange': false,
        'bFilter': false,
        columns: [

            { data: 'signal_type' },

            { data: 'location_name' },
            
            { data: 'signal_status' }
            
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




function is_touch_device() {  //  via https://ctrlq.org/code/19616-detect-touch-screen-javascript
        return (('ontouchstart' in window)
      || (navigator.MaxTouchPoints > 0)
      || (navigator.msMaxTouchPoints > 0));
}


