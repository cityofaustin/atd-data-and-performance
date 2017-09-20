//  requires leaflet

//  pass filters to filter array separate objects >> and include filter field in config
//  replace init_display with a get method
//   extend to different sources
//  change rowIdField to primary_key
//  replace latfield and lonfield with geometry
//  processDisplayField seems too specific to include
//  icon returns from a function
//  i think pop up and details should share some kind of related field definition
//  and popup and details are functinos that genearate something based on field def
//  extend for knack/socrata


function Dataset(id, primary_key, options) {
    this.id = id;
    this.primary_key = primary_key;
    this.field_def = {};
    options : {
        //  @option label: String
        //  The humanized descriptive name of the dataset
        label: undefined,

        //  @option display_field: String
        //  The field that best identifies the record.
        //  Used when only one field is used to display the record
        displayField: undefined,
        
        //  @option xField: String
        //  The fieldname of the dataset's longitude (x) field 
        xField: undefined,

        //  @option yField: String
        //  The fieldname of the dataset's latitude (y) field
        yField: undefined,

        //  @option icon: String
        //  The Font Awesome icon name to display
        //  Additional icons can be passed as filter options
        icon: undefined,

        //  @option layer: Leaflet featureGroup
        //  Feature group to which generates features will be added
        layer: new L.featureGroup(),

    }

}

var CONFIG = { 
    'service_requests' : {
        'appId' : '5815f29f7f7252cc2ca91c4f',  //  knack api param
        'data' : [],  //  data will go here programmatically
        details : function(record) {

            return [
                {
                    'name' : 'Location',
                    'value'  : record.field_1388
                },
                {
                    'type' : 'row',
                    'name' : 'Status',
                    'value'  : record.field_1636
                },
                {
                    'type' : 'row',
                    'name' : 'Issue Type',
                    'value' : record.field_1445
                },
                {
                    'type' : 'row',
                    'name' : 'Details',
                    'value' : record.field_1446
                },
                {
                    'type' : 'row',
                    'name' : 'Date',
                    'value' : record.field_1517
                },
            ]
        },
        'display_name' : 'Service Request',
        'display_field' : 'field_1388', //  field to display in table results
        'divId' : 'data_table',  //  destination table
        'filterField' : 'field_1797',  //  use status field to filter records
        'filters' : [
            {
                'display_name' : 'New',
                'value' : 'new',
                'icon' : 'fa-exclamation-triangle',
                'icon_color' : '#832025',
                'marker' : 'service_request_new'
            },
            {
                'display_name' : 'In Progress',
                'value' : 'in_progress',
                'icon' : 'fa-wrench',
                'icon_color' : '#1865B1',
                'marker' : 'service_request_in_progress'
            },
            {
                'display_name' : 'Repairs Complete',
                'value' : 'repairs_complete',
                'icon' : 'fa-check-circle',
                'icon_color' : '#028102',
                'marker' : 'service_request_repairs_complete'
            }
        ],
        'init_display' : true,  //  show layer on map init
        'name' : 'service_requests',
        'source' : 'knack',  //  source app (knack, socrata, ...)
        'spatial_ref' : 'stateplane',  //  stateplan, wgs84
        'rowIdField' : 'id',  //  unique id field- for table/map interactivity
        'sceneKey' : 'scene_514',  //  knack api param
        'viewKey' : 'view_1552',  //  knack api param
        'lonField' : 'field_1402',
        'latField' : 'field_1401',
        popup : function(record) {
            return '<b> ' + record.field_1388 + '<b>';        
        },
        processDisplayField : function(field_value) {
            //  function to post-process display field data
            //  here we take only the street name of a comma-separated address
            return field_value.split(',')[0];
        }
    },
    'cctv' : {
       'source' : 'socrata',  //  source app (knack, socrata, ...)
        'spatial_ref' : 'wgs84',  //  stateplan, wgs84
        'init_display' : true,  //  show layer on map init
        'name' : 'cctv',
        'resource_id' : 'fs3c-45ge',  //  socrata dataset id
        'data' : [],  //  data will go here programmatically
        'display_name' : 'CCTV',
        'display_field' : 'location_name', //  field to display in table results
        'rowIdField' : 'camera_id',  //  unique id field- for table/map interactivity
        'divId' : 'data_table',  //  destination table
        image_url : function(record) { 
            return 'http://162.89.4.145/CCTVImages/CCTV' + record.camera_id + '.jpg';
        },
        'lonField' : 'location_longitude',
        'latField' : 'location_latitude',
        'query' : 'select * where upper(camera_mfg) not in ("GRIDSMART")',
        popup : function(record) {
            return '<b> ' + record.location_name + '<b>';        
        },
        processDisplayField : function(field_value) {
            //  function to post-process display field data
            //  here we take only the street name of a comma-separated address
            return field_value;
        },
        details : function(record) {
            return [
                {
                    'name' : 'Location',
                    'value'  : record.location_name
                },
                {
                    'name' : 'Status',
                    'value'  : record.ip_comm_status
                },
                {
                    'name' : 'Status Date',
                    'value'  : record.comm_status_datetime_utc
                }
            ]   
        },
        'filterField' : 'camera_status',  //  use status field to filter records
        'filters' : [
            {
                'display_name' : 'New',
                'value' : 'TURNED_ON',
                'icon' : 'fa-camera-video',
                'icon_color' : '#832025',
                'marker' : 'cctv'
            }
        ]
    }
}

var MARKERS = {
    'signal_marker' : new L.ExtraMarkers.icon({
        icon: 'fa-car',
        markerColor: 'red',
        shape: 'circle',
        prefix: 'fa'
    }),
    'service_request_new' : new L.ExtraMarkers.icon({
        icon: 'fa-phone',
        markerColor: 'red',
        shape: 'circle',
        prefix: 'fa'
    }),
    'service_request_in_progress' : new L.ExtraMarkers.icon({
        icon: 'fa-wrench',
        markerColor: 'blue',
        shape: 'circle',
        prefix: 'fa'
    }),
    'service_request_repairs_complete' : new L.ExtraMarkers.icon({
        icon: 'fa-check-circle',
        markerColor: 'green',
        shape: 'circle',
        prefix: 'fa'
    }),
    'cctv' : new L.ExtraMarkers.icon({
        icon: 'fa-video-camera',
        markerColor: 'orange',
        shape: 'circle',
        prefix: 'fa'
    })
}





 
// Merges the given properties to the `options` of the `obj` object, returning the resulting options. See `Class options`. Has an `L.setOptions` shortcut.
//  From Leaflet
//  * (c) 2010-2017 Vladimir Agafonkin, (c) 2010-2011 CloudMade
function setOptions(obj, options) {
    if (!obj.hasOwnProperty('options')) {
        obj.options = obj.options ? create(obj.options) : {};
    }
    for (var i in options) {
        obj.options[i] = options[i];
    }
    return obj.options;
}