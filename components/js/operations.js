
var map;

//  var logfile_url = 'https://data.austintexas.gov/resource/n5kp-f8k4.json?$select=timestamp&$where=event=%27signal_status_update%27%20AND%20response_message%20IS%20NULL&$order=timestamp+DESC&$limit=1'

//  var data_url = 'https://data.austintexas.gov/resource/d7s7-auiw.json';
var data_url = '../components/data/fake_signal_data.json';

var t2 = d3.transition()
                .ease(d3.easeQuad)
                .duration(500);

var default_format = Math.round();

var FORMAT_TYPES = {
    'round': function(val) { return Math.round(val) }
};



//  init tooltips and touch detect
$(document).ready(function(){

    $('[data-toggle="popover"]').popover();

    if (is_touch_device()) {
        
        d3.select('.map')
            .style('margin-right', '10px')
            .style('margin-left', '10px');
    }

    getRequestData(data_url);

});



function main(data){

    makeMap();

    populateTable(data, 'data_table');

    populateInfoStat('signals', 0, 1050, t2, 'round', function(){

        populateInfoStat('phbs', 0, 43, t2, 'round', function(){

            populateInfoStat('cameras', 0, 228, t2, 'round', function(){

                populateInfoStat('sensors', 0, 127, t2, 'round', function(){
                 });

            });

        })

    });

}



function getRequestData(url) {
    $.ajax({
        'async' : false,
        'global' : false,
        'cache' : false,
        'url' : url,
        'dataType' : 'json',
        'success' : function (data) {
            main(data);
        }
    
    }); //end get data

}



function getLogData(url) {
    $.ajax({
        'async' : false,
        'global' : false,
        'cache' : false,
        'url' : url,
        'dataType' : 'json',
        'success' : function (data) {
            postUpdateDate(data, 'info-1');
        }
    
    }); //end get data

}



function makeMap(dataset) {

    L.Icon.Default.imagePath = '../components/images/';

    map = new L.Map('map', {
        center : [30.28, -97.735],
        zoom : 10,
        minZoom : 1,
        maxZoom : 20,
        scrollWheelZoom: false
    });      // make a map

    var Stamen_TonerLite = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
        attribution : 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains : 'abcd',
        maxZoom : 20,
        ext : 'png'
    }).addTo(map);

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




function populateInfoStat(divId, old_value, new_value, transition, format_type, next) {

    if (!format_type) {
        var format_type = 'round';
    }

    d3.select('#' + divId)
        .select('.info_text')
        .text(FORMAT_TYPES[format_type](old_value))
        .transition(transition)
        .tween('text', function () {
            
            var that = d3.select(this);

            var i = d3.interpolate(0, new_value);
            
            return function (t) {
            
                that.text( FORMAT_TYPES[format_type](i(t)) );
            
            }

        })
        .on("end", function(){

            if (next) {
                next();

            } else {
                return '';
            }
        });

}








function defaultFormat(val){
    return Math.round(val);
}



function is_touch_device() {  //  via https://ctrlq.org/code/19616-detect-touch-screen-javascript
        return (('ontouchstart' in window)
      || (navigator.MaxTouchPoints > 0)
      || (navigator.msMaxTouchPoints > 0));
}


