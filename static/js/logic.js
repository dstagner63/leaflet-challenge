
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
        console.log(d.geometry.coordinates[2]);
        var coordinates = d.geometry.coordinates;
        var latLng = L.latLng(coordinates[1], coordinates[0]);
        var radius = (d.properties.mag/maxMag) * 150000 + 10000;
        L.circle(latLng, {
            fillOpacity: 1,
            stroke: true,
            color: "black",
            fillColor: getColor(coordinates[2]),
            radius: radius
        }).addTo(map).bindPopup("Magnitude: " + d.properties.mag + "<br>Depth: " + d.geometry.coordinates[2]);
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




