//  requires d3.js
//  requires js-cookie.js

Cookies.remove('disclaimer');

$(document).ready(function() {
    if (Cookies.get('disclaimer') == undefined) {
   
        Cookies.set('disclaimer', 'disclaimer', { expires: 30});
        showModal('disclaimer');
    
    }

});

function showModal(divId) {

    d3.select("#disclaimer-text").html(disclaimer_text);

    t = d3.transition()
        .ease(d3.easeQuad)
        .duration(500);

    d3.select("#" + divId)
        .transition(t)
        .style("opacity", 1.0);

    d3.select("body").on("click", function(){

        d3.select("#" + divId)
            .transition(t)
            .style("opacity", 0)
            .remove()

    })

}