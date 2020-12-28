
L.mapbox.accessToken = API_KEY;
var map = L.map('map').setView([39.8283, -98.5795], 5);

var streets = L.tileLayer(
    'https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=' + L.mapbox.accessToken, {
        tileSize: 512,
        zoomOffset: -1,
        attribution: '© <a href="https://apps.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

var dark = L.tileLayer(
    'https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token=' + L.mapbox.accessToken, {
        tileSize: 512,
        zoomOffset: -1,
        attribution: '© <a href="https://apps.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

var satellite = L.tileLayer(
    'https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token=' + L.mapbox.accessToken, {
        tileSize: 512,
        zoomOffset: -1,
        attribution: '© <a href="https://apps.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

var outdoors = L.tileLayer(
    'https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/tiles/{z}/{x}/{y}?access_token=' + L.mapbox.accessToken, {
        tileSize: 512,
        zoomOffset: -1,
        attribution: '© <a href="https://apps.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

var baseMaps = {
    "Streets": streets,
    "Dark": dark,
    "Satellite": satellite,
    "Outdoor": outdoors
}
// Setting up group layers
var quakes = L.layerGroup([]);
var plates = L.layerGroup([]);

d3.json("data/earthquakes.json", function(data) {
    console.log(data);
    var maxMag = data.features.map((d) => {
        return +d.properties.mag;
    }).reduce(function (a,b) {
        return Math.max(a,b);
    });
    data.features.forEach((d) => {
        console.log(d.geometry.coordinates[2]);
        var coordinates = d.geometry.coordinates;
        var latLng = L.latLng(coordinates[1], coordinates[0]);
        var radius = (d.properties.mag/maxMag) * 150000 + 10000;
        var point = L.circle(latLng, {
            fillOpacity: 1,
            stroke: true,
            color: "black",
            fillColor: getColor(coordinates[2]),
            radius: radius
        }).bindPopup("Magnitude: " + d.properties.mag + "<br>Depth: " + d.geometry.coordinates[2]);
        quakes.addLayer(point)
    });

    var legend = L.control({position: "bottomright"});
    legend.onAdd = function (map) {
        var div = L.DomUtil.create("div", "info legend"), 
            depths = [-10, 10, 30, 50, 70, 90],
            labels = [];
        for (var i = 0; i < depths.length; i++) {
            div.innerHTML += '<i style="background:' + getColor(depths[i] + 1) + '"></i>' + 
                depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
        }
        return div;
    }
    legend.addTo(map)
    quakes.addTo(map);
})

const getColor = (depth) => {
    return depth > 90 ? "#d73027":
    depth > 70 ? "#fc8d59":
    depth > 50 ? "#fee08b":
    depth > 30 ? "#ffffbf":
    depth > 10 ? "#d9ef8b":
    depth > -10 ? "#91cf60":
    "#1a9850";
}

d3.json("data/PB2002_boundaries.json", function(bdata)  {
    console.log(bdata);
    bdata.features.forEach(function (feature){
        var coordinates = feature.geometry.coordinates;
        coordinates = coordinates.map(function (coordinate){
            return L.latLng(coordinate[1], coordinate[0]);
        });
        var line = L.polyline(coordinates, {color: "red"});
        plates.addLayer(line);
    });
});
var overlayMaps = {
    "Quakes": quakes,
    "Plates": plates
};
console.log(overlayMaps);
L.control.layers(baseMaps, overlayMaps).addTo(map);

