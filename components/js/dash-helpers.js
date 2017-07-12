//  requires d3

function DashRow(container, before, id) {
  this.container = container;
  this.before = before;
  this.id = id;
  this.row = function() {
            var row = d3.select(this.container).insert('div', this.before)
                .attr('class', 'row')
                .attr('id', this.id);
            return row;
        }
}

