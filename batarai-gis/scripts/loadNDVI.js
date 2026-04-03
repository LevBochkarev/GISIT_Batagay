// var layers = {}

// var radios = document.getElementsByName('toggle_option');
// for(var i = 0, max = radios.length; i < max; i++) {
//     radios[i].onclick = function() {
//         for(layer in layers){
//             layers[layer].setOpacity(0.0);
//         }
//         layers[this.value].setOpacity(0.7)
//     }
// }

// function clearNDVI(){
//     layers = {};
// }

// function getNDVI(date) {
//     var gtiff_url = 'static/raster/ndvi/' + date + '.tif'
//     fetch(gtiff_url)
//         .then(response => response.arrayBuffer()).then()
//         .then(arrayBuffer => {
//             parseGeoraster(arrayBuffer).then(georaster => {
//                 layers[date.toString()] = new GeoRasterLayer({
//                     georaster: georaster,
//                     opacity: 0.0,
//                     pixelValuesToColorFn: function (value) {
//                         if (value < -0.2) {
//                             return '#000'
//                         }
//                         else if (value <= 0) {
//                             return '#a50026'
//                         }
//                         else if (value <= 0.1) {
//                             return '#d73027'
//                         }
//                         else if (value <= 0.2) {
//                             return '#f46d43'
//                         }
//                         else if (value <= 0.3) {
//                             return '#fdae61'
//                         }
//                         else if (value <= 0.4) {
//                             return '#fee08b'
//                         }
//                         else if (value <= 0.5) {
//                             return '#ffffbf'
//                         }
//                         else if (value <= 0.6) {
//                             return '#d9ef8b'
//                         }
//                         else if (value <= 0.7) {
//                             return '#a6d96a'
//                         }
//                         else if (value <= 0.8) {
//                             return '#66bd63'
//                         }
//                         else if (value <= 0.9) {
//                             return '#1a9850'
//                         }
//                         else if (value <= 1.0) {
//                             return '#006837'
//                         }
//                     }
//                 });
//                 alert(layers[date.toString()])
//                 return layers[date.toString()];
//             });
//         });
// }
