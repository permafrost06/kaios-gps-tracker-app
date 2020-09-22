if (!Array.prototype.last) {
  Array.prototype.last = function (n) {
    if (!n) n = 0;
    return this[this.length - 1 - n];
  };
};

function deg2rad(deg) {
  return deg * (Math.PI / 180)
}

function getDistance(TrackPoint1, TrackPoint2) {
  // haversine formula for getting distance from two TrackPoints
  var lat1 = TrackPoint1.lat, lon1 = TrackPoint1.lon,
    lat2 = TrackPoint2.lat, lon2 = TrackPoint2.lon;
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

function TrackPoint(Coordinates) { // the class name comes from gpx file notation
  // object that stores coordinates
  this.time = new Date();
  this.lat = Coordinates.latitude;
  this.lon = Coordinates.longitude;
  this.alt = Coordinates.altitude;
  this.accuracy = Coordinates.accuracy;
  this.altAccuracy = Coordinates.altitudeAccuracy;
}

function TrackSegment() { // the class name comes from gpx file notation
  // object that stores a series of Trackpoints which in turn creates a route
  this.startTime = new Date;
  this.trackPoints = [];
  this.distance = 0;
  this.getNewDistance = () => {
    // calculate distance between new trackpoint and the last one
    if (this.trackPoints.length > 1)
      return getDistance(this.trackPoints.last(), this.trackPoints.last(1));
    }
  this.addTrackPoint = (TrackPoint) => {
    this.trackPoints.push(TrackPoint);
    this.distance += this.getNewDistance();
  };
}