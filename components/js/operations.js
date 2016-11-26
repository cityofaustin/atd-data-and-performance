var t_options = {
    ease : d3.easeQuad,
    duration : 10000
};

var formats = {
    'round': function(val) { return Math.round(val) }
};

var assets = [
    {
        'name' : 'signals',
        'init_val' : 0,
        'resource_id' : 'p53x-x73x',
        'format' : 'round',
        'data' : 1050 //  use empty str and populate later
    },
    {
        'name' : 'phbs',
        'init_val' : 0,
        'resource_id' : 'p53x-x73x',
        'format' : 'round',
        'data' : 43
    },
    {
        'name' : 'cameras',
        'init_val' : 0,
        'resource_id' : 'p53x-x73x',
        'format' : 'round',
        'data' : 228
    },
    {
        'name' : 'sensors',
        'init_val' : 0,
        'resource_id' : 'p53x-x73x',
        'format' : 'round',
        'data' : 127
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

    //  getOpenData(signals_id);

    var map = makeMap('map', map_options);

    var infos = appendInfoText(assets);

    transitionInfoStat(infos, t_options);

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



function getOpenData(resource_id) {

    //  var url = 'https://data.austintexas.gov/resource/' + resource_id + '.json';
    
    var url = '../components/data/fake_signal_data.json';

    $.ajax({
        'async' : false,
        'global' : false,
        'cache' : false,
        'url' : url,
        'dataType' : 'json',
        'success' : function (data) {
            main(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log(textStatus, errorThrown);
        }

    }); //end get data

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
            
            { data: 'status' },

            { data: 'updated' }
            
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

            var new_value = that.data()[0].data;
            
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


