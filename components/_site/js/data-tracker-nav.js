$(document).on('knack-page-render.any', function(event, page) {

    if ( $( "#kn-app-menu" ).length ) {
     
        $("#kn-app-menu").find(".kn-grid-list").children().each( function(){
            var link = $(this).find("a").attr("href");
            var name = $(this).find("span").text();
            console.log(name);
            $(".navbar-nav").append("<li role='presentation'><a href=" + link + ">" + name + "</a></li>");
        })

        $("#kn-app-menu").remove()
     
    }
});