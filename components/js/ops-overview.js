
var t_options = {
    ease : d3.easeQuad,
    duration : 500
};

var formats = {
    'round': function(val) { return Math.round(val) },
    'formatDateTime' : d3.timeFormat("%e %b %-I:%M%p"),
    'formatDate' : d3.timeFormat("%x"),
    'formatTime' : d3.timeFormat("%I:%M %p"),
    'thousands' : d3.format(",")
};

var q = d3.queue();

var global_data = [

      {
        'name' : 'traffic_signals',
        'init_val' : 0,
        'format' : 'round',
        'data' : [901],
        'infoStat' : true

    },{
        'name' : 'phbs',
        'init_val' : 0,
        'format' : 'round',
        'data' : [52],
        'infoStat' : true
    },
    {
        'name' : 'cameras',
        'init_val' : 0,
        'format' : 'round',
        'data' : [275],
        'infoStat' : true
    },
    {
        'name' : 'sensors',
        'init_val' : 0,
        'format' : 'round',
        'data' : [145],
        'infoStat' : true
    },
    {
        'name' : 'school-beacons',
        'init_val' : 0,
        'format' : 'round',
        'data' : [520],
        'infoStat' : true
    },
    {
        'name' : 'detectors',
        'init_val' : 0,
        'format' : 'round',
        'data' : [761],
        'infoStat' : true
    },
    {
        'name' : 'signals-on-flash',
        'init_val' : 0,
        'format' : 'round',
        'data' : [0],
        'infoStat' : true
    },
    {
        'name' : 'signal-timing',
        'init_val' : 0,
        'format' : 'round',
        'data' : [140],
        'infoStat' : true
    },
    {
        'name' : 'work-orders',
        'init_val' : 0,
        'format' : 'round',
        'data' : [99],
        'infoStat' : true
    },
    {
        'name' : 'prev-maint',
        'init_val' : 0,
        'format' : 'round',
        'data' : [87],
        'infoStat' : true
    },
    {
        'name' : 'vza-enforcement',
        'init_val' : 0,
        'format' : 'round',
        'data' : [2034],
        'infoStat' : true
    },
    {
        'name' : 'bcycle-trips',
        'init_val' : 0,
        'format' : 'thousands',
        'data' : [14304],
        'infoStat' : true
    }
];


main(global_data)


function main(data) {

    var infos = appendInfoText(data);

    var infos = transitionInfoStat(infos, t_options, 'TURNED_ON' );


    for (var i = 0; i  < global_data.length; i++ ) {

        var divId = global_data[i].name;
        
        var selection = d3.select("#" + divId);

        var event = 'pizza_party'

        var resource_id = 'jesus_cristo'

        postUpdateDate(selection, event, resource_id);
    }

 
}




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


function transitionInfoStat(selection, options) {

    var t = d3.transition()
        .ease(options.ease)
        .duration(options.duration);

    selection.transition(t)  //  do this for each selection in sequence
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



function postUpdateDate(selection, event, resource_id) {

    var rando = Math.floor(Math.random() * 10 )

    var d = new Date()

    var update_date_time = d.setDate(d.getDate() - rando);

    update_date = readableDate( update_date_time );

    selection.append('h5')
        .html("Updated " + update_date +
            " | <a href=" + 'empty' + " target='_blank'> Data <i  class='fa fa-download'></i> </a>"
         );

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
