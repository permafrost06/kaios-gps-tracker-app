var notify = (heading, subtitle) => {
  var notification = navigator.mozNotification.createNotification(heading, subtitle);
  notification.show();
}

document.getElementById('message').textContent = 'Press "Start" to begin tracking';

var initMap;

// display initial map
navigator.geolocation.getCurrentPosition( function (pos) {
  var initPoint = new TrackPoint(pos.coords);
  initMap = displayMap(initPoint, 'map');
  addMarker(initPoint, initMap);
});

document.addEventListener("keydown", event => {
  switch (event.key) {
    case "Enter":
      console.log("enter");
      return startTracking();
    case "ArrowRight":
    case "SoftRight":
      console.log("right");
      return stopTracking();
    case "ArrowLeft":
    case "SoftLeft":
      console.log("left");
      return saveFile();
    case "1":
      if (map) return map.zoomOut();
    case "3":
      if (map) return map.zoomIn();
    case "6":
      if (map) return map.panBy([50, 0]);
    case "4":
      if (map) return map.panBy([-50, 0]);
    case "8":
      if (map) return map.panBy([0, 50]);
    case "2":
      if (map) return map.panBy([0, -50]);
    default:
      return;
  }
});