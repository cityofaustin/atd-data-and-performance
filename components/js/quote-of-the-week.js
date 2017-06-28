// require D3js
// grab the latset quote of the week and post it to 

d3.csv('https://raw.githubusercontent.com/cityofaustin/transportation/gh-pages/components/data/quote_of_the_week.csv', function(error, data) {

    //  http://stackoverflow.com/questions/11488194/how-to-use-d3-min-and-d3-max-within-a-d3-json-command
    var most_recent = d3.entries(data).sort(function(a, b) { return d3.descending(a.quote_date, b.quote_date); })[0]

    var most_recent = most_recent.value;
    
    var quote = d3.select('#quote').html(most_recent.quote);

    var attribution = d3.select("#attribution").html(most_recent.attribution);
    
    d3.select('#quote-of-the-week').html("<span style='font-style: italic;' id='quote'>" + most_recent.quote + "</span> - <span style='font-style: normal;' id='attribution'>" + most_recent.attribution + "</span>");

});    