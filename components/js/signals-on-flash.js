    //  v0.1
    //
    //  todo:

    //  call back for adding new control to map
    //  add data refresh date
    //  is it ok to have object keys as numb    ers? (NOPE)
    //  rescale chart on screen resize
    //  table row count does not update (because you're not adding rows with the native api)
    //  animations choppy::wait to populat map until chart update
    //  tooltips
    //  declare variables ;)
    //  upgrade to d4!
    //  ajax errorhandling
    //  table anchors so you can go 'back' from feature click
    //
    //  var metadataUrl_cases = "https://data.austintexas.gov/api/views/5zpr-dehc/rows.json"  
    //
    // globals

    var int_stats, table, john;

    var map;
    
    var signal_markers = {};

    var map_expanded = false;

    var formatPct = d3.format("%");
    
    var formatDateTime = d3.time.format("%e %b %Y %H:%M%p");

    //  static data
    var data_url = "../components/data/intersection_status_snapshot_conflict.json";

    //  live data!
    //  var data_url = "https://data.austintexas.gov/resource/5zpr-dehc.json?intstatus=2";

    var default_map_size = 300;

    var expanded_map_size = 600;

    var master_layer = new L.featureGroup();

    var conflict_flash_marker = new L.ExtraMarkers.icon({
        icon: 'fa-exclamation-triangle',
        markerColor: 'red',
        shape: 'circle',
        prefix: 'fa'
    });
    
    getData(data_url);

    function main(dataset){

        populateInfoStat(dataset, "info-1");  // conflict flash

        makeMap(dataset);

    };

    function populateInfoStat(dataset, divId) {
    
         d3.select("#" + divId)
            .append("text")
            .text('0');

        updateInfoStat(dataset, divId);

    }

    function updateInfoStat(dataset, divId) {

        if (dataset) {

            d3.select("#" + divId)
                .select("text")
                .transition()
                .duration(1000)
                .ease("quad")
                .tween("text", function () {
                    
                    var i = d3.interpolate(this.textContent, dataset);
                    
                    return function (t) {
                    
                        this.textContent = Math.round(i(t));
                    
                    }
                
                });

        } else {  //  if info value is 0

            d3.select("#" + divId)
                .style("cursor", "default");

        }
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

        dataset = dataset.filter(function(d){ return +d.intstatus == 2});

        var signals_on_flash_layer = new L.featureGroup();
        
        for (var i = 0; i < dataset.length; i++) {   
            
            if(dataset[i].latitude > 0) {

                var status = +dataset[i].intstatus;

                var lat = dataset[i].latitude;
        
                var lon = dataset[i].longitude;

                var address = dataset[i].intname;

                var intid = dataset[i].intid;

                var status_time = dataset[i].intstatusdatetime;

                var assetnum = dataset[i].assetnum;
                
                var marker = L.marker([lat,lon], {
                        icon:  conflict_flash_marker
                    })
                    .bindPopup(
                        "<b>" + assetnum + ": " + address + "</b><br>" +
                        "<b>Status: FLASHING </b>" + 
                        "<br><b>Updated:</b> " + status_time
                    )

                if(status) {
                    
                    marker.addTo(signals_on_flash_layer);
                
                }
            }

        }
        
        signals_on_flash_layer.addTo(map);

        map.fitBounds(signals_on_flash_layer.getBounds(), {padding: [10, 10] });

    }

    function applyStatusTypes(statusObject) {

        for (statusType in STATUS_TYPES) {

            if (!(statusType in statusObject)) {

                statusObject[statusType] = 0;
                
            }
        }
    }

    function getData(myurl) {
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

    function postUpdateDate(data){

        var update_date = new Date(data.meta.view.rowsUpdatedAt * 1000);
        
        var update_date = formatDateTime(update_date);
        
        $('#update_date').text("Data updated " + update_date);
        
    }


