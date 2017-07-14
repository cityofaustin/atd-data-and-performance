// custom js from an early version of data tracker

// remove menu on knack beta theme
// $(document).on('knack-page-render.any', function(event, page) {
//   var navRow = $('#kn-app-header').detach();
//   navRow.appendTo('#data-tracker-nav')
// });



$(document).on('knack-page-render.any', function(event, page) {
  
    //  reload page on sign in to populate headers
  
    if ($('input[value="Sign In"]').length ) {
    
        $('input[value="Sign In"]').click(function() {
                      
              $(document).on('knack-page-render.any', function(event, page) {
              
                location.reload()
              })
    
        });
   
    
      } else if ( $( "#kn-app-menu" ).length ) {
     
        $("#kn-app-menu").find(".kn-grid-list").children().each( function(){
            var link = $(this).find("a").attr("href");
            var name = $(this).find("span").text();
            console.log(name);
            $(".navbar-nav").append("<li role='presentation'><a href=" + link + ">" + name + "</a></li>");
        })

        $("#kn-app-menu").remove()
     
    }


  
});



$(document).on('knack-view-render.view_847', function(event, page) {
//  hide crumb trail at select locations    
  setTimeout(
  function() 
  {
    $('.kn-crumbtrail').remove();
    //do something special
  }, 1000);

});


$(document).on('knack-page-render.any', function(event, page) {
  // Hide the entire "Repeat" checkbox and label
  $("label:contains('Repeat')").hide();

  // Rename confusing google maps link
  $('a[title="view in google maps"]').text('View on Google Maps');
    
});



$(document).on('knack-view-render.view_958', function(event, page) {
//  hide crumb trail at select locations    
  setTimeout(
  function() 
  {
    $('.kn-crumbtrail').remove();
    //do something special
  }, 1000);

});



$(document).on('knack-scene-render.scene_428', function(event, page) {
    //  update iframe src from detail field
    var iframe_url = $("span:contains('apps/webappviewer')").text();
    $( "#csr_view" ).attr('src', iframe_url);
    
});