function createGPXFile(TrackSegment) {

    var uri = "http://www.topografix.com/GPX/1/1"
    var xmlDoc = document.implementation.createDocument(uri, "route");

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            xmlDoc = xhttp.responseXML; //important to use responseXML here
        }
        xhttp.open("GET", "route.xml", true);
        xhttp.send();
    }

    var xmlString = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1"
creator="RunTracker for KaiOS"
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xmlns="http://www.topografix.com/GPX/1/1"
xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
<metadata>
<name>RunTracker for KaiOS route track log</name>
<author>
<name>RunTracker for KaiOS</name>
</author>
</metadata>
<trk>
<src>Logged using RunTracker for KaiOS</src>
</trk>
</gpx>`;; // namespace URI

    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(xmlString, "text/xml");

    // init end

    function createXMLNodeWithData(targetTag, newTag, data) {
        var elements = xmlDoc.getElementsByTagName(targetTag);
        var node = xmlDoc.createElementNS(uri, newTag);
        if (data) {
            var text = document.createTextNode(data);
            node.appendChild(text);
        }
        elements[elements.length - 1].appendChild(node);
        return node;
    }

    // add time to metadata

    createXMLNodeWithData("metadata", "time", TrackSegment.startTime.toISOString());

    // add track segments (trkseg) - currently only one segment is supported

    createXMLNodeWithData("trk", "trkseg");

    // add track points (trkpt)
    TrackSegment.trackPoints.forEach(TrackPoint => {
        var trkpt = createXMLNodeWithData("trkseg", "trkpt");
        trkpt.setAttribute("lat", TrackPoint.lat);
        trkpt.setAttribute("lon", TrackPoint.lon);
        createXMLNodeWithData("trkpt", "time", TrackPoint.time.toISOString());
    });

    // file saving start

    var serializer = new XMLSerializer();
    var xmlString = serializer.serializeToString(xmlDoc);

    return new Blob([xmlString], { type: "application/xml+gpx" });
}