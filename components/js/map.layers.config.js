var MAP_OPTIONS = {
        center : [30.27, -97.74],
        zoom : 13,
        minZoom : 1,
        maxZoom : 19,
        zoomControl: false
};

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
                {
                    'type' : 'row',
                    'name' : 'Issue ID',
                    'value' : record.field_1678
                }
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
        'icon' : 'phone-square',
        'icon_color' : '#962125',
        'init_load' : true,  //  get layer data on app load
        'init_display' : true, //  display map layer on app load
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
        'init_load' : true,  //  get layer data on app load
        'init_display' : false, //  display map layer on app load
        'icon' : 'video-camera',
        'icon_color' : '#ED8F35',
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
    },
    'dms' : {
       'source' : 'socrata',  //  source app (knack, socrata, ...)
        'spatial_ref' : 'wgs84',  //  stateplane, wgs84
        'init_load' : true,  //  get layer data on app load
        'init_display' : false, //  display map layer on app load
        'icon' : 'info-circle',
        'icon_color' : '#0F7E31',
        'name' : 'dms',
        'resource_id' : '4r2j-b4rx',  //  socrata dataset id
        'data' : [],  //  data will go here programmatically
        'display_name' : 'Dynamic Message Sign',
        'display_field' : 'dms_id', //  field to display in table results
        'rowIdField' : 'dms_id',  //  unique id field- for table/map interactivity
        'divId' : 'data_table',  //  destination table
        'lonField' : 'location_longitude',
        'latField' : 'location_latitude',
        popup : function(record) {
            return '<b> ' + record.dms_id + '<b>';        
        },
        processDisplayField : function(field_value) {
            //  function to post-process display field data
            //  here we take only the street name of a comma-separated address
            return field_value;
        },
        details : function(record) {
            return [
                {
                    'name' : 'Message',
                    'value'  : 'Keep Austin Beard.'
                },
                {
                    'name' : 'Updated',
                    'value'  : '9/22/2017 11:40am'
                }
            ]   
        },
        'filterField' : 'dms_status',  //  use status field to filter records
        'filters' : [
            {
                'display_name' : 'Status',
                'value' : 'TURNED_ON',
                'icon' : 'fa-info-circle',
                'icon_color' : '#4286f4',
                'marker' : 'dms'
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
    }),
    'dms' : new L.ExtraMarkers.icon({
        icon: 'fa-info-circle',
        markerColor: 'green',
        shape: 'circle',
        prefix: 'fa'
    })
}


var HIGHLIGTH_MARKER_SIZE = {  //  in meters
    '$1': 800,
    '$2': 800,
    '$3': 800,
    '$4': 800,
    '$5': 800,
    '$6': 800,
    '$7': 800,
    '$8': 800,
    '$9': 800,
    '$10': 800,
    '$11': 800,
    '$12': 500,
    '$13': 200,
    '$14': 160,
    '$15': 95,
    '$16': 60,
    '$17': 40,
    '$18': 25,
    '$19': 20,
    '$20': 20,
};










