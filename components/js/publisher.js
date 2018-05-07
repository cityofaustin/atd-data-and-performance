var table;

var table_height = '60vh';

var table_cols = ['Name', 'Source', 'Destination', 'Start Date', 'End Date', 'Status', 'Message', 'Records Processed'];

var status_types = {
    'error' : {
        'icon' : 'exclamation-triangle',
        'display_name' : '    Error    '
    },
    'in_progress' : {
        'icon' : 'clock-o',
        'display_name' : 'In Progress'
    },
    'success' : {
        'icon' : 'check-circle',
        'display_name' : '  Success  '
    }
}


var global_data = [
      {
        'name' : 'traffic_signals',
        'init_val' : 0,
        'format' : 'round',
        'resource_id' : 'xwqn-2f78',
        'params' : [
            { '$limit' : '9000' },
            { '$where' : 'signal_status in ("DESIGN", "CONSTRUCTION", "TURNED_ON")'}
        ], 
        'disp_fields' : ['signal_id', 'location_name', 'modified_date' ],
        'infoStat' : true,
        'log_event' : 'signals_update'
    }
];

var formatDate = d3.timeFormat("%c");

d3.json('http://34.201.40.220/jobs_latest', function(json){
    main(json);
})


function main(data) {
    
    var cols = createTableCols('data_table', table_cols);
    
    populateTable(data, 'data_table');

    $('#search_input').on( 'keyup', function () {
        table.search( this.value ).draw();
    });

}


function populateTable(dataset, divId) {

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

        })

        .DataTable({
            data: dataset,
            rowId : 'id',
            scrollY : table_height,
            scrollCollapse : false,
            bInfo : true,
            paging : false,
            autoWidth: true,
            "order": [[3, "desc"]],
            columns: [

            { data: 'name' },
            { data: 'source' },
            { data: 'destination' },
            { 
                data: 'start_date',

                defaultContent: '',

                "render": function ( data, type, full, meta ) {
                    return formatDate(new Date(Date.parse(data)));
                },

            },
            { 
                data: 'end_date',

                defaultContent: '',

                "render": function ( data, type, full, meta ) {
                    if (data) {
                        return formatDate(new Date(Date.parse(data)));    
                    } else {
                        return '';
                    }
                    
                },

            },

            { 
                data: 'status',
                 "render": function ( data, type, full, meta ) {
                    var icon = status_types[data].icon;
                    return "<span class='status-badge status-" + data.toLowerCase() + "'>" +
                    "<i class='fa fa-" + icon + "'></i>  " +
                     status_types[data].display_name + "</span>";
                }
            },
            { data: 'message' },
            { data: 'records_processed' }
            
        ]
    })

    d3.select("#data_table_filter").remove();

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