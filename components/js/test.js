var table_height = '60hv';

var q = d3.queue();

var device_data = [
    {
        'name' : 'traffic_signal',
        'display_name' : 'Signal',
        'resource_id' : 'xwqn-2f78',
        'id_field' : 'signal_id',
        'query' : 'select * where control in ("PRIMARY") and signal_status in ("TURNED_ON") limit 10000'
    }
];


var map_options = {
        center : [30.27, -97.74],
        zoom : 13,
        minZoom : 1,
        maxZoom : 20
};



 
$(document).ready(function(){

    for (var i = 0; i < device_data.length; ++i) {

        if ( 'resource_id' in device_data[i] ) {

            var url = buildSocrataUrl(device_data[i]);

            var name = device_data[i]['name'];

            q.defer(d3.json, url)

        }

    }

    q.awaitAll(function(error) {

        if (error) throw error;

        for ( var i = 0; i < arguments[1].length; i++ ) {
            device_data[i].data = arguments[1][i];

        }

        main(device_data);

    });

});


function main(dataset) {
    
    var table = populateTable(dataset[0].data, 'data_table', true)    
    var map = makeMap('map', map_options);
    
    map.invalidateSize();

    console.log(dataset[0]);
    
    

}


function buildSocrataUrl(data) {

    var resource_id = data.resource_id;
    
    var url = 'https://data.austintexas.gov/resource/' + resource_id + '.json';

    if (data.query) {

        url = url + '?$query=' + data.query;

    }
    
    return url;
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



function populateTable(data, divId) {

    var table = $('#data_table')
        .DataTable({
            data : data,
            scrollY: '50vh',
            scrollCollapse: true,
            // scrollCollapse : false,  //  necessary for non-wonky table scrolling when height is fixed
            bInfo : true,
            paging : false,
            // autoWidth: false,
            columns: [
                { data: 'location_name' },
                { data: 'ip_comm_status' },
                { data: 'signal_type' }
            ]
        });
    
    d3.select("#data_table_filter").remove();  //  remove default datatables search input

    return table;
}
