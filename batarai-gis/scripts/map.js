// async function getData(url) {
//   try {
//     const response = await fetch(url);
//     if (!response.ok) { // Check for HTTP errors like 404 or 500
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }
//     const data = await response.json(); // Parse body as JSON
//     console.log(data);
//     return data;
//   } catch (error) {
//     console.error('Fetch error:', error);
//   }
// }


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
    fillOpacity: 0.2,
    color : '#a42216'
}

var borderStyle = {
    fillOpacity: 0.0,
    color : '#c47418'
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
        style: borderStyle,
        pane : 'footprint'
    }).addTo(map);
})

var no_ndvi = false
var layers = {}

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

months = {
    1: "Январь",
    2: "Февраль",
    3: "Март",
    4: "Апрель",
    5: "Май",
    6: "Июнь",
    7: "Июль",
    8: "Август",
    9: "Сентябрь",
    10: "Октябрь",
    11: "Ноябрь",
    12: "Декабрь"
}

function getNDVI(date) {
    var gtiff_url = 'static/raster/ndvi/' + date + '.tif'
    fetch(gtiff_url)
        .then(response => response.arrayBuffer()).then()
        .then(arrayBuffer => {
            parseGeoraster(arrayBuffer).then(georaster => {
                layers[date] = new GeoRasterLayer({
                    georaster: georaster,
                    pane : 'footprint',
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
                layers[date].addTo(map);
            });
        });
    //  document.getElementById("radio_wrapper").insertAdjacentHTML("beforeend",
    //      `
    //      <input type="radio" class="toggle_option" name="toggle_option" value=${date}>
    //      <label for="first_toggle">
    //          <span class="description">${months[Number(date.slice(5,7))]}</span>
    //          <p class="day">${date.slice(-2)} </p>
    //          <span class="day-week">${date.slice(0,4)}</span>
    //      </label>
    //      `
        
    //  );
     //document.getElementsByName('toggle_option')[0].checked = true;
    // //alert(date.slice(-2)+date.slice(0,4)+months[Number(date.slice(5,7))]);
}

// getNDVI('2024-06-07');
// getNDVI('2024-06-09');
// getNDVI('2024-06-22');
 getNDVI('2025-05-23');
 getNDVI('2025-05-28');
 getNDVI('2025-06-19');
// getNDVI('2025-06-22');
// getNDVI('2025-07-09');

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

var cadastr = new L.geoJSON(null, {
    pane: 'footprint',
    style: polyStyle,
    onEachFeature: function (feature, layer) {
        layer.bindPopup(
            'Кадастровый номер: '+ feature.properties.CAD_N + '<br>' +
            'Кадастровая стоимость: ' + feature.properties.C_COST + '<br>'+
            'Площадь участка: ' + feature.properties.AREA + '<br>'+
            'Назначение: ' + feature.properties.UTL_DOC
        );
    }
});

fetch('static/vector/cadastr.geojson').then(res => res.json()).then(data => {
    cadastr.addData(data);
})

var baseMaps = {
    'Landscape': osm,
    'OSM': OSM_Mapnik,
    'Спутник': Aerial
};

var overlayMaps = {
    'Здания': osmb,
    'Кадастровые участки' : cadastr
};

L.control.layers(baseMaps, overlayMaps).addTo(map);
