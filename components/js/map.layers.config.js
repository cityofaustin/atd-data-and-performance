var MAP_OPTIONS = {
        center : [30.27, -97.74],
        zoom : 13,
        minZoom : 1,
        maxZoom : 19,
        zoomControl: false
};

var CONFIG = { 
    'service_requests_new' : {
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
                },
                {
                    'type' : 'row',
                    'name' : '',
                    'value' : "<a target=_blank href='http://transportation.austintexas.io/data-tracker/#home/tmc/view-tmc-details/" + record.id + " ' >Data Tracker (Restricted Access)</a>",
                    
                }
            ]
        },
        'display_name' : 'Service Request',
        'display_field' : 'field_1388', //  field to display in table results
        'divId' : 'data_table',  //  destination table
        'icon' : 'phone-square',
        'icon_color' : '#962125',  // match extra-markers color
        'init_load' : true,  //  get layer data on app load
        'init_display' : true, //  display map layer on app load
        'layer_name' : 'service_requests_new',  //  match parent object name
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
    },
    'service_requests_in_progress' : {
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
                },
                {
                    'type' : 'row',
                    'name' : 'Actions Taken',
                    'value' : record.field_1053
                },
                {
                    'type' : 'row',
                    'name' : '',
                    'value' : "<a target=_blank href='http://transportation.austintexas.io/data-tracker/#home/tmc/view-tmc-details/" + record.id + " ' >Data Tracker (Restricted Access)</a>",
                    
                }
            ]
        },
        'display_name' : 'Work In Progress',
        'display_field' : 'field_1388', //  field to display in table results
        'divId' : 'data_table',  //  destination table
        'icon' : 'wrench',
        'icon_color' : '#196BB3',  // match extra-markers color
        'init_load' : true,  //  get layer data on app load
        'init_display' : true, //  display map layer on app load
        'layer_name' : 'service_requests_in_progress',  //  match parent object name
        'source' : 'knack',  //  source app (knack, socrata, ...)
        'spatial_ref' : 'stateplane',  //  stateplan, wgs84
        'rowIdField' : 'id',  //  unique id field- for table/map interactivity
        'sceneKey' : 'scene_514',  //  knack api param
        'viewKey' : 'view_1623',  //  knack api param
        'lonField' : 'field_1402',
        'latField' : 'field_1401',
        popup : function(record) {
            return '<b> ' + record.field_1388 + '<b>';        
        },
    },

    'incident_report' : {
        'appId' : '5815f29f7f7252cc2ca91c4f',  //  knack api param
        'data' : [],  //  data will go here programmatically
        details : function(record) {

            return [
                {
                    'name' : 'Location',
                    'value'  : record.field_1828
                },
                {
                    'type' : 'row',
                    'name' : 'Issue Reported',
                    'value'  : record.field_1829
                },
         
            ]
        },
        'display_name' : 'Incident Report',
        'display_field' : 'field_1828', //  field to display in table results
        'divId' : 'data_table',  //  destination table
        'icon' : 'exclamation-triangle',
        'icon_color' : '#EB7B2B',  // match extra-markers color
        'init_load' : true,  //  get layer data on app load
        'init_display' : true, //  display map layer on app load
        'layer_name' : 'incident_report',  //  match parent object name
        'source' : 'knack',  //  source app (knack, socrata, ...)
        'spatial_ref' : 'wgs84',  //  stateplan, wgs84
        'rowIdField' : 'id',  //  unique id field- for table/map interactivity
        'sceneKey' : 'scene_514',  //  knack api param
        'viewKey' : 'view_1624',  //  knack api param
        'lonField' : 'field_1838',
        'latField' : 'field_1837',
        popup : function(record) {
            return '<b> ' + record.field_1828 + '<b>';        
        },
    },

    'cctv' : {
       'source' : 'socrata',  //  source app (knack, socrata, ...)
        'spatial_ref' : 'wgs84',  //  stateplan, wgs84
        'init_load' : true,  //  get layer data on app load
        'init_display' : false, //  display map layer on app load
        'icon' : 'video-camera',
        'icon_color' : '#2B6272',  // match extra_markers color (see MARKERS below)
        'layer_name' : 'cctv',
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
        'query' : "select camera_id, camera_mfg, location_name, ip_comm_status, comm_status_datetime_utc, location_longitude, location_latitude where upper(camera_mfg) not in (\"GRIDSMART\") and upper(camera_status) in (\"TURNED_ON\")",
        popup : function(record) {
            return '<b> ' + record.location_name + '<b>';        
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
        'icon_color' : '#000000',
        'layer_name' : 'dms',
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
        }
    }
    
}

var MARKERS = { 
    //  marker names must match layer_name from config
    'service_requests_new' : new L.ExtraMarkers.icon({
        icon: 'fa-phone',
        markerColor: 'red',
        shape: 'circle',
        prefix: 'fa'
    }),
    'service_requests_in_progress' : new L.ExtraMarkers.icon({
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
    'incident_report' : new L.ExtraMarkers.icon({
        icon: 'fa-exclamation-triangle',
        markerColor: 'orange',
        shape: 'star',
        prefix: 'fa'
    }),
    'cctv' : new L.ExtraMarkers.icon({
        icon: 'fa-video-camera',
        markerColor: 'blue-dark',
        shape: 'square',
        prefix: 'fa'
    }),
    'dms' : new L.ExtraMarkers.icon({
        icon: 'fa-info-circle',
        markerColor: 'black',
        shape: 'square',
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










    




