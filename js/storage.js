var saveRoute = (TrackSegment) => localforage.setItem(TrackSegment.startTime.toISOString(), JSON.stringify(TrackSegment)).then(function (value) {
    notify("Saved!", "Route saved successfully");
    return value;
}).catch(function (err) {
    notify("Could not save route", err);
});

var listAllRoutes = () => localforage.iterate(function (value, key, iterationNumber) {
    var allRoutes = [];
    JSON.parse(value);
}, function() { return allRoutes; })