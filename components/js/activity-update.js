
$(document).on('knack-form-submit.view_1082', function(event, view, record) {
  //    edit my work order view
      // Do something after the record is created via form submission
      Knack.showSpinner();

      console.log(record.field_1235_raw);  // id of connected csr
      //  get emi id
      //  and other 

      Knack.hideSpinner();
});

TMC_ACTIVITY
ACTIVITY_DATE
ACTIVITY_NOTE (NOTE)
CREATED_BY
signal
school_beacon
hazard_flasher
dm
ASSET_TYPE
signals_affect
work_order
ASSIGNED_TO



// // change the view key to the key of your form that is inserting the record
// $(document).on('knack-record-create.view_273', function(event, view, record) {
//   Knack.showSpinner();
//   // Replace the page and view keys with your own
//   var url = 'https://api.knack.com/v1/pages/page_1/views/view_2/records/';
//   var headers = {
//     'X-Knack-Application-ID': 'YOUR-APP-ID',
//     'X-Knack-REST-API-Key':'knack',
//     'content-type':'application/json'
//   };
//   // use data from inserted record
//   var data = {
//     field_1: [record.id], // connection field
//     field_2: record.field_3
//   }
//   // insert the record
//   $.ajax({
//     url: url,
//     type: 'POST',
//     headers: headers,
//     data: data,
//     success: function(response) {
//       alert('Record Added!');
//       Knack.hideSpinner();
//     }
//   });
// });
