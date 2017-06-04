var map, data, lines, table;

var geosegment = [
	{
		"type": "Feature",
		"properties": {
			"destination_reader_id": "south_1st_oltorf",
			"origin_reader_id": "south_1st_benwhite",
			"segment_id": "106",
			"segment_name": "Oltorf to Ben White Southbound"
		},
		"geometry": {
			"type": "LineString",
			"coordinates": [
				[-97.76924,30.22688],
				[-97.76681,30.23073],
				[-97.76583,30.23228],
				[-97.76519,30.23333],
				[-97.76479,30.23395],
				[-97.76442,30.23459],	
				[-97.76396,30.23528],
				[-97.76366,30.23575],
				[-97.76295,30.23688],
				[-97.76088,30.24013],
				[-97.75962,30.24211]
			]
		}
	},
	{
		"type": "Feature",
		"properties": {
			"destination_reader_id": "south_1st_oltorf",
			"origin_reader_id": "south_1st_benwhite",
			"segment_id": "107",
			"segment_name": "Oltorf to Ben White Northbound"
		},
		"geometry": {
			"type": "LineString",
			"coordinates": [
				[-97.76922,30.22688],
				[-97.76679,30.23073],
				[-97.76581,30.23228],
				[-97.76517,30.23333],
				[-97.76477,30.23395],
				[-97.76440,30.23459],	
				[-97.76394,30.23528],
				[-97.76364,30.23575],
				[-97.76293,30.23688],
				[-97.76086,30.24013],
				[-97.75960,30.24211]
			]
		}
	}
];


var map_layers = {};

var map_expanded = false;

var collapsed_class = 'col-sm-7';

var expanded_class = 'col-sm-12';

var default_view = true;

var defaultlinestyle = {
		color: '#00ff15',
		weight: 4,
		opacity: .8
	};

var table_height = '40vh';

var current_table_height;

var map_options = {
        center : [30.23459, -97.76442],
        zoom : 14,
        minZoom : 1,
        maxZoom : 20,
        scrollWheelZoom: false
    };
	
	
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
        .addLayer(layers['carto_positron']);

    return map;

}
	
	$(document).ready(function(){

    $('[data-toggle="popover"]').popover();

    if (is_touch_device()) {
        
        d3.select('#map')
            .style('margin-right', '10px')
            .style('margin-left', '10px');
    }

    main();

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

function main(){
    map = makeMap('map', map_options);
	
	var testline = L.geoJson(geosegment,{
		
	});
    testline.addTo(map);
	console.log(testline);

};

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
                map.fitBounds(line_layer.getBounds());
            });            

        console.log(table_div_height);

    }, 200);

}

/*function updateMap(llayer) {  //may need mlayer if we add markers
    if ( map.hasLayer(marker_layer) ) {
        map.removeLayer(marker_layer);
    }

    marker_layer = mlayer

    marker_layer.addTo(map);  

    if ( map.hasLayer(line_layer) ) {
        map.removeLayer(line_layer);
    }

    line_layer = testline

    line_layer.addTo(map);

    map.fitBounds(line_layer.getBounds(), { maxZoom: 16 });    

    map.invalidateSize();

} */

function expandMap(table_div_id, map_div_id) {
    
    d3.select('#' + table_div_id).attr("class", expanded_class + ' full_width');

    d3.select('#' + map_div_id).attr("class", expanded_class + ' full_width');

    d3.select("#map")
                
                .transition(t2)
                .style("height", window.innerHeight + "px")
                .on("end", function() {
                    map.invalidateSize();
                    map.fitBounds(marker_layer.getBounds());
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
            map.fitBounds(marker_layer.getBounds());


        });            ;

    table.draw();

}

//function gettimedata() {
	// function to group sensor data into 15 min bins
var groupeddata = 	d3.csv('../components/data/hack_data.csv', function(err, data) {
    
        mintime_epoch = d3.min(data, function(d){ return d.endtime; } );
        maxtime_epoch = d3.max(data, function(d){ return d.endtime; } );
        mintime = new Date(mintime_epoch * 1000);
        maxtime = new Date(maxtime_epoch * 1000 + timebin);
        
        bins = d3.timeMinute.every(15).range(mintime, maxtime);
        data_grouped = d3.nest()
            .key(function(d) {
                return Math.round(new Date(d.startime * 1000).getTime() / timebin) * timebin;
            })
            .rollup(function(v) { return d3.mean(v, function(q) { return q.traveltime; }); })
            .entries(data);
            
        return data_grouped;
    })
//}

//function style(feature)

