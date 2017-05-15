var quote_data

var t_options = {
    ease : d3.easeQuad,
    duration : 500
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
        'resource_id' : 'p53x-x73x',
        'filters' : [{'signal_type' : 'TRAFFIC' }, { '$limit' : '9000' }], 
        'disp_fields' : ['signal_id', 'location_name', 'modified_date' ],
        'infoStat' : true,
        'log_event' : 'signals_update'
    },{
        'name' : 'phbs',
        'init_val' : 0,
        'format' : 'round',
        'resource_id' : 'p53x-x73x',
        'filters' : [{'signal_type' : 'PHB' }, { '$limit' : '9000' } ], 
        'disp_fields' : ['signal_id', 'location_name', 'modified_date' ],
        'infoStat' : true,
        'log_event' : 'signals_update'
    },
    {
        'name' : 'cameras',
        'init_val' : 0,
        'resource_id' : 'b4k4-adkb',
        'format' : 'round',
        'disp_fields' : ['camera_id', 'location_name', 'modified_date' ],
        'infoStat' : true,
        'log_event' : 'cameras_update'
    },
    {
        'name' : 'sensors',
        'resource_id' : '6yd9-yz29',
        'init_val' : 0,
        'format' : 'round',
        'disp_fields' : ['atd_sensor_id', 'location_name', 'modified_date' ],
        'infoStat' : true,
        'log_event' : 'sensors_update'
    }
];


for (var i = 0; i < global_data.length; ++i) {

    if ( 'resource_id' in global_data[i] ) {

        var url = buildSocrataUrl(global_data[i]);

        var name = global_data[i]['name'];

        q.defer(d3.json, url)

    }

}



function main(data) {

    var infos = appendInfoText(data);

    var infos = transitionInfoStat(infos, t_options, 'TURNED_ON' );
    
    var table_data = global_data[0].data.concat(global_data[1].data);

    var table = populateTable(table_data, 'data_table');

    for (var i = 0; i  < global_data.length; i++ ) {

        var divId = global_data[i].name;
        
        var selection = d3.select("#" + divId);

        var event = global_data[i].log_event;

        var resource_id = global_data[i].resource_id;

        postUpdateDate(selection, event, resource_id);
    }

    d3.csv('https://raw.githubusercontent.com/cityofaustin/transportation/gh-pages/components/data/quote_of_the_week.csv', function(error, data) {

        //  http://stackoverflow.com/questions/11488194/how-to-use-d3-min-and-d3-max-within-a-d3-json-command
        var most_recent = d3.entries(data).sort(function(a, b) { return d3.descending(a.quote_date, b.quote_date); })[0]

        var most_recent = most_recent.value;
        
        var quote = d3.select("#quote").text(most_recent.quote);

        var attribution = d3.select("#attribution").text(most_recent.attribution);
    })
}


function buildSocrataUrl(data) {

    var resource_id = data.resource_id;
    
    var url = 'https://data.austintexas.gov/resource/' + resource_id + '.json';

    if (data.filters) {
        
        url = url + '?';

        for (var i = 0; i  < data.filters.length; i++ ) {

            for (filter in data.filters[i]) {

                url = url + filter + '=' + data.filters[i][filter];

                if (i < data.filters.length - 1) {
                    
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

    main(global_data);
    

});





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


function transitionInfoStat(selection, options, filter) {

    var t = d3.transition()
        .ease(options.ease)
        .duration(options.duration);

    selection.transition(t)  //  do this for each selection in sequence
        .tween('text', function () {
            
            var that = d3.select(this);

            var new_data = that.data()[0].data;

            new_data = new_data.filter(function(data){
                return filterByVal(data, filter);
            });

            var i = d3.interpolate(0, new_data.length);
            
            return function (t) {
            
                that.text( formats['round'](i(t)) );  // how to access the format type from the 'this' data?
            
            }

        });

    return selection;

}




function populateTable(dataset, divId, filter_obj) {

    var filtered = dataset.filter(function(row) {
        return row.signal_status == 'DESIGN' ||
          row.signal_status == 'CONSTRUCTION';
    });

    table = $('#' + divId).DataTable({
        data: filtered,
        bPaginate: false,
        scrollCollapse: true,
        bLengthChange: false,
        bFilter: false,
        "order": [[ 1, "desc" ], [2, "asc"]],
        columns: [

            { data: 'location_name' },

            {  data: 'signal_type'  },
            
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



function filterByVal(obj, val) {
    
    return (d3.values(obj).indexOf(val) >= 0);

}



function postUpdateDate(selection, event, resource_id) {

    var data_url = 'https://data.austintexas.gov/resource/' + resource_id;

    var logfile_url = "https://data.austintexas.gov/resource/n5kp-f8k4.json?$query=SELECT * WHERE event='_XXX_' AND (created > 0 OR updated > 0 OR deleted > 0) ORDER BY timestamp DESC LIMIT 1";
    
    logfile_url = logfile_url.replace('_XXX_', event);

    d3.json(logfile_url, function(error, data) {

        var update_date_time = new Date(data[0].timestamp * 1000);

        update_date = readableDate( update_date_time );

        // var update_time = formats.formatTime( update_date_time );

        selection.append('h5')
            .html("Updated " + update_date +
                " | <a href=" + data_url + " target='_blank'> Data <i  class='fa fa-download'></i> </a>"
             );

    });

    return;
}  



function readableDate(date) {

    var update_date = formats.formatDate(date);
    
    var today = formats.formatDate( new Date() );

    if (update_date == today) {
    
        return "today";
    
    } else {
    
        return update_date;
    
    }
}