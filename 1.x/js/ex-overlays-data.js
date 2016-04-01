var commonFeatures = {
    'type': 'FeatureCollection',
    'features': [{ //Example polygon with no fill
        'type': 'Feature',
        'properties': {
            'fillColor': 'none'
        },
        'geometry': {
            'type': 'Polygon',
            'coordinates': [
                [
                    [-77.000543, 38.890900],
                    [-77.000543, 38.889856],
                    [-76.999545, 38.889855],
                    [-76.999545, 38.890904],
                    [-77.000543, 38.890900]
                ]
            ]
        }
    }, { // Example polygon with opacity
        'type': 'Feature',
        'properties': {
            'color': '#33ccff',
            'fillColor': '#33ccff',
            'fillOpacity': .2,
            'stroke': 'none'
        },
        'geometry': {
            'type': 'Polygon',
            'coordinates': [
                [
                    [-76.999474, 38.890900],
                    [-76.999474, 38.889856],
                    [-76.998504, 38.889855],
                    [-76.998504, 38.890909],
                    [-76.999474, 38.890904]
                ]
            ]
        }
    }]
};

var polygonFill = { // Example polygon with yellow solid fill
    'type': 'Feature',
    'properties': {
        'color': '#FFE773',
        'fillColor': '#FFE773',
        fillOpacity: 1,
        'stroke': '#FFE773'
    },
    'geometry': {
        'type': 'Polygon',
        'coordinates': [
            [
                [-76.998383, 38.890900],
                [-76.998383, 38.889860],
                [-76.996208, 38.889855],
                [-76.996208, 38.890909],
                [-76.998383, 38.890900]
            ]
        ]
    }
};

var thinLine = { // Example thin line
    'type': 'Feature',
    'properties': {
        'stroke': '#9900cc',
        'weight': 5
    },
    'geometry': {
        'type': 'LineString',
        'coordinates': [
            [-76.996173, 38.889715],
            [-76.996173, 38.887945]
        ]
    }
};

var thickLine = { // Example thick line
    "type": "FeatureCollection",
    "features": [{
        "type": "Feature",
        "properties": {
            'stroke': '#FF8C00',
            'stroke-width': 10
        },
        "geometry": {
            'type': 'LineString',
            'coordinates': [
                [-77.002031, 38.888680],
                [-76.998448, 38.888680]
            ]
        }
    }]
};

var defaultMarker = { // Example marker
    'type': 'Feature',
    'properties': {
        'marker-color': '#00ff00'
    },
    'geometry': {
        'type': 'Point',
        'coordinates': [-76.997311, 38.889223]
    }
};

var customIcon = L.icon({
    iconUrl: '/design-standards/1.x/images/maki-icons/theatre-18@2x.png',
    'iconSize': [50, 50], // size of the icon
    'iconAnchor': [15, 45], // point of the icon which will correspond to marker's location
    'popupAnchor': [0, -25] // point from which the popup should open relative to the iconAnchor
});

var customMarker = { // Example marker with custom icon
    'type': 'Feature',    
    'geometry': {
        'type': 'Point',
        'coordinates': [-77.00280, 38.889513]
    }
};

var circlePointer = { // Example circle marker
    'type': 'Feature',    
    'geometry': {
        'type': 'Point',
        'coordinates': [-77.001589, 38.889275]
    }
};
