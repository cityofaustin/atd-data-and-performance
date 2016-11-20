var pizza;

var map;


var logfile_url = 'https://data.austintexas.gov/resource/n5kp-f8k4.json?$select=timestamp&$where=event=%27signal_status_update%27%20AND%20response_message%20IS%20NULL&$order=timestamp+DESC&$limit=1'

//  var data_url = 'https://data.austintexas.gov/resource/d7s7-auiw.json';
var data_url = '../components/data/fake_signal_data.json';


//  init tooltips and touch detect
$(document).ready(function(){

    $('[data-toggle="popover"]').popover();

    if (is_touch_device()) {
        
        d3.select('.map')
            .style("margin-right", "10px")
            .style("margin-left", "10px");
    }

    getRequestData(data_url);

});



function main(data){

    pizza = data;

    makeMap();

    populateTable(data);
    // populateInfoStat(data, "info-1", function(){

        //  infostat callback

    //});


};




function getRequestData(url) {
    $.ajax({
        'async' : false,
        'global' : false,
        'cache' : false,
        'url' : url,
        'dataType' : "json",
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
        'dataType' : "json",
        'success' : function (data) {
            postUpdateDate(data, "info-1");
        }
    
    }); //end get data

}



function is_touch_device() {  //  via https://ctrlq.org/code/19616-detect-touch-screen-javascript
        return (('ontouchstart' in window)
      || (navigator.MaxTouchPoints > 0)
      || (navigator.msMaxTouchPoints > 0));
}




function makeMap(dataset) {

    L.Icon.Default.imagePath = '../components/images/';

    map = new L.Map("map", {
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


function populateTable(dataset) {

    table = $('#data_table').DataTable({
        data: dataset,
        "bLengthChange": false,
        "bFilter": false,
        columns: [

            { data: 'signal_type' },

            { data: 'location_name' },
            
            { data: 'status' },

            { data: 'updated' }
            
        ]
    })
}



