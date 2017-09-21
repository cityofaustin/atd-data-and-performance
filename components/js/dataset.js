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
    this.layer = new L.featureGroup;
    this.data = [],
    //  @option label: String
        //  The humanized descriptive name of the dataset
    this.label = options.label;
    //  @option display_field: String
    //  The field that best identifies the record.
    //  Used when only one field is used to display the record
    this.displayField = options.displayField;
    //  @option xField: String
    //  The fieldname of the dataset's longitude (x) field 
    this.xField = options.xField;
    //  @option yField: String
    //  The fieldname of the dataset's latitude (y) field
    this.yField = options.yField;
    //  @option icon: String
    //  The Font Awesome icon name to display
    //  Additional icons can be passed as filter options
    this.icon = options.icon
    
}

function Knack(id, primary_key) {
  Dataset.call(this, app_id, sceneKey, ViewKey, options); 
  this.api_key='knack'
}
//  https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Inheritance
Knack.prototype = Object.create(Dataset.prototype);
Knack.prototype.constructor = Knack


var service_requests = new Dataset(
    'service_requests', 
    'id',
    {
        label: 'Service Requests',
        displayField: 'field_1388', // address
        xField: 'field_1402',
        yField: 'field_1401',
        icon: 'exclamation-triangle'
    }
) 

