
L.mapbox.accessToken = API_KEY;
var map = L.map('map').setView([39.8283, -98.5795], 5);

// Add tiles from the Mapbox Static Tiles API
// (https://docs.mapbox.com/api/maps/#static-tiles)
// Tiles are 512x512 pixels and are offset by 1 zoom level
L.tileLayer(
    'https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=' + L.mapbox.accessToken, {
        tileSize: 512,
        zoomOffset: -1,
        attribution: '© <a href="https://apps.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

d3.json("data/earthquakes.json", function(data) {
    console.log(data);
    var maxMag = data.features.map((d) => {
        return +d.properties.mag;
    }).reduce(function (a,b) {
        return Math.max(a,b);
    });
    data.features.forEach((d) => {
        var coordinates = d.geometry.coordinates;
        var latLng = L.latLng(coordinates[1], coordinates[0]);
        var radius = (d.properties.mag/maxMag) * 150000 + 10000;
        L.circle(latLng, {
            stroke: false,
            color: getColor(d.properties.mag),
            fillColor: getColor(d.properties.mag),
            radius: radius
        }).addTo(map);
    });

})

const getColor = (magnitude) => {
    return magnitude > 5.5 ? "#d73027":
    magnitude > 5 ? "#fc8d59":
    magnitude > 4.5 ? "#fee08b":
    magnitude > 4 ? "#ffffbf":
    magnitude > 3.5 ? "#d9ef8b":
    magnitude > 3 ? "#91cf60":
    "#1a9850";
}




