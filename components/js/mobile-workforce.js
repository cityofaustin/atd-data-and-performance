var map;

var search_radius = 500 //  meters

var datasets = {
    'signals' : 'p53x-x73x'
}

var map_options = {
        center : [30.28, -97.735],
        zoom : 10,
        minZoom : 1,
        maxZoom : 20,
        scrollWheelZoom: true
    };

var asset_layer = new L.featureGroup();

var signal_marker = new L.ExtraMarkers.icon({
    icon: 'fa-car',
    markerColor: 'red',
    shape: 'circle',
    prefix: 'fa'
});


$(document).ready(function(){
    
    main();

});

function main(){

    setMapHeight('dash-top-nav-container', 'map')

    map = makeMap('map', map_options);
    
    var location;

    map.locate({setView: true, maxZoom: 18});

    map.on('locationerror', onLocationError);

    var query = map.on('locationfound', onLocationFound);

    function onLocationError(e) {
        alert(e.message);
    }

    function onLocationFound(e) {
        var radius = e.accuracy / 2;
        L.marker(e.latlng).addTo(map);
        L.circle(e.latlng, radius).addTo(map);

        var query = build_query(datasets.signals, e.latitude, e.longitude, search_radius)

        getData(query);

    }
    
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



function build_query(resource, lat, lon, radius) {

    return 'https://data.austintexas.gov/resource/' + resource + '.json?$where=within_circle(location, ' + lat + ', ' + lon + ', ' + radius + ')';

}


function setMapHeight(navId, mapId) {
    // set height of map to full screen minus height of top namv
    var window_height = document.documentElement.clientHeight;
    var client_height = document.getElementById(navId).clientHeight;
    var map_height = window_height - client_height - 15;
    document.getElementById('map').setAttribute("style","height:" + map_height + "px");
}




function getData(url) {
    $.ajax({
        'async' : false,
        'global' : false,
        'cache' : false,
        'url' : url,
        'dataType' : "json",
        'success' : function (data) {
            makeMarkers(data);
        }
    
    }); //end get data

}



function makeMarkers(data) {
    console.log(data);
    
    if (data.length > 0) {
        
        for (var i = 0; i < data.length; i++) {   
            
            if(data[i].location_latitude > 0) {

                var lat = data[i].location_latitude;
        
                var lon = data[i].location_longitude;

                var location_name = data[i].location_name;

                
                var marker = L.marker([lat,lon], {
                        icon:  signal_marker
                    });
                
                marker.bindPopup(
                        "<b>" + location_name + "</b>"
                    )
                
                console.log(marker);
                marker.addTo(asset_layer);

            }

        }
        console.log(asset_layer);
        asset_layer.addTo(map);

    }

}





