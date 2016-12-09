var global_data = [

    {
        'name' : 'all_signals',
        'resource_id' : 'p53x-x73x',
        'infoStat' : false
    },
    {
        'name' : 'traffic_signals',
        'init_val' : 0,
        'format' : 'round',
        'disp_fields' : ['atd_signal_id', 'location_name', 'modified_date' ],
        'infoStat' : true
    },
    {
        'name' : 'phbs',
        'init_val' : 0,
        'format' : 'round',
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


var ajax_calls = prepSocrataAJAX(global_data);


var t_options = {
    ease : d3.easeQuad,
    duration : 500
};


function main(){

    var data = parseSignalData(global_data);
        
    var infos = appendInfos(data);

    // ready for transition

}


$.when.apply($, ajax_calls) 
    .then( function() {

        main();

    });
      

function parseSignalData(data) {
    //  split all signal data into 'phbs' and 'traffic_signals'
    
    for (var i = 0; i  < data.length; i++ ) {
        
        if (data[i].name == 'all_signals') {

            var phb_data = data[i].data.filter(function(data){
                return filterByAttr(data, 'signal_type', 'PHB');
            });

            var signal_data = data[i].data.filter(function(data){
                return filterByAttr(data, 'signal_type', 'TRAFFIC');
            });

            //  http://stackoverflow.com/questions/15997879/get-the-index-of-the-object-inside-an-array-matching-a-condition
            data[data.findIndex(x => x.name=="traffic_signals")].data = signal_data;

            data[data.findIndex(x => x.name=="phbs")].data = phb_data;

        }

    }

    return data;

}



function prepSocrataAJAX(config_arr) {
    //  create array of ajax calls to pass to $.when()
    var calls = [];

    for ( var i = 0; i < config_arr.length; i++ ) {

        if ( 'resource_id' in config_arr[i] ) {
            
            var resource_id = config_arr[i].resource_id;
            
            var name = config_arr[i]['name'];

            var url = 'https://data.austintexas.gov/resource/' + resource_id + '.json?$limit=2000';

            calls.push( getJSON( url, name )) ;

        }
    }

    return calls;

}



function getJSON( url, name ) {
    //  ajax call and send to global data when success
    return $.getJSON(url, function( data ) {

        for (var i = 0; i < global_data.length; i++ ) {
            if (global_data[i].name == name) {
                global_data[i]['data'] = data;
            }
        }
    });

}



function filterByAttr(obj, attr_field, attr_val) {


    if (obj[attr_field] == attr_val) {
        return true;
    } else {
        return false
    }    
}




function appendInfoText(data) {

    var remove_loader = d3.select("#" + data.name)
        .select('.loading')
        .remove();

    var selection = d3.select("#" + data.name)
        .data([data])
        .append('text')
        .text(data.init_val);

    return selection;

}




function appendInfos(master_data) {

    var infos = [];

    var chart_data = master_data.filter(x => x.infoStat)

    for (var i = 0; i  < chart_data.length; i++ ) {
        
        var selection = appendInfoText(chart_data[i], name);
        
        infos.push(selection);
    }
}



function transitionInfoStat(selection, options) {

    var t = d3.transition()
        .ease(options.ease)
        .duration(options.duration);

    selection.transition(t)  //  do this for each selection in sequence
        .tween('text', function () {
            
            var that = d3.select(this);

            var new_value = that.data()[0].data.length;
            
            var i = d3.interpolate(0, new_value);
            
            return function (t) {
            
                that.text( formats['round'](i(t)) );  // how to access the format type from the 'this' data?
            
            }

        });

    return selection;

}


















