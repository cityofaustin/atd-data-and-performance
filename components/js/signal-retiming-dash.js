var annual_goals = {
    "2016" : {
        retime_goal: 200,
        avg_reduction_goal: .05    
    },
    "2015" : {
        retime_goal: 300,
        avg_reduction_goal: .05  
    }    
};

var selected_year = "2016";

var retime_goal = +annual_goals[selected_year]["retime_goal"];

var reduction_goal = +annual_goals[selected_year]["avg_reduction_goal"];

var data_url = "../components/data/intersection_status_snapshot.json";

var john;

var pizza; 

d3.json(data_url, function(dataset) {

    //  var compare_date = new Date(selected_year);
    var compare_date = new Date("6/07/2016");  //  dumb dumb for dev

    dataset = dataset.filter(function(data) {
            var row_date = new Date(data["intstatusdatetime"]);
            return row_date > compare_date;
        });  // filter for selected fiscal year

    john = dataset;
    
    var retime_current = dataset.length;

    var reduce_total = 0;

    for (var i = 0; i < dataset.length; i++) {
        //  reduce_total = reduce_total + dataset[i]["trave_time_reduced"];
        reduce_total = reduce_total + i;  // bs for dev
    }  

    var avg_reduction = ( reduce_total / retime_current );

    populateStat("info-1", retime_current);

    populateStat("info-2", avg_reduction); 

});

d3.select("#year-selector").on("change", function(d){
    
    populateStat("info-1", 300);

    populateStat("info-2", 100);

})

function getSelectedYear(){

    var selected_year = d3.select("#year-selector").select("option").attr("value");
    
    return selected_year;

}

function drawChart() {

}

function populateStat(divId, statValue) {

    d3.select("#" + divId)
        .select("h2")
        .text("0")
        .transition()
        .duration(400)
        .ease("quad")
        .tween("text", function () {
            
            var i = d3.interpolate(this.textContent, statValue);
            
            return function (t) {
            
                this.textContent = Math.round(i(t));
            
            }    
    });
}





















