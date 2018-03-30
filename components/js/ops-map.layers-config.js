var MAP_OPTIONS = {
        center : [30.27, -97.74],
        zoom : 13,
        minZoom : 1,
        maxZoom : 19
};

var CONFIG = { 
    'service_requests_new' : {
        'appId' : '5815f29f7f7252cc2ca91c4f',  //  knack api param
        'data' : [],  //  data will go here programmatically
        details : function(record) {

            return [
                {
                    'name' : 'Location',
                    'value'  : record.field_1963
                },
                {
                    'type' : 'row',
                    'name' : 'Issue',
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
        'display_name' : 'New Service Request',
        'display_field' : 'field_1388', //  field to display in table results
        'divId' : 'data_table',  //  destination table
        'icon' : 'phone',
        'icon_color' : '#962125',  // match extra-markers color
        'layer_name' : 'service_requests_new',  //  match parent object name
        'layer_type' : 'markerLayer',
        'popup_text' : 'New customer Service Requests from Austin 311',
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
                    'value'  : record.field_1963
                },
                {
                    'type' : 'row',
                    'name' : 'Issue',
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
        'layer_name' : 'service_requests_in_progress',  //  match parent object name
        'layer_type' : 'markerLayer',
        'popup_text' : 'Customer service requests that are being actively addressed by Transportation staff.',
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
    'service_requests_pending_review' : {
        'appId' : '5815f29f7f7252cc2ca91c4f',  //  knack api param
        'data' : [],  //  data will go here programmatically
        details : function(record) {

            return [
                {
                    'name' : 'Location',
                    'value'  : record.field_1963
                },
                {
                    'type' : 'row',
                    'name' : 'Issue',
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
        'display_name' : 'Pending Engineer Review',
        'display_field' : 'field_1388', //  field to display in table results
        'divId' : 'data_table',  //  destination table
        'icon' : 'clock-o',
        'icon_color' : '#372341',  // match extra-markers color
        'layer_name' : 'service_requests_pending_review',  //  match parent object name
        'layer_type' : 'markerLayer',
        'popup_text' : 'Service requests pending review by a professional transportation engineer',
        'source' : 'knack',  //  source app (knack, socrata, ...)
        'spatial_ref' : 'stateplane',  //  stateplan, wgs84
        'rowIdField' : 'id',  //  unique id field- for table/map interactivity
        'sceneKey' : 'scene_514',  //  knack api param
        'viewKey' : 'view_1804',  //  knack api param
        'lonField' : 'field_1402',
        'latField' : 'field_1401',
        popup : function(record) {
            return '<b> ' + record.field_1388 + '<b>';        
        },
    },
    'service_requests_repairs_complete' : {
        'appId' : '5815f29f7f7252cc2ca91c4f',  //  knack api param
        'data' : [],  //  data will go here programmatically
        details : function(record) {

            return [
                {
                    'name' : 'Location',
                    'value'  : record.field_1963
                },
                {
                    'type' : 'row',
                    'name' : 'Issue',
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
        'display_name' : 'Repairs Complete',
        'display_field' : 'field_1388', //  field to display in table results
        'divId' : 'data_table',  //  destination table
        'icon' : 'check-circle',
        'icon_color' : '#108131',  // match extra-markers color
        'layer_name' : 'service_requests_repairs_complete',  //  match parent object name
        'layer_type' : 'markerLayer',
        'popup_text' : 'Service requests locations at which equipment has been repaired.',
        'source' : 'knack',  //  source app (knack, socrata, ...)
        'spatial_ref' : 'stateplane',  //  stateplan, wgs84
        'rowIdField' : 'id',  //  unique id field- for table/map interactivity
        'sceneKey' : 'scene_514',  //  knack api param
        'viewKey' : 'view_1803',  //  knack api param
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
                {
                    'type' : 'row',
                    'name' : 'Updated',
                    'value'  : record.field_1827
                }
            ]
        },
        'display_name' : 'Incident Report',
        'display_field' : 'field_1828', //  field to display in table results
        'divId' : 'data_table',  //  destination table
        'icon' : 'exclamation-triangle',
        'icon_color' : '#EB7B2B',  // match extra-markers color
        'layer_name' : 'incident_report',  //  match parent object name
        'layer_type' : 'markerLayer',
        'popup_text' : 'Traffic incidents reported reported to the Austin Police, Aviation Police, and Travis County Sheriff',
        'source' : 'knack',  //  source app (knack, socrata, ...)
        'spatial_ref' : 'wgs84',  //  stateplan, wgs84
        'rowIdField' : 'id',  //  unique id field- for table/map interactivity
        'sceneKey' : 'scene_514',  //  knack api param
        'viewKey' : 'view_2030',  //  knack api param
        'lonField' : 'field_1838',
        'latField' : 'field_1837',
        popup : function(record) {
            return '<b> ' + record.field_1828 + '<b>';        
        },
    },

    'cctv' : {
        'base_url' : 'https://data.austintexas.gov/resource/',
        'source' : 'socrata',  //  source app (knack, socrata, ...)
        'spatial_ref' : 'wgs84',  //  stateplan, wgs84
        'icon' : 'video-camera',
        'icon_color' : '#2B6272',  // match extra_markers color (see MARKERS below)
        'layer_name' : 'cctv',
        'layer_type' : 'markerLayer',
        'popup_text' : 'CCTV camera locations',
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
                },
                {   'name' : 'Source',
                    'value' : "<a href=" + this.base_url + this.resource_id + " target=_blank ><i class=\"fa fa-cloud-download\" ></i> Data</a>"
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
        'icon' : 'info-circle',
        'icon_color' : '#000000',
        'layer_name' : 'dms',
        'layer_type' : 'markerLayer',
        'popup_text' : 'Dynamic Messaging Sign locations',
        'base_url' : 'https://data.austintexas.gov/resource/',
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
                    'name' : 'Location',
                    'value'  : record.location_name
                },
                {
                    'name' : 'Message',
                    'value'  : '<b>' + record.dms_message + '</b>'
                },
                {
                    'name' : 'Updated',
                    'value'  : humanDate(record.message_time)
                },
                {   'name' : 'Source',
                    'value' : "<a href=" + this.base_url + this.resource_id + " target=_blank ><i class=\"fa fa-cloud-download\" ></i> Data</a>"
                }
            ]   
        },
        'query' :'SELECT * WHERE dms_message IS NOT NULL'
    },
    'traffic' : {
        'source' : 'mapquest',  //  source app (knack, socrata, ...)
        'icon' : 'road',
        'icon_color' : '#000000',
        'popup_text' : 'Current traffic conditions',
        'layer_name' : 'traffic',
        'layer_type' : 'baseLayer',
        layer_func : function() { 
            return MQ.trafficLayer({layers: ['flow']});
        },
        'data' : [],  //  data will go here programmatically
        'display_name' : 'Traffic',
        details : function(record) {
            return [
                {
                    'name' : 'Traffic',
                    'value'  : 'Current Traffic'
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
    'service_requests_repairs_complete' : new L.ExtraMarkers.icon({
        icon: 'fa-check-circle',
        markerColor: 'green',
        shape: 'circle',
        prefix: 'fa'
    }),
    'service_requests_pending_review' : new L.ExtraMarkers.icon({
        icon: 'fa-clock-o',
        markerColor: 'purple',
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
    '$12': 700,
    '$13': 400,
    '$14': 300,
    '$15': 150,
    '$16': 75,
    '$17': 75,
    '$18': 75,
    '$19': 75,
    '$20': 75,
};










    




