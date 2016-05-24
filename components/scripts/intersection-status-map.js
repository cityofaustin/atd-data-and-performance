
var map = new L.Map("map", {center : [30.28, -97.735], zoom : 11, minZoom : 1, maxZoom : 20});      // make a map
        
var Stamen_TonerLite = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
    attribution : 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains : 'abcd',
    minZoom : 0,
    maxZoom : 20,
    ext : 'png'
}).addTo(map);