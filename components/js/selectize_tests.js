view csr
from csr link to mobile worker with asset type, lat/lon and sr number in parameters
parse url params
lookup asset nearest to sr or to user location
allow asset type change
>>  single asset field wtih dynamic fieldname and lookup




function magic(fieldname, asset_type) {
    
    $('#' + fieldname).selectize({
        maxItems: 1,
        valueField: 'id',  // should be database id
        labelField: 'field_1058',
        searchField: ['field_1058'],
        options: [],
        load: function(query, callback) {
            console.log(query);
        
            if (!query.length) return callback();
            
            //  build ajax params
            var app_id = Knack.application_id;

            var url = 'https://api.knack.com/v1/pages/scene_514/views/view_1483/records';

            var filters = [
                {
                   'field':'field_1058',
                   'operator':'contains',
                   'value':query
                }
            ];

            url += '?filters=' + encodeURIComponent(JSON.stringify(filters))
            
            $.ajax({
                url: url,
                type: 'GET',
                headers: {
                  'X-Knack-REST-API-Key': 'knack',
                  'X-Knack-Application-Id': app_id,
                  'Content-Type': 'application/json'
                },
                error: function(error) {
                    callback();
                },
                success: function(res) {
                    callback(res.records);
                }
            });
        }
    });
}


$(document).on('knack-page-render.scene_428', function(event, page) {
        magic('view_1437_field_1059_chzn', 'signals');
});





