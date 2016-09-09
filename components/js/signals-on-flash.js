    //  v0.2
    //
    //  todo:
    //  add data refresh date should be real!
    //  var metadataUrl_cases = "https://data.austintexas.gov/api/views/5zpr-dehc/rows.json"  

    var table, john;

    var map;

    var signal_markers = {};

    var map_expanded = false;

    var formatPct = d3.format("%");
    
    var formatDateTime = d3.timeFormat("%c");

    var formatDate = d3.timeFormat("%x");
    
    var formatTime = d3.timeFormat("%I:%M %p");

    var t1 = d3.transition()
        .ease(d3.easeQuad)
        .duration(500);

    var t2 = d3.transition()
        .ease(d3.easeQuad)
        .duration(500);

    var conflict_status = "2"  //  2 is conflict, 3 is no comm, 1 is coordinated, etc....this is what drives the dashboard

    var logfile_url = 'https://data.austintexas.gov/resource/n5kp-f8k4.json?%24select=timestamp&%24where=event=%27signal_status_update%27&%24order=timestamp%20DESC&%24limit=1'

    //  static data
        // lots of signals
        var data_url = "../components/data/intersection_status_snapshot_conflict.json";
    
        //  one signal
        //  var data_url = "../components/data/intersection_status_snapshot_conflict_one.json";

    //  live data!
    //  var data_url = "https://data.austintexas.gov/resource/5zpr-dehc.json?intstatus=" + conflict_status;

    var default_map_size = 300;

    var expanded_map_size = 600;

    var master_layer = new L.featureGroup();

    var conflict_flash_marker = new L.ExtraMarkers.icon({
        icon: 'fa-exclamation-triangle',
        markerColor: 'red',
        shape: 'circle',
        prefix: 'fa'
    });
    
    getSignalData(data_url);

    //  init tooltips
    $(document).ready(function(){
        $('[data-toggle="tooltip"]').tooltip();

        if (is_touch_device()) {
            
            d3.select('.map')
                .style("margin-right", "10px")
                .style("margin-left", "10px");
        }

    });

    //  zoom to feature from table click
    d3.selectAll(".feature_link").on("click", function(d){

        var marker_id = d3.select(this).attr("data-intid");

        map.setView(signal_markers[marker_id].getLatLng(), 14);

        signal_markers[marker_id].openPopup();

    });

    d3.select("#map-expander").on("click", function(){

        d3.select(this)
            .select("button")
                .html(function(){

                    if (map_expanded) {

                        return "<i  class='fa fa-expand'</i>";

                    } else {
                        
                        return "<i  class='fa fa-compress'</i>"

                    }
                });
        
        var map_size = expanded_map_size;

        if (map_expanded) {

            map_expanded = false;
        
            map_size = default_map_size;
        
        } else {

            map_expanded = true;

        }

        d3.select("#map")
            .transition(t2)
            .style("height", map_size + "px");

        setTimeout(function(){ map.invalidateSize()}, 600);

    });

    function main(data){

        populateInfoStat(data, "info-1", function(){

            getLogData(logfile_url);  //  callback to post update time ensures its positioned properly

        });  // conflict flash

        makeMap(data);

        populateTable(data);

    };

    function populateInfoStat(dataset, divId, postUpdate) {

        d3.select("#" + divId)
            .append("text")
            .text('0');
        
        if (dataset.length > 0) {

            updateInfoStat(dataset, divId);

        } else {

            d3.select("#" + divId)
                .select("text")
                    .classed("goal-met", true);

        }

        postUpdate();

    }


    function updateInfoStat(dataset, divId) {

        var signals_on_flash = dataset.length;

        d3.select("#" + divId)
                .select("text")
                .classed("goal-unmet", true)
                .transition(t1)
                .tween("text", function () {
                    
                    var that = d3.select(this); 

                    var i = d3.interpolate(0, signals_on_flash);
                    
                    return function (t) {
                    
                        that.text( Math.round(i(t)) );
                    
                    }
                
                });

    }

    function postUpdateDate(log_data, divId){

        var update_date_time = new Date(log_data[0].timestamp * 1000);

        update_date = readableDate( update_date_time );

        var update_time = formatTime( update_date_time );

        d3.select("#" + divId)
            .append('h5')
            .html("Updated " + update_date + " at " + update_time +
                " | <a href='https://data.austintexas.gov/dataset/5zpr-dehc' target='_blank'> Data <i  class='fa fa-download'></i> </a>" );

    }

    function makeMap(dataset) {

        L.Icon.Default.imagePath = '../components/images/';

        map = new L.Map("map", {
            center : [30.28, -97.735],
            zoom : 10,
            minZoom : 1,
            maxZoom : 20,
            scrollWheelZoom: false
        });      // make a map

        var Stamen_TonerLite = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
            attribution : 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            subdomains : 'abcd',
            maxZoom : 20,
            ext : 'png'
        }).addTo(map);

        populateMap(map, dataset, function(){
          
            //  var sidebar = L.control.sidebar('sidebar').addTo(map);

        });

    }

    function populateMap(map, dataset, createSideBar) {

        dataset = dataset.filter(function(d){ return +d.intstatus == conflict_status});

        if (dataset.length > 0) {

            var signals_on_flash_layer = new L.featureGroup();
            
            for (var i = 0; i < dataset.length; i++) {   
                
                if(dataset[i].latitude > 0) {

                    var status = +dataset[i].intstatus;

                    var lat = dataset[i].latitude;
            
                    var lon = dataset[i].longitude;

                    var address = dataset[i].intname;

                    var intid = dataset[i].intid;

                    var status_time = formatDateTime( new Date(dataset[i].intstatusdatetime) );

                    var assetnum = dataset[i].assetnum;
                    
                    var marker = L.marker([lat,lon], {
                            icon:  conflict_flash_marker
                        })
                        .bindPopup(
                            "<b>" + assetnum + ": " + address + "</b><br>" +
                            "<b>Status: FLASHING </b>" + 
                            "<br><b>Updated:</b> " + status_time
                        )
                        
                        marker.addTo(signals_on_flash_layer);

                        signal_markers[intid] = marker;

                }

            }
            
            signals_on_flash_layer.addTo(map);

            map.fitBounds(
                signals_on_flash_layer.getBounds(),
                    {
                        paddingTopLeft: [80, 80],
                        maxZoom: 15

                    }
                );
        }

    }

    function applyStatusTypes(statusObject) {

        for (statusType in STATUS_TYPES) {

            if (!(statusType in statusObject)) {

                statusObject[statusType] = 0;
                
            }
        }
    }

    function getSignalData(myurl) {
        $.ajax({
            'async' : false,
            'global' : false,
            'cache' : false,
            'url' : myurl,
            'dataType' : "json",
            'success' : function (data) {
                main(data);
            }
        
        }); //end get data

    }

    function getLogData(myurl) {
        $.ajax({
            'async' : false,
            'global' : false,
            'cache' : false,
            'url' : myurl,
            'dataType' : "json",
            'success' : function (data) {
                postUpdateDate(data, "info-1");
            }
        
        }); //end get data

    }



    function populateTable(dataset) {

        var rows = d3.select("tbody")
            .selectAll("tr")
            .data(dataset)
            .enter()
            .append("tr")
            .filter(function(d){
                return d.intstatus > 0;
            })
            .attr("class", "tableRow");

        d3.select("tbody").selectAll("tr")
            .each(function (d) {
                
                d3.select(this).append("td").html(d.assetnum);
                
                d3.select(this).append("td").html("<a href='javascript:;'" + "class='feature_link' data-intid=" + d.intid + " name=_" + d.intid + ">" + d.intname + "</a>");
                
                d3.select(this).append("td").html("Conflict / Flashing");
                
                d3.select(this).append("td").html( formatDateTime( new Date(d.intstatusdatetime) ) );
        
            });

        //  activate datatable sorting/search functionality
        $(document).ready(function () {
            table = $('#data_table').DataTable( {
                paging : false
            });
        });

    } //  end populateTable

    function readableDate(date) {

        var update_date = formatDate(date);
        
        var today = formatDate( new Date() );

        if (update_date == today) {
        
            return "today";
        
        } else {
        
            return update_date;
        
        }

    }

function is_touch_device() {  //  via https://ctrlq.org/code/19616-detect-touch-screen-javascript
        return (('ontouchstart' in window)
      || (navigator.MaxTouchPoints > 0)
      || (navigator.msMaxTouchPoints > 0));
}
