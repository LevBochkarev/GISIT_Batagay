
var map = L.map('map').setView([67.655, 134.63], 15);
var osm = L.tileLayer(`https://api.maptiler.com/maps/landscape-v4/{z}/{x}/{y}.png?key=YNbxHKHmz7g4hO5niSz9`, { //style URL
    tileSize: 512,
    zoomOffset: -1,
    minZoom: 10,
    maxZoom: 18,
    attribution: "\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e",
    crossOrigin: true
}).addTo(map);

var OSM_Mapnik = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href = "https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var Aerial = L.tileLayer('https://api.maptiler.com/maps/satellite-v4/{z}/{x}/{y}.jpg?key=YNbxHKHmz7g4hO5niSz9', {
    tileSize: 512,
    zoomOffset: -1,
    minZoom: 1,
    attribution: "\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e",
    crossOrigin: true
});

var osmb = new OSMBuildings(map).load('static/vector/buildings.geojson');

map.createPane('footprint');
map.getPane('footprint').style.zIndex = 300;

var markerStyle = {
    opacity: 0,
    fillOpacity: 0
};

var lineStyle = {
    color: '#664D20',
    weight: 1.5,
}

var polyStyle = {
    fillOpacity: 0,
    color : '#a42216'
}

fetch('static/vector/roads.geojson').then(res => res.json()).then(data => {
    L.geoJson(data, {
        pane: 'footprint',
        style: lineStyle
    }).addTo(map);

    //roads = L.geoJSON(data, { style: lineStyle }).addTo(map);
});

fetch('static/vector/buildings.geojson').then(res => res.json()).then(data => {
    L.geoJSON(data, {
        style: markerStyle,
        onEachFeature: function (feature, layer) {
            layer.bindPopup(feature.properties.OSM_TYPE);
        }
    }).addTo(map);
});

fetch('static/vector/border.geojson').then(res=>res.json()).then(data=>{
    L.geoJSON(data, {
        style: polyStyle
    }).addTo(map);
})

var no_ndvi = false
var layers = {}

var radios = document.getElementsByName('toggle_option');
for (var i = 0, max = radios.length; i < max; i++) {
    radios[i].onclick = function () {
        if(no_ndvi) return;
        for (layer in layers) {
            if (map.hasLayer(layers[layer])) {
            //alert(['on map ',layer])
                map.removeLayer(layers[layer]);
            }
            //layers[layer].setOpacity(0.0);
            //map.removeLayer(layers[layer]);
        }
        //map.removeLayer(GeoRasterLayer.getActiveTiles())
        //alert(this.value)
        layers[this.value].addTo(map);
        //map.fitBounds(layers[this.value].getBounds())
        //layers[this.value].setOpacity(0.7);
    }
}

var ndvi_button = document.getElementById('ndviToggle');
ndvi_button.onclick = toggleNDVI;

function toggleNDVI(){
    if(no_ndvi){
        no_ndvi = false
    }
    else{
        for(layer in layers){
            map.removeLayer(layers[layer])
        }
        no_ndvi = true
    }
    
}

function getNDVI(date) {
    var gtiff_url = 'static/raster/ndvi/' + date + '.tif'
    fetch(gtiff_url)
        .then(response => response.arrayBuffer()).then()
        .then(arrayBuffer => {
            parseGeoraster(arrayBuffer).then(georaster => {
                layers[date] = new GeoRasterLayer({
                    georaster: georaster,
                    opacity: 0.7,
                    resolution : 64,
                    updateWhenZooming : true,
                    caching : false,
                    pixelValuesToColorFn: function (value) {
                        if (value < -0.2) {
                            return '#000'
                        }
                        else if (value <= 0) {
                            return '#a50026'
                        }
                        else if (value <= 0.1) {
                            return '#d73027'
                        }
                        else if (value <= 0.2) {
                            return '#f46d43'
                        }
                        else if (value <= 0.3) {
                            return '#fdae61'
                        }
                        else if (value <= 0.4) {
                            return '#fee08b'
                        }
                        else if (value <= 0.5) {
                            return '#ffffbf'
                        }
                        else if (value <= 0.6) {
                            return '#d9ef8b'
                        }
                        else if (value <= 0.7) {
                            return '#a6d96a'
                        }
                        else if (value <= 0.8) {
                            return '#66bd63'
                        }
                        else if (value <= 0.9) {
                            return '#1a9850'
                        }
                        else if (value <= 1.0) {
                            return '#006837'
                        }
                    }
                });
                //layers[date].addTo(map);
            });
        });
}

getNDVI('2025-05-23');
getNDVI('2025-05-28');
getNDVI('2025-06-19');

var baseMaps = {
    'Landscape': osm
    // 'OSM': OSM_Mapnik,
    // 'Спутник': Aerial
};

var overlayMaps = {
    'Здания': osmb,
};

// var NDVI = {

// }

// var layer = L.leafletGeotiff('static/raster/batagay_ndvi.tif', {
//     renderer: new L.LeafletGeotiff.plotty({})
// }).addTo(map);

L.control.layers(baseMaps, overlayMaps).addTo(map);
