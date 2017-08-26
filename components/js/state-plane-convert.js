//   convert texas central state plane coordinates to wgs 84
function sp_to_wgs84(x,y) {
    var metertoft = 3.280839895
    var invf = 298.25722210100002
    var angrad = 0.017453292519943299 //  number of radians in a degree
    var x0 = 2296583.333333 //  False easting of central meridian, map units
    var y0 = 9842500.000000 //  False northing
    var pi = 3.14159265358979
    
    //  BEGIN
    var statex = x
    var  statey = y
    var ec = Math.sqrt((1 / invf) * (2 - (1 / invf))) //  eccentricity of ellipsoid (NAD 83)

    var a = 6378137.0 * metertoft //  major radius of ellipsoid, map units (NAD 83)
    var b = 6356752.3141403561 * metertoft
    var p0 = 29.666667 * angrad //  latitude of origin
    var p1 = 30.116667 * angrad //  latitude of first standard parallel
    var p2 = 31.883333 * angrad //  latitude of second standard parallel
    var m0 = -100.333333 * angrad //  central meridian

    //  Calculate the coordinate system constants.
    var m1 = Math.cos(p1) / Math.sqrt(1 - (Math.pow(ec, 2)) * Math.pow(Math.sin(p1), 2))
    var m2 = Math.cos(p2) / Math.sqrt(1 - (Math.pow(ec, 2)) * Math.pow(Math.sin(p2), 2))
    var t0 = Math.tan(pi / 4 - (p0 / 2))
    var t1 = Math.tan(pi / 4 - (p1 / 2))
    var t2 = Math.tan(pi / 4 - (p2 / 2))

    t0 = t0 / Math.pow(((1 - (ec * (Math.sin(p0)))) / (1 + (ec * (Math.sin(p0))))), ec / 2)
    t1 = t1 / Math.pow(((1 - (ec * (Math.sin(p1)))) / (1 + (ec * (Math.sin(p1))))), ec / 2)
    t2 = t2 / Math.pow(((1 - (ec * (Math.sin(p2)))) / (1 + (ec * (Math.sin(p2))))), ec / 2)

    var n = Math.log10(m1 / m2) / Math.log10(t1 / t2)
    var f = m1 / (n * Math.pow(t1, n))
    var rho0 = a * f * Math.pow(t0, n)

    //  Convert the coordinate to Latitude/Longitude.
    //  Calculate the Longitude.
    var ux = statex - x0
    var uy = statey - y0

    var rho = Math.sqrt(Math.pow(ux, 2) + Math.pow((rho0 - uy), 2))

    var theta = Math.atan(ux / (rho0 - uy))
    var txy = Math.pow((rho / (a * f)), (1 / n))
    var lon0 = (theta / n) + m0
    ux = ux + x0

    //  Estimate the Latitude
    var lat0 = pi / 2 - (2 * Math.atan(txy))

    //  Substitute the estimate into the iterative calculation that
    //  converges on the correct Latitude value.

    var part1 = (1 - (ec * Math.sin(lat0))) / (1 + (ec * Math.sin(lat0)))

    var lat1 = pi / 2 - (2 * Math.atan(txy * Math.pow(part1, (ec / 2))))

    while ((Math.abs(lat1 - lat0)) > 0.000000002) {
        lat0 = lat1
        part1 = (1 - (ec * Math.sin(lat0))) / (1 + (ec * Math.sin(lat0)))
        lat1 = pi / 2 - (2 * Math.atan(txy * Math.pow(part1, (ec / 2))))
    }

    //  Convert from radians to degrees.
    var lat = lat1 / angrad
    var lon = lon0 / angrad
    
    return { 'lat' : lat, 'lon' : lon }
}










