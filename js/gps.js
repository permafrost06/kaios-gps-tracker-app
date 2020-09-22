const ACCURACY_THRESHOLD = 200000;

var tracker, wakeLock, gpsLock;

var options = {
  enableHighAccuracy: true,
  timeout: 60000,
  maximumAge: 0
};

function posChange(pos) {
  var crd = pos.coords;
  if (crd.accuracy < ACCURACY_THRESHOLD) {
    var trkpt = new TrackPoint(pos.coords);
    tracker.addTrackPoint(trkpt);
  }

  document.getElementById('message').textContent = tracker.distance;
}

function GPSError(err) {
  var errmsg = `ERROR(${err.code}): ${err.message}`;
  document.getElementById('message').innerHTML = errmsg;
}

const stopTracking = () => {
  navigator.geolocation.clearWatch(gpsLock);
  wakeLock.unlock();
  document.getElementById('message').innerHTML = "Tracking stopped";
  // save route to storage
  // saveRoute(tracker);
  map = displayMap(tracker, 'map');
};

const startTracking = () => {
  document.getElementById('message').textContent = "Waiting for better GPS signal...";
  wakeLock = window.navigator.requestWakeLock('gps');
  gpsLock = navigator.geolocation.watchPosition(posChange, GPSError, options);
  tracker = new TrackSegment();
};

// const saveFile = TrackSegment => {
//   gpxFile = createGPXFile(TrackSegment);
//   var filename = TrackSegment.startTime.toISOString();

//   var request = sdcard.addNamed(file, `GPStrk/${filename}.gpx`);

//   request.onsuccess = function () {
//     notify('File saved!', `${filename}.gpx`);
//   }

//   request.onerror = function () {
//     notify('Error saving file', `${this.error}`);
//   }
// };