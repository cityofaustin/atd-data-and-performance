var table;

var table_height = '60vh';

var table_cols = ['Name', 'Source', 'Destination', 'Start Date', 'End Date', 'Status', 'Message', 'Records Processed'];
var table_cols_short = ['Start Date', 'End Date', 'Status', 'Message', 'Records Processed'];

var endpoint = 'http://34.201.40.220/jobs_latest';
var endpoint_details = 'http://34.201.40.220/jobs';

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

d3.json(endpoint, function(json){
    main(json);
})


function main(data) {
    
    var cols = createTableCols('data_table', table_cols);
    var cols_modal = createTableCols('modal_table', table_cols_short);
    
    populateTable(data, 'data_table');

    $('#search_input').on( 'keyup', function () {
        table.search( this.value ).draw();
    });

    d3.select('#data_table').selectAll("tr")
        .on("click", function(d) {
            jobDetails(d3.select(this).attr('id'));
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
            rowId : 'name',
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


function populateModalTable(dataset, divId) {

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
            rowId : 'name',
            scrollCollapse : false,
            paging : false,
            "order": [[1, "desc"]],
            columns: [

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


function jobDetails(job_name) {
    
    $('#dashModal').modal('toggle');
    
    var url = endpoint_details + '?name=eq.' + job_name + '&limit=100';
    
    d3.json(url, function(json){
        console.log(json);
        $('#job-name').text(job_name);
        populateModalTable(json, 'modal_table');
    })

    

}



















