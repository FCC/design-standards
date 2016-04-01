L.mapbox.accessToken = 'pk.eyJ1IjoiY29tcHV0ZWNoIiwiYSI6InMyblMya3cifQ.P8yppesHki5qMyxTc2CNLg';
var map = L.mapbox.map('map-container', 'fcc.k74ed5ge', {
        attributionControl: true,
        maxZoom: 15,
        minZoom: 3
    })
    .setView([38.82, -94.96], 4);

baseStreet = L.mapbox.tileLayer('fcc.k74ed5ge').addTo(map);
baseSatellite = L.mapbox.tileLayer('fcc.k74d7n0g');
baseTerrain = L.mapbox.tileLayer('fcc.k74cm3ol');

map.attributionControl.addAttribution('<a href="#void">FCC [Name of Map]</a>');

L.control.layers({
        'Street': baseStreet.addTo(map),
        'Satellite': baseSatellite,
        'Terrain': baseTerrain
    },
    null, {
        position: 'topleft'
    }
).addTo(map);

L.control.scale({
    position: 'bottomright'
}).addTo(map);

geocoder = L.mapbox.geocoder('mapbox.places-v1');


var geo_host = "//www.broadbandmap.gov";
var geo_space = "fcc";

var clickedCountyLayer;
var clickedBlockLayer;
var clickedBlock_fips;
var countyLayerData = { "features": [] };
var locationMarker;

var clickedCountyStyle = { color: "#00f", opacity: 0.5, fillOpacity: 0.1, fillColor: "#fff", weight: 3 };
var clickedBlockStyle = { color: "#000", opacity: 0.5, fillOpacity: 0.1, fillColor: "#fff", weight: 3 };

$('#btn-nationLocation').on("click", function() {
    //map.fitBounds(bounds_us);
    map.setView([38.82, -94.96], 4);
});


$('#input-loc-search').on("click", function(e) {
    e.preventDefault();
    locChange();
});

$('#input-latlon-decimal-search').on("click", function(e) {
    e.preventDefault();
    search_decimal();
});

$('#input-search-switch').on('click', 'a', function(e) {
    var search = $(e.currentTarget).data('value');

    e.preventDefault();

    if (search == 'loc') {
        $('#input-latlon-dms').css('display', 'none');
        $('#span-latlon-dms-search').css('display', 'none');
        $('#input-latlon-decimal').css('display', 'none');
        $('#span-latlon-decimal-search').css('display', 'none');

        $('#input-location').css('display', 'block');
        $('#span-location-search').css('display', 'table-cell');
        $('#btn-label').text('Address');
    } else if (search == 'latlon-dms') {
        $('#input-location').css('display', 'none');
        $('#span-location-search').css('display', 'none');
        $('#input-latlon-decimal').css('display', 'none');
        $('#span-latlon-decimal-search').css('display', 'none');

        $('#input-latlon-dms').css('display', 'block');
        $('#span-latlon-dms-search').css('display', 'table-cell');
        $('#btn-label').text('Lat/lon (DMS)');
    } else if (search == 'latlon-decimal') {
        $('#input-location').css('display', 'none');
        $('#span-location-search').css('display', 'none');
        $('#input-latlon-dms').css('display', 'none');
        $('#span-latlon-dms-search').css('display', 'none');

        $('#input-latlon-decimal').css('display', 'block');
        $('#span-latlon-decimal-search').css('display', 'table-cell');
        $('#btn-label').text('Coordinates');
    }

});

$('#input-location').keypress(function(e) {
    var key = e.which;
    if (key === 13) // the enter key code
    {
        $('#input-loc-search').click();
        return false;
    }
});


$('#lat-deg, #lon-deg, #lat-min, #lon-min, #lat-sec, #lon-sec, #select-ns, #select-ew').keypress(function(e) {
    var key = e.which;
    if (key === 13) // the enter key code
    {
        $('#input-latlon-dms-search').click();
        return false;
    }
});


$('#latitude, #longitude').keypress(function(e) {
    var key = e.which;
    if (key === 13) // the enter key code
    {
        $('#input-latlon-decimal-search').click();
        return false;
    }
});

$('#btn-geoLocation').click(function(event) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var geo_lat = position.coords.latitude;
            var geo_lon = position.coords.longitude;
            var geo_acc = position.coords.accuracy;

            geo_lat = Math.round(geo_lat * 1000000) / 1000000.0;
            geo_lon = Math.round(geo_lon * 1000000) / 1000000.0;
            locationLat = geo_lat;
            locationLon = geo_lon;

            fetchCounty(geo_lat, geo_lon);
            setTimeout(function() {
                fetchBlock(geo_lat, geo_lon)
            }, 200);

        }, function(error) {
            //alert('Error occurred. Error code: ' + error.code);           
            alert('Sorry, your current location could not be found. \nPlease use the search box to enter your location.');
        }, {
            timeout: 4000
        });
    } else {
        alert('Sorry, your current location could not be found. \nPlease use the search box to enter your location.');
    }

    return false;
});

function fetchCounty(lat, lng) {

    //var url = geo_host + "/geoserver/" + geo_space + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + geo_space + ":bpr_county&maxFeatures=1&outputFormat=text/javascript&cql_filter=contains(geom,%20POINT(" + lng + " " + lat + "))";
    var url = geo_host + '/geoserver/' + geo_space + '/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=' + geo_space + ":bpr_county&maxFeatures=1&outputFormat=json&cql_filter=contains(geom,%20POINT(" + lng + " " + lat + "))" + "&format_options=callback:parseResponse";


    //remove county layer
    if (map.hasLayer(clickedCountyLayer)) {
        map.removeLayer(clickedCountyLayer);
    }

    $.ajax({
        type: 'GET',
        url: url,
        dataType: 'jsonp',
        jsonpCallback: 'parseResponse',
        success: function(data) {

            if (data.features.length === 0) {
                var county_text = 'No county data found at your searched/clicked location.';
                $('#display-county').html(county_text);
                return;
            }

            var id = data.features[0].id.replace(/\..*$/, '');
            //console.log('county: ' + id); 

            if (id !== 'bpr_county') {
                return;
            }

            if (map.hasLayer(clickedCountyLayer)) {
                map.removeLayer(clickedCountyLayer);
            }
            // clickedCountyLayer = L.mapbox.featureLayer(data).setStyle(clickedCountyStyle).addTo(map);
            clickedCountyLayer = L.mapbox.featureLayer(data).setStyle(clickedCountyStyle);
            if (countyLayerData.features.length === 0 || countyLayerData.features[0].properties.county_fips !== data.features[0].properties.county_fips) {
                map.fitBounds(clickedCountyLayer.getBounds());
            }
            clickedCountyLayer.on('click', function(e) {
                clickedMap(e);
            });

            //get county info

            var a = addComma(12345678.998);

            var p = data.features[0].properties;
            var urbanunscent = Math.round(p.urbanunscent * 100 * 10) / 10;
            var ruralunscent = Math.round(p.ruralunscent * 100 * 10) / 10;
            var density1 = parseFloat(p.allden);
            if (density1 > 10) {
                var density = Math.round(density1);
            } else {
                var density = Math.round(density1 * 100) / 100;
            }

            /*var text = "<span class=\"county-name\">" + p.county_name + ", " + p.state_abbr + "</span><p><p>";

            text += "<table width=100% class=\"county-table\">";
            text += "<tr><td>Total Population:</td><td class=\"td-value\"> " + addComma(p.alltotalpop) + "</td></tr>" +
                "<tr><td>Pop Density (pop/mi<sup>2</sup>):</td><td class=\"td-value\"> " + addComma(density) + "</td></tr>" +
                "<tr><td>Per Capita Income: </td><td class=\"td-value\">" + "$" + addComma(p.percapinc) + "</td></tr>" +
                "<tr><td>Total Pop w/o Access: </td><td class=\"td-value\">" + addComma(p.allunspop) + "</td></tr>" +
                "<tr><td>Percent Urban Pop w/o Access: </td><td class=\"td-value\">" + urbanunscent + "%</td></tr>" +
                "<tr><td>Percent Rural Pop w/o Access: </td><td class=\"td-value\">" + ruralunscent + "%</td></tr>";


            text += "</table>";*/

            // $('#display-county').html(text);
            countyLayerData = data;

        }
    });

}

function fetchBlock(lat, lng) {

    //var url = geo_host + "/geoserver/" + geo_space + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + geo_space + ":bpr_block_layer&maxFeatures=1&outputFormat=text/javascript&cql_filter=contains(geom,%20POINT(" + lng + " " + lat + "))";
    var url = geo_host + "/geoserver/" + geo_space + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + geo_space + ":bpr_block_layer&maxFeatures=1&outputFormat=json&cql_filter=contains(geom,%20POINT(" + lng + " " + lat + "))" + "&format_options=callback:parseResponse";

    $.ajax({
        type: "GET",
        url: url,
        dataType: "jsonp",
        jsonpCallback: "parseResponse",
        success: function(data) {

            if (data.features.length == 0) {
                var block_text = "No block data found at your searched/clicked location.";
                $('#display-block').html(block_text);
                return;
            }

            var id = data.features[0].id.replace(/\..*$/, "");
            if (id != "bpr_block_layer") {
                return;
            }

            clickedBlockLayerData = data;

            var block_fips = data.features[0].properties.block_fips;
            clickedBlock_fips = block_fips;

            if (map.hasLayer(clickedBlockLayer)) {
                map.removeLayer(clickedBlockLayer);
            }
            clickedBlockLayer = L.mapbox.featureLayer(clickedBlockLayerData).setStyle(clickedBlockStyle).addTo(map);

            //map.fitBounds(clickedBlockLayer.getBounds());
            clickedBlockLayer.on("click", function(e) {
                clickedMap(e);
            });
            setLocationMarker(locationLat, locationLon);

            var url = geo_host + "/geoserver/" + geo_space + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + geo_space + ":bpr_block_info&maxFeatures=100&outputFormat=text/javascript&cql_filter=block_fips='" + block_fips + "'";
            var url = geo_host + "/geoserver/" + geo_space + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + geo_space + ":bpr_block_info&maxFeatures=100&outputFormat=json&cql_filter=block_fips='" + block_fips + "'" + "&format_options=callback:parseResponse";

        }
    });

}

function setLocationMarker(lat, lon) {
    if (map.hasLayer(locationMarker)) {
        map.removeLayer(locationMarker);
    }
    locationMarker = L.marker([lat, lon], { title: "" }).addTo(map);
    locationMarker.on("click", function(e) {
        zoomToBlock(e);
    });
}

function addComma(a) {
    var a = "" + a;
    if (a.length == 0) {
        return a;
    }

    var decimal_part = "";
    var integer_part = a;
    if (a.match(/\./)) {
        integer_part = a.split(".")[0];
        decimal_part = a.split(".")[1];
    }

    var len = integer_part.length;
    var str = "";
    for (var i = 0; i < len; i++) {
        if ((len - i - 1) % 3 == 0 && (len - i - 1) > 0) {
            str += integer_part[i] + ",";
        } else {
            str += integer_part[i];
        }
    }

    var ret = str;
    if (decimal_part != "") {
        var ret = str + "." + decimal_part
    }

    return ret;
}

$('#input-location').autocomplete({
    source: function(request, response) {
        var location = request.term;
        geocoder.query(location, processAddress);

        function processAddress(err, data) {

            var f = data.results.features;
            var addresses = [];
            for (var i = 0; i < f.length; i++) {
                addresses.push(f[i].place_name);
            }
            response(addresses);

        }
    },
    minLength: 3,
    select: function(event, ui) {
        setTimeout(function() { searchLocation(); }, 200);
    },
    open: function() {
        $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
    },
    close: function() {
        $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
    }
});

function search_decimal() {

    var lat = $('#latitude').val().replace(/ +/g, "");
    var lon = $('#longitude').val().replace(/ +/g, "");

    if (lat == "" || lon == "") {
        alert("Please enter lat/lon");
        return;
    }

    if (Math.abs(lat) > 90 || Math.abs(lon) > 180) {
        alert("Lat/Lon values out of range");
        return;
    }


    removeBlockCountyLayers();

    locationLat = lat;
    locationLon = lon;
    fetchCounty(lat, lon);
    setTimeout(function() { fetchBlock(lat, lon) }, 200);

}

function locChange() {

    removeBlockCountyLayers();

    var loc = $('#input-location').val();
    geocoder.query(loc, codeMap);

    function codeMap(err, data) {

        if (data.results.features.length == 0) {
            alert("No results found");
            return;
        }
        var lat = data.latlng[0];
        var lon = data.latlng[1];
        locationLat = lat;
        locationLon = lon;

        fetchCounty(lat, lon);
        setTimeout(function() { fetchBlock(lat, lon) }, 200);

    }
}


function searchLocation() {
    locChange();

}

function removeBlockCountyLayers() {
    if (map.hasLayer(clickedCountyLayer)) {
        map.removeLayer(clickedCountyLayer);
    }
    if (map.hasLayer(clickedBlockLayer)) {
        map.removeLayer(clickedBlockLayer);
    }
    if (map.hasLayer(locationMarker)) {
        map.removeLayer(locationMarker);
    }
}
