var displayMap = (TrackPoint, mapid) => {
  var map = L.map(mapid, {
    center: [TrackPoint.lat, TrackPoint.lon],
    zoom: 15,
    zoomControl: false
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  return map;
}

var displayRoute = (TrackSegment, map) => {
  var polyline = [];

  TrackSegment.trackPoints.forEach(function (item) {
    polyline.push([item.lat, item.lon]);
  })

  L.polyline(polyline).addTo(map);
}

var addMarker = (TrackPoint, map) => L.marker([TrackPoint.lat, TrackPoint.lon]).addTo(map)