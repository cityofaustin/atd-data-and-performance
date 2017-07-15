//  return name of current bootstrap viewport breakpoint
//  https://stackoverflow.com/questions/3044573/using-jquery-to-get-size-of-viewport

function breakpoint() {
        
    var bs_breaks = {
        //  https://v4-alpha.getbootstrap.com/layout/overview/#responsive-breakpoints
        'sm' : 576,  // and up (in pixels)
        'md' : 768,
        'lg' : 992,
        'xl' : 1200
    };

    var viewportWidth = $(window).width();

    if (viewportWidth < bs_breaks['sm']) {
        
        return 'xs';

    } else if (viewportWidth < bs_breaks['md']) {

        return 'sm';

    } else if (viewportWidth < bs_breaks['lg']) {

        return 'md';

    } else if (viewportWidth < bs_breaks['xl']) {

        return 'lg';

    } else {

        return 'xl';

    }
}