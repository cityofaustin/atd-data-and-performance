

var t_options = {
    ease : d3.easeQuad,
    duration : 500
};


var formats = {
    'round': function(val) { return Math.round(val) },
    'formatDateTime' : d3.timeFormat("%e %b %-I:%M%p"),
    'formatDate': d3.timeFormat("%x")
};

var global_data = [

      {
        'name' : 'traffic_signals',
        'init_val' : 0,
        'format' : 'round',
        'resource_id' : 'p53x-x73x',
        'filters' : [{'signal_type' : 'TRAFFIC' }, { '$limit' : '9000' }], 
        'disp_fields' : ['atd_signal_id', 'location_name', 'modified_date' ],
        'infoStat' : true
    },{
        'name' : 'phbs',
        'init_val' : 0,
        'format' : 'round',
        'resource_id' : 'p53x-x73x',
        'filters' : [{'signal_type' : 'PHB' }, { '$limit' : '9000' } ], 
        'disp_fields' : ['atd_signal_id', 'location_name', 'modified_date' ],
        'infoStat' : true
    },
    {
        'name' : 'cameras',
        'init_val' : 0,
        'resource_id' : 'b4k4-adkb',
        'format' : 'round',
        'disp_fields' : ['atd_camera_id', 'location_name', 'modified_date' ],
        'infoStat' : true
    },
    {
        'name' : 'sensors',
        'resource_id' : '6yd9-yz29',
        'init_val' : 0,
        'format' : 'round',
        'disp_fields' : ['atd_sensor_id', 'location_name', 'modified_date' ],
        'infoStat' : true
    }
];



//  https://github.com/d3/d3-queue
var q = d3.queue();



for (var i = 0; i < global_data.length; ++i) {

    if ( 'resource_id' in global_data[i] ) {

        var url = buildSocrataUrl(global_data[i]);

        var name = global_data[i]['name'];

        console.log(url);

        q.defer(d3.json, url)

    }

}



function main(data) {

    var infos = appendInfoText(data, { 'signal_status' : 'TURNED_ON' });

    var infos = transitionInfoStat(infos, t_options, 'TURNED_ON' );
    
    var table_data = global_data[0].data.concat(global_data[1].data);

    var table = populateTable(table_data, 'data_table');

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





function appendInfoText(data, filter) {

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
        scrollX: true,
        bPaginate: false,
        scrollCollapse: true,
        bLengthChange: false,
        'bFilter': false,
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


