
//  all config objects must pass through q or data will be assigned to wrong objects

var t_options = {
    ease : d3.easeQuad,
    duration : 500
};

var today = new Date();
var month = today.getMonth();
var year = today.getFullYear();
var fiscal_year = year;


if (month > 8) {  // if month is later than september
    fiscal_year = year + 1;
}

var formats = {
    'round': function(val) { return Math.round(val) },
    'formatDateTime' : d3.timeFormat("%e %b %-I:%M%p"),
    'formatDate' : d3.timeFormat("%x"),
    'formatTime' : d3.timeFormat("%I:%M %p"),
    'thousands' : d3.format(",")
};

var pub_log_id = 'i9se-t8hz';

var q = d3.queue();

var config = [

    {
        'id' : 'traffic_signals',
        'row_container_id' : 'panel-row-1',
        'display_name' : 'Traffic Signals',
        'icon' : 'car',
        'init_val' : 0,
        'format' : 'round',
        'infoStat' : true,
        'caption' : 'Total traffic signals maintained by the City of Austin',
        'query' : 'SELECT COUNT(signal_type) as count WHERE signal_type IN ("TRAFFIC") AND signal_status IN ("TURNED_ON") limit 9000',
        'resource_id' : 'xwqn-2f78',
        'data_transform' : function(x) { return( [x[0]['count']] )},
        'update_event' : 'signals_update'
    },
    {
        'id' : 'phbs',
        'row_container_id' : 'panel-row-1',
        'display_name' : 'Pedestrian Beacons',
        'icon' : 'male',
        'init_val' : 0,
        'format' : 'round',
        'infoStat' : true,
        'caption' : 'Total pedestrian beacons maintained by the City of Austin',
        'query' : 'SELECT COUNT(signal_type) as count WHERE signal_type IN ("PHB") AND signal_status IN ("TURNED_ON") limit 9000',
        'resource_id' : 'xwqn-2f78',
        'data_transform' : function(x) { return( [x[0]['count']] )},
        'update_event' : 'signals_update'
    },
    {
        'id' : 'cameras',
        'row_container_id' : 'panel-row-1',
        'display_name' : 'CCTV',
        'icon' : 'video-camera',
        'init_val' : 0,
        'format' : 'round',
        'infoStat' : true,
        'caption' : 'Total traffic cameras maintained by the City of Austin.',
        'query' : 'SELECT COUNT(camera_status) as count where upper(camera_mfg) not in ("GRIDSMART") and camera_status in ("TURNED_ON")',
        'resource_id' : 'fs3c-45ge',
        'data_transform' : function(x) { return( [x[0]['count']] )},
        'update_event' : 'cameras_update'
    },
    {
        'id' : 'sensors',
        'row_container_id' : 'panel-row-1',
        'display_name' : 'Travel Sensors',
        'icon' : 'rss',
        'init_val' : 0,
        'format' : 'round',
        'data' : [145],
        'infoStat' : true,
        'caption' : 'Total travel sensors maintained by the City of Austin',
        'query' : 'SELECT COUNT(sensor_type) as count WHERE sensor_status in ("TURNED_ON")',
        'resource_id' : 'wakh-bdjq',
        'data_transform' : function(x) { return( [x[0]['count']] )},
        'update_event' : 'travel_sensors_update'
    },
    {
        'id' : 'signals-on-flash',
        'row_container_id' : 'panel-row-3',
        'display_name' : 'Signals on Flash',
        'icon' : 'exclamation-triangle',
        'init_val' : 0,
        'format' : 'round',
        'data' : [0],
        'infoStat' : true,
        'caption' : "Traffic signals current flashing, as reported by the City of Austin's Advanced Traffic Management System",
        'query' : "select COUNT(signal_id) as count where operation_state='2'",
        'resource_id' : '5zpr-dehc',
        'data_transform' : function(x) { return( [x[0]['count']] )},
        'update_event' : 'signal_status_update'
    },
    {
        'id' : 'signals-comm-issue',
        'row_container_id' : 'panel-row-3',
        'display_name' : 'Communication Outage',
        'icon' : 'phone',
        'init_val' : 0,
        'format' : 'round',
        'data' : [0],
        'infoStat' : true,
        'caption' : "Traffic signals with communication outage, as reported by the City of Austin's Advanced Traffic Management System",
        'query' : "select COUNT(signal_id) as count where operation_state='3'",
        'resource_id' : '5zpr-dehc',
        'data_transform' : function(x) { return( [x[0]['count']] )},
        'update_event' : 'signal_status_update'
    },
    {
        'id' : 'signal-timing',
        'row_container_id' : 'panel-row-2',
        'display_name' : 'Signals Re-Timed',
        'icon' : 'clock-o',
        'init_val' : 0,
        'format' : 'round',
        'infoStat' : true,
        'caption' : 'Traffic signals retimied this fiscal year',
        'query' : 'SELECT SUM(signal_count) as count WHERE retime_status IN ("COMPLETED") and scheduled_fy in ("' + fiscal_year + '")',
        'resource_id' : 'ufnm-yzxy',
        'data_transform' : function(x) { 
            var obj = x[0];
            if (!Object.keys(obj).length === 0) {
                return [obj['count']];
            } else {
                return [0];
            }  
        },
        'update_event' : 'signal_retiming_update',
        'data' : []
    },
    {
        'id' : 'prev_maint',
        'row_container_id' : 'panel-row-2',
        'display_name' : 'Preventative Maintenance',
        'icon' : 'medkit',
        'init_val' : 0,
        'format' : 'round',
        'infoStat' : true,
        'caption' : 'Signals that have received preventative maintenance this fiscal year.',
        'query' : 'SELECT COUNT(signal_pm_max_fiscal_year) as count WHERE signal_pm_max_fiscal_year IN ("' + fiscal_year + '")',
        'resource_id' : 'xwqn-2f78',
        'data_transform' : function(x) { 
            console.log(fiscal_year);
            return( [x[0]['count']] )
        },
        'update_event' : 'signals_update'
    },
    {
        'id' : 'signal_construction',
        'row_container_id' : 'panel-row-3',
        'display_name' : 'Under Construction',
        'icon' : 'wrench',
        'init_val' : 0,
        'format' : 'round',
        'infoStat' : true,
        'caption' : 'Signals that are currently being constructed',
        'query' : 'SELECT COUNT(signal_status) as count WHERE signal_status IN ("CONSTRUCTION")',
        'resource_id' : 'xwqn-2f78',
        'data_transform' : function(x) { return( [x[0]['count']] )},
        'update_event' : 'signals_update'
    }, 
    {
        'id' : 'gridsmart',
        'row_container_id' : 'panel-row-1',
        'display_name' : 'Gridsmart',
        'icon' : 'crosshairs',
        'init_val' : 0,
        'format' : 'round',
        'infoStat' : true,
        'caption' : 'Gridsmart detection cameras installed',
        'query' : 'select count(detector_id) as count where upper(detector_type) in ("GRIDSMART")',
        'resource_id' : 'sqwb-zh93',
        'data_transform' : function(x) { return( [x[0]['count']] )},
        'update_event' : 'detectors_update'
    }
    // {
    //     'id' : 'school-beacons',
    //     'row_container_id' : 'panel-row-1',
    //     'display_name' : 'School Beacons',
    //     'icon' : 'bus',
    //     'init_val' : 0,
    //     'format' : 'round',
    //     'data' : [537],
    //     'infoStat' : true,
    //     'caption' : '',
    //     'update_event' : undefined
    // }
    // {
    //     'id' : 'bcycle-trips',
    //     'display_name' : 'B-Cycle Trips',
    //     'icon' : 'bicycle',
    //     'init_val' : 0,
    //     'format' : 'round',
    //     'infoStat' : true,
    //     'resource_id' : 'cwi3-ckqi',
    //     'caption' : '',
    //     'query' : function(){
    //         var d = new Date();
    //         var n = d.getMonth();  //  last month's data
    //         var y = d.getFullYear().toString();
    //         var monthyear = n.toString() + y; 
    //         return 'select count(*), month||year as monthyear where monthyear in ("' + monthyear + '") group by monthyear'
    //     }(),
    //     'data_transform' : function(x) { return x[0]['count'] },
    //     'update_event' : undefined
    // }
];



$(document).ready(function(){

    for (var i = 0; i < config.length; ++i) {

        if ( 'resource_id' in config[i] ) {

            var url = buildSocrataUrl(config[i]);

            var id = config[i].id;

            q.defer(d3.json, url)

        }

    }


    q.awaitAll(function(error) {

        if (error) throw error;

        for ( var i = 0; i < arguments[1].length; i++ ) {
            
            if ('data_transform' in config[i]) {
                
                // console.log(Object.keys(data).length === 0 && data.constructor === Object);
                
                config[i].data = config[i].data_transform( arguments[1][i] );    
            } else {
                config[i].data = arguments[1][i];
            }
        }

        main(config);

    });
});



function buildSocrataUrl(data) {

    var resource_id = data.resource_id;
    
    var url = 'https://data.austintexas.gov/resource/' + resource_id + '.json';

    if (data.query) {

        url = url + '?$query=' + data.query;

    }
    
    return url;
}



function main(data) {

    for (var i = 0; i < config.length; ++i) {

        config[i].panel = createPanel(config[i].row_container_id, config[i].id, config[i].icon, config[i].display_name, config[i])

    }

    var panels = appendInfoText(data);

    var panels = transitionInfoStat(panels, t_options, 'TURNED_ON' );

    for (var i = 0; i  < config.length; i++ ) {

        var divId = config[i].id;
        
        var selection = d3.select("#" + divId);

        var event = config[i].update_event;

        postUpdateDate(selection, pub_log_id, event);

    }
 
}



function appendInfoText(data) {

    d3.selectAll('.loading').remove();

    var panel_content = d3.selectAll('.dash-panel')
        .append('div')
        .attr('class', 'row')
        .append('div')
        .attr('class', 'col')

    panel_content.append('text')
        .attr('class', 'info-metric-small')
        .text(function(d) {
            return d.init_val;
        });

    d3.selectAll('.dash-panel')
        .attr('data-container', 'body')
        .attr('data-trigger', 'hover')
        .attr('data-toggle', 'popover')
        .attr('data-placement', 'top')
        .attr('data-content', function(d) {
            return d.caption;
        });

    $('[data-toggle="popover"]').popover();

    return d3.selectAll('.dash-panel');

}   


function transitionInfoStat(selection, options) {

    var t = d3.transition()
        .ease(options.ease)
        .duration(options.duration);

    selection.selectAll('.info-metric-small')
        .transition(t)  //  do this for each selection in sequence
        .tween('text', function () {
            
            var that = d3.select(this);

            var new_data = that.data()[0].data;
            
            var format = that.data()[0].format;

            var i = d3.interpolate(0, new_data[0]);
            
            return function (t) {
            
                that.text( formats[format](i(t)) );  // how to access the format type from the 'this' data?
            
            }

        });

    return selection;

}



function postUpdateDate(selection, resource_id, event) {
    
    
    var url = 'https://data.austintexas.gov/resource/' + resource_id + '.json?$select=timestamp&$where=event=%27' + event + '%27%20AND%20%28created%20%3E%200%20OR%20updated%20%3E%200%20OR%20deleted%20%3E%200%29%20&$order=timestamp+DESC&$limit=1';

    // decoded: https://data.austintexas.gov/resource/i9se-t8hz.json?$select=timestamp&$where=event='cameras_update' AND (created > 0 OR updated > 0 OR deleted > 0) &$order=timestamp DESC&$limit=1

    if (event) {
        
        $.ajax({
            'async' : false,
            'global' : false,
            'cache' : false,
            'url' : url,
            'dataType' : "json",
            'success' : function (data) {
                
                var update_date_time = new Date(data[0].timestamp * 1000);

                var update_date = readableDate( update_date_time );

                var update_time = formats.formatTime(update_date_time)

                selection
                    .append('div')
                    .attr('class', 'row')
                    .append('div')
                    .attr('class', 'col')
                    .append('h6')
                    .attr("class", "dash-panel-footer-text text-left")
                    .html("Updated " + update_date + " at " + update_time + 
                        " | <a href=" + 'empty' + " target='_blank'> Data <i  class='fa fa-download'></i> </a>"
                );
            }
        });

    } else {

        selection.append('h6')
            .attr("class", "dash-panel-footer-text")
            .html("<a href=" + 'empty' + " target='_blank'> Data <i  class='fa fa-download'></i> </a>");
    }



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


function createPanel(row_container_id, panel_id, panel_icon, panel_name, data) {

    //  create container and panel divs
    var panel = d3.select("#" + row_container_id)
        .append("div")
        .data([data])
        .attr("class", "col-sm-6 col-md-4 col-lg-3 dash-panel-container p-2")
        .append("div")
        .attr("class", "col dash-panel h-100 p-2")
        .attr("id", panel_id);

    //  create header
    var header = panel.append("div")
        .attr("class", "row dash-panel-header");

    header.append("div")
        .attr("class", "col-1 dash-panel-icon")
        .html("<h4><i class='fa fa-" + panel_icon + "' ></i></h4>");

    header.append("div")
        .attr("class", "col dash-panel-title")
        .html("<h4>" + panel_name + "</h4>");
    
    panel.append("p").attr("class", "loading").text("Loading...");

    return panel;
              
}


//  https://data.austintexas.gov/resource/cwi3-ckqi.json?$query=select count(*), month||year as monthyear where monthyear in ("52017") group by monthyear

