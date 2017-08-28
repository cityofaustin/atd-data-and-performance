// require D3js
d3.json('https://data.austintexas.gov/resource/dykj-9er2.json?$query=select * order by quote_date desc limit 1', function(error, data) {
    var quote = data[0].quote
    var attribution = data[0].attribution
    d3.select('#quote-of-the-week').html("<span style='font-style: italic;' id='quote'>" + quote + "</span>  - <span style='font-style: normal;' id='attribution'>" + attribution + "</span>");
});