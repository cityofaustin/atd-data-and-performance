    //  v0.2fpopup
    //
    //  todo:
    //  add data refresh date
    //  tooltips
    //  declare variables ;)
    //  upgrade to d4!
    //  ajax errorhandling


    //  var metadataUrl_cases = "https://data.austintexas.gov/api/views/5zpr-dehc/rows.json"  

    var int_stats, table, john;

    var map;
    
    var signal_markers = {};

    var map_expanded = false;

    var formatPct = d3.format("%");
    
    var formatDateTime = d3.time.format("%I:%M%p on %x");

    //  static data
    //  var data_url = "../components/data/intersection_status_snapshot_conflict.json";

    //  live data!
    var data_url = "https://data.austintexas.gov/resource/5zpr-dehc.json?intstatus=2";

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

        populateInfoStat(dataset, "info");  // conflict flash

        makeMap(dataset);

    };

    function populateInfoStat(dataset, divId) {
        
        if (dataset.length == 0) {

            var last_update = formatDateTime( new Date() );
        
            d3.select("#" + divId)
                .text('There are no signals on flash as of ' + last_update)
                .style("color", "green");

        } else {

            d3.select("#" + divId)
                .text('There are 0 signals on flash as of Sep 1, 2016 at 9:00AM.');

            updateInfoStat(dataset, divId);

        }

    }

    function updateInfoStat(dataset, divId) {

        var last_update = formatDateTime( new Date() );

        d3.select("#" + divId)
            .transition()
            .duration(500)
            .style("color", "#a5272b")
            .ease("quad")
            .tween("text", function () {
                
                var i = d3.interpolate(
                    parseFloat(
                        this.textContent.substr(10,3)
                    ),
                    dataset.length
                );
                
                return function (t) {
                
                    this.textContent = "There are " + Math.round(i(t)) + " signals on flash as of "  + last_update;
                
                }
            
            });

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

                    if(status) {
                        
                        marker.addTo(signals_on_flash_layer);
                    
                    }
                }

            }
            
            signals_on_flash_layer.addTo(map);

            map.fitBounds(signals_on_flash_layer.getBounds(), {paddingTopLeft: [0, 100] });
        }

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


