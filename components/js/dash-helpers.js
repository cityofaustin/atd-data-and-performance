//  requires d3

var dash = {
    'insertRow' :
        function(container, before, new_div_id ) {
            var row = d3.select(container).insert('div', before)
                .attr('class', 'row')
                .attr('id', new_div_id);
            return row;
        }
} 
