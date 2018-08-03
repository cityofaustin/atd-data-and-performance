
var map, feature_layer, table, curr_breakpoint, marker;

var init = true;
var show_modal = false;

var table_height = '60vh';

var table_cols = ['Location', 'Type', 'Status', 'Note'];

var map_selector_types = [
    { 
        'name' : 'CONSTRUCTION',
        'display_name' : "<i class='fa fa-wrench'></i> Construction",
     },
    { 
        'name' : 'DESIGN',
        'display_name' : "<i class='fa fa-pencil'></i> Design",
     },
     { 
        'name' : 'TURNED_ON',
        'display_name' : "<i class='fa fa-car'></i> Turned On",
     }
];

var map_options = {
        center : [30.28, -97.74],
        zoom : 12,
        minZoom : 1,
        maxZoom : 20,
        zoomControl : false
};

var default_style = { 
    'CONSTRUCTION' : {
        color: '#fff',
        weight: 1,
        fillColor: '#ed9f1c',
        fillOpacity: .8,
        icon : 'wrench'
    },
    'DESIGN' : {
        color: '#fff',
        weight: 1,
        fillColor: '#7570b3',
        fillOpacity: .8,
        icon : 'pencil'  
    },
    'TURNED_ON' : {
        color: '#fff',
        weight: 1,
        fillColor: '#6b6b6b',
        fillOpacity: .8,
        icon : 'car'  
    }
}


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

var formats = {
    'round': function(val) { return Math.round(val) },
    'formatDateTime' : d3.timeFormat("%e %b %-I:%M%p"),
    'formatDate' : d3.timeFormat("%x"),
    'formatTime' : d3.timeFormat("%I:%M %p")
};

var q = d3.queue();

var global_data = [
      {
        'name' : 'traffic_signals',
        'init_val' : 0,
        'format' : 'round',
        'resource_id' : 'xwqn-2f78',
        'params' : [
            { '$select' : 'modified_date, atd_location_id, signal_type, signal_id, signal_status, location_name, construction_note, construction_note_date, location_latitude, location_longitude'},
            { '$limit' : '9000' },
            { '$where' : 'signal_status in ("DESIGN", "CONSTRUCTION", "TURNED_ON")'}
        ], 
        'disp_fields' : ['signal_id', 'location_name', 'construction_note','construction_note_date' ],
        'infoStat' : true,
        'log_event' : 'signals_update'
    }
];


for (var i = 0; i < global_data.length; ++i) {

    if ( 'resource_id' in global_data[i] ) {

        var url = buildSocrataUrl(global_data[i]);

        var name = global_data[i]['name'];

        q.defer(d3.json, url)

    }

}

$('#dashModal').on('shown.bs.modal', function () {
  map.invalidateSize();
});

function main() {
    
    var cols = createTableCols('data_table', table_cols);
    
    var map_selectors = createMapSelectors('map_selectors', map_selector_types, 'display_name');

    map = makeMap('map', map_options);
    
    global_data[0].data = createMarkers(global_data[0].data);

    var filters = checkFilters();
    
    var filtered_data = filterByStatus(global_data[0].data, filters);

    populateTable(filtered_data, 'data_table');

    $('#search_input').on( 'keyup', function () {
        table.search( this.value ).draw();
    });

    map.on('zoomend', function() {
        setMarkerSizes(global_data[0].data);
    });

    $(".btn-map-selector").on('click', function() {

        if ( $(this).hasClass('active') ) {
            $(this).removeClass('active').attr('aria-pressed', false);
        } else {
            $(this).addClass('active').attr('aria-pressed', true)
        }

        filterChange();
    })

    resizedw();

        //  https://stackoverflow.com/questions/5489946/jquery-how-to-wait-for-the-end-of-resize-event-and-only-then-perform-an-ac
    var resize_timer;
    window.onresize = function(){
      clearTimeout(resize_timer);
      resize_timer = setTimeout(resizedw, 100);
    };

    init = false;
}


function buildSocrataUrl(data) {

    var resource_id = data.resource_id;
    
    var url = 'https://data.austintexas.gov/resource/' + resource_id + '.json';

    if (data.params) {
        
        url = url + '?';

        for (var i = 0; i  < data.params.length; i++ ) {

            for (param in data.params[i]) {

                url = url + param + '=' + data.params[i][param];

                if (i < data.params.length - 1) {
                    
                    url = url + '&';

                }
            }
        }

    }


    return url;
}


q.awaitAll(function(error) {

    if (error) throw error;

    for ( var i = 0; i < arguments[1].length; i++ ) {

        global_data[i].data = arguments[1][i];

    }

    main();
    

});



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

    var zoomHome = L.Control.zoomHome();
    zoomHome.addTo(map);

    default_bounds = map.getBounds();
    
    return map;

}


function populateTable(dataset, divId, filter_obj) {

    if ( $('#' + divId) ) {

        $('#' + divId).dataTable().fnDestroy();

    }

    table = $('#' + divId)
        //  update map after table search
        .on( 'draw.dt', function () {
                
            var ids = [];

            $('.tableRow').each(function(i, obj) {
                ids.push(obj.id);
            });

            var marker_layer = getMarkers(dataset, ids);    
            
            updateMap(marker_layer);

        })

        .DataTable({
            data: dataset,
            rowId : 'atd_location_id',
            scrollY : table_height,
            scrollCollapse : false,
            bInfo : true,
            paging : false,
            autoWidth: true,
            "order": [[2, "asc"], [3, "desc"] ],
            columns: [

            { data: 'location_name',
                "render": function ( data, type, full, meta ) {

                    if ('atd_location_id' in full) {
                        return "<a class='tableRow' id='$" + full.atd_location_id + "' '>" + data + "</a>";
                    } else {
                        return '';
                    }
                }
            },


            {  data: 'signal_type'  },
            
           
            { 
                data: 'signal_status', 
                "render": function ( data, type, full, meta ) {
                    var icon = default_style[data].icon;
                    return "<span class='status-badge status-" + data.toLowerCase() + "'>" +
                    "<i class='fa fa-" + icon + "'></i> " +
                     data + "</span>";
                }
            },

            { 
                data: 'construction_note', 
                defaultContent: '',
                "render": function ( data, type, full, meta ) {
                    if (data) {
                        return '<i>' + data + '</i>';
                    } else {
                        return '';
                    }
                }
            }
            
        ]
    })

    d3.select("#data_table_filter").remove();

    createTableListeners();
}


function createTableCols(div_id, col_array) {

    var cols = d3.select('#' + div_id).select('thead')
        .append('tr')
        .selectAll('th')
        .data(col_array)
        .enter()
        .append('th')
        .text(function(d) {
            return d;
        });

    return cols;
        
}



function createMapSelectors(div_id, obj_arr, display_property, icon_name) {

    var selectors = d3.select("#" + div_id)
        .selectAll('div')
        .data(obj_arr)
        .enter()
        .append('div')
        .attr('class', 'col-sm')
        .append('btn')
        .attr('type', 'button')
        .attr('data_id', function(d){
            return d.name;
        })
        .attr('class', 'btn btn-block btn-primary btn-map-selector')
        .attr('aria-pressed', function(d, i) {
            // class first two buttons as 'active'
            if (i <= 1) {
                return true;
            }
            else {
                return false;
            }
        })
        .classed('active', function(d, i) {
            // class first two buttons as 'active'
            if (i <= 1) {
                return true;
            }
            else {
                return false;
            }
        })
        .html(function(d){
            return d[display_property];
        });

    return selectors;
    
}




function createMarkers(data, style) {
    //  create markers and layers for each device type


    for (var i = 0; i < data.length; i++) {
        
        if (!data[i].location_latitude) {
            continue;
        }
        var status = data[i].signal_status;
        
        var marker_style = default_style[status];

        var location_name = data[i].location_name;

        var lat = data[i].location_latitude;
        
        var lon = data[i].location_longitude;
         
        var updated = formats.formatDate( new Date(data[i].construction_note_date) )

        var const_note = data[i].construction_note;

        if (const_note) {

            const_note = '<i>' + const_note + '</i><br>';
        } else {
            const_note = '';
        }
        
        var icon = default_style[status].icon;

        var popup_text ='<h6>' + location_name + '</h6>' + 
        const_note + 
        '<b> Updated: <b>' +
        updated + "</br></br><span class='status-badge status-" + status.toLowerCase() + "'>" +
        "<i class='fa fa-" + icon + "'></i> " +
         status + "</span>" 

        data[i]['marker'] = L.circle([lat,lon], 500)
            .bindPopup(popup_text)
            .setStyle(marker_style)

    }
    
    return data;

}



function checkFilters(){

    filters = [];

    $('btn.active').not(':hidden').each(function() {
        filters.push( $(this).attr('data_id'));
    });

    return Array.from(new Set(filters)); //  remove duplicates, which may arise from having 'hidden' filters based on display invalidateSize

}


function filterByStatus(data, filters) {

    var filtered = data.filter(function(row) {

        return filters.indexOf(row.signal_status) >= 0;
    });

    return filtered;
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

    adjustView(layer);    

}


function adjustView(layer) {

    if (init) {
        //  override wonky bounds-fitting on init (probably a race condition);
        layer = undefined;
    }

    setMarkerSizes(global_data[0].data);

    if (layer) {
        var bounds = layer.getBounds()
    } else {
        var bounds = {};
    }

    if (Object.keys(bounds).length === 0 && bounds.constructor === Object) {
        //  http://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object
        //  empty bounds
        map.setView(map_options.center, map_options.zoom);

    } else {
        console.log(bounds)
        map.fitBounds(bounds, { maxZoom: 16 });    
    }

    map.invalidateSize();

}


function setMarkerSizes(data) {

    var zoom = map.getZoom();
    for (var i = 0; i < data.length; i++){
        data[i].marker.setRadius(SCALE_THRESHOLDS["$"+ zoom]);
    }

}



function createTableListeners() {

    d3.selectAll('tr')
        .on('click', function(d){
            $('#modal-popup-container').remove();
            var marker_id = d3.select(this).attr('id');
            zoomToMarker(marker_id, global_data[0].data);
    });

}


function zoomToMarker(marker_id, data) {
    
    for (var i = 0; i < data.length; i++ ) {
    
        if (data[i].atd_location_id == marker_id ) {
            
            marker = data[i].marker;

            map.setView(marker._latlng, 16);

            map.invalidateSize();


            if (show_modal) {
                
                var popup = data[i].marker._popup._content;
                $('#modal-content-container').append("<div id='modal-popup-container'>" + popup + "</div>");
                $('#dashModal').modal('toggle');

            } else {

                marker.openPopup();
                    
            }

        }
    }
}



function resizedw(){
    
    prev_breakpoint = curr_breakpoint;
    curr_breakpoint = breakpoint();
    

    if (curr_breakpoint != prev_breakpoint) {
        
        if (curr_breakpoint === 'xs' || curr_breakpoint === 'sm' || curr_breakpoint === 'md') {
            //  define which columns are hidden on mobile
            table.column( 1 ).visible(false)
            table.column( 3 ).visible(false)
            
            if (!show_modal) {
                //  copy map to modal
                $('#data-row-1').find('#map').appendTo('#modal-content-container');
                show_modal = true;
            }

        } else {

            table.column( 1 ).visible(true)
            table.column( 3 ).visible(true)

            if (show_modal ) {
                $('#modal-content-container').find('#map').appendTo('#data-row-1');
                
                show_modal = false;
            }
        }
    }

    table.columns.adjust();
}
                

function filterChange() {
    var filters = checkFilters();
    var data = filterByStatus(global_data[0].data, filters);
    populateTable(data, 'data_table');
        
}