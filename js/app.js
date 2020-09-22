// DOMContentLoaded is fired once the document has been loaded and parsed,
// but without waiting for other external resources to load (css/images/etc)
// That makes the app more responsive and perceived as faster.
// https://developer.mozilla.org/Web/Reference/Events/DOMContentLoaded
window.addEventListener('DOMContentLoaded', function () {

  // We'll ask the browser to use strict code to help us catch errors earlier.
  // https://developer.mozilla.org/Web/JavaScript/Reference/Functions_and_function_scope/Strict_mode
  'use strict';

  var translate = navigator.mozL10n.get;

  // We want to wait until the localisations library has loaded all the strings.
  // So we'll tell it to let us know once it's ready.
  navigator.mozL10n.once(start);



  function start() {
    // We're using textContent because inserting content from external sources into your page using innerHTML can be dangerous.
    // https://developer.mozilla.org/Web/API/Element.innerHTML#Security_considerations

    var notification = navigator.mozNotification;
    
    var origgpxfile = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Endomondo.com" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd http://www.garmin.com/xmlschemas/GpxExtensions/v3 http://www.garmin.com/xmlschemas/GpxExtensionsv3.xsd http://www.garmin.com/xmlschemas/TrackPointExtension/v1 http://www.garmin.com/xmlschemas/TrackPointExtensionv1.xsd" xmlns="http://www.topografix.com/GPX/1/1" xmlns:gpxtpx="http://www.garmin.com/xmlschemas/TrackPointExtension/v1" xmlns:gpxx="http://www.garmin.com/xmlschemas/GpxExtensions/v3" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
<metadata>
<time>2019-11-15T07:45:47Z</time>
</metadata>
<trk>
<type>RUNNING</type>
<trkseg><trkpt>
</trkseg>
</trk>
</gpx>`
    var gpxfile = origgpxfile;

    // ---
    // geolocation start
    // ---

    var wakelock, id, oldLat, oldLon, distance = 0;

    function getDistance(lat1, lon1, lat2, lon2) {
      var R = 6371; // Radius of the earth in km
      var dLat = deg2rad(lat2 - lat1);  // deg2rad below
      var dLon = deg2rad(lon2 - lon1);
      var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c; // Distance in km
      return d;
    }

    function deg2rad(deg) {
      return deg * (Math.PI / 180)
    }

    var options = {
      enableHighAccuracy: true,
      timeout: 60000,
      maximumAge: 0
    };

    function poschange(pos) {
      var crd = pos.coords;

      if (crd.accuracy < 20) {
        if (oldLat && oldLon)
          distance += getDistance(oldLat, oldLon, crd.latitude, crd.longitude);

        oldLat = crd.latitude;
        oldLon = crd.longitude;

        var time = new Date().toISOString();
        gpxfile = gpxfile.replace("<trkpt>", `
<trkpt lat="${crd.latitude}" lon="${crd.longitude}">
<time>${time}</time>
</trkpt><trkpt>`);
      }

      var gpscoords = `<b>Current position</b><br>Lat: ${crd.latitude.toFixed(6)}<br>Long: ${crd.longitude.toFixed(6)} <br>Accuracy: ${crd.accuracy.toFixed(2)}m<br>Distance: ${(distance * 1000).toFixed(2)}m`;

      document.getElementById('message').innerHTML = gpscoords;
    }

    function success(pos) {
      var crd = pos.coords;

      if (crd.accuracy < 20) {
        oldLat = crd.latitude;
        oldLon = crd.longitude;
      }

      var gpscoords = '<b>Current position</b><br>Lat:' + crd.latitude.toFixed(6) + '<br>Long: ' + crd.longitude.toFixed(6) + '<br>Accuracy: ' + crd.accuracy.toFixed(2) + 'm';

      document.getElementById('message').innerHTML = gpscoords;
    }

    function error(err) {
      var errmsg = `ERROR(${err.code}): ${err.message}`;

      document.getElementById('message').innerHTML = errmsg;
    }

    // ---
    // geolocation end

    function stopNav() {
      gpxfile = gpxfile.replace("<trkpt>", "");
      var sdcard = navigator.getDeviceStorage("sdcard");
      var file = new Blob([gpxfile], { type: "application/gpx+xml" });
      gpxfile = origgpxfile;
      var filename;

      function pad2(n) { return n < 10 ? '0' + n : n }

      var date = new Date();

      filename = date.getFullYear().toString() + pad2(date.getMonth() + 1) + pad2(date.getDate()) + pad2(date.getHours()) + pad2(date.getMinutes()) + pad2(date.getSeconds());

      var request = sdcard.addNamed(file, `GPStrk/${filename}.gpx`);

      request.onsuccess = function () {
        var name = this.result;
        var saveMessage = notification.createNotification('File saved!', `${filename}.gpx`);
        saveMessage.show();
      }

      // An error typically occur if a file with the same name already exist
      request.onerror = function () {
        var errorMessage = notification.createNotification('Error saving file', `${this.error}`);
        errorMessage.show();
      }
    }

    // Softkey nav start
    // ---

    const softkeyCallback = {
      left: function () {
        stopNav();
      },
      center: function () {
        document.getElementById('message').innerHTML = "Getting GPS Coordinates...";
        navigator.geolocation.getCurrentPosition(success, error, options);
        wakeLock = window.navigator.requestWakeLock('gps');
        id = navigator.geolocation.watchPosition(poschange, error, options);
      },
      right: function () {
        navigator.geolocation.clearWatch(id);
        wakeLock.unlock();
        distance = 0;
        document.getElementById('message').innerHTML = "Tracking stopped";
      }
    };

    function handleKeyDown(evt) {
      switch (evt.key) {
        case 'ArrowLeft':
        case 'SoftLeft':
          return softkeyCallback.left();
        case 'ArrowRight':
        case 'SoftRight':
          return softkeyCallback.right();
        case 'Enter':
          return softkeyCallback.center();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
  }

  // ---
  // Softkey nav end
  // ---

});
