// Instantiate the variables that will contain data
// about the new marker
// Will get/submit the value of the column 'poi_name'
var markerName = null;
// Will get/submit the value of the column 'poi_text'
var markerText = null;
// URL of the back-end function
var urlBack = "/.netlify/functions/pg_connect"
// SQL query for inserting a new marker
var insertQuery = null;
// SQL query for fetching names and texts of all markers
var selectAllQuery = "SELECT poi_name, poi_text FROM json_ict442";
// SQL query for cleaning the database
var deleteMarkersQuery = "DELETE FROM json_ict442 WHERE gid > 2";

// Linking DOM elements and actions
document.getElementById('addMarker').addEventListener('click', addMarker);
document.getElementById('getMarkers').addEventListener('click', getMarkers);
document.getElementById('deleteMarkers').addEventListener('click', deleteMarkers);

var markersList = document.getElementById('markersList');
var markerNameInput = document.getElementById('markerName');
var markerTextInput = document.getElementById('markerText');

async function httpPerformRequest(url, httpMethod, httpBody) {
    return (await fetch(url, {
            method: httpMethod,
            headers: {
                'Accept': "application/json, text/plain, */*",
                'Content-type': 'application/json'
            },
            body: httpBody
        })).json();
}

function deleteMarkers() {
    // Clean the list of markers, in case it is displayed
    // in the screen
    cleanDomChildren(markersList);

    httpPerformRequest(urlBack,
        'POST',
        JSON.stringify({dbQuery: deleteMarkersQuery}))
        .then((res) => {console.log("Records deleted: " + res.rowCount)})
}

function cleanDomChildren(domParentElement) {
    // This function accepts a DOM element, and
    // removes all its child elements
    while (domParentElement.firstChild) {
        markersList.removeChild(markersList.firstChild);
    }
}

function getMarkers() {

    // Clean the list of markers, in case it is displayed
    // in the screen
    cleanDomChildren(markersList);

    httpPerformRequest(urlBack,
        'POST',
         JSON.stringify({dbQuery: selectAllQuery}))
    .then(data => {
        var rows = data.rows;
        rows.forEach(marker => {
            var node = document.createElement("li");
            var p1 = document.createElement("p");
            var textnode = document.createTextNode(marker.poi_name);
            p1.appendChild(textnode);
            p1.classList.add("markerName");
            var p2 = document.createElement("p");
            textnode = document.createTextNode(marker.poi_text);
            p2.appendChild(textnode);
            node.appendChild(p1);
            node.appendChild(p2);
            markersList.appendChild(node);
        })
    })
}

function addMarker(e) {
    
    // Clean the list of markers, in case it is displayed
    // in the screen
    cleanDomChildren(markersList);

    insertQuery = `INSERT INTO json_ict442 (poi_name, poi_text) VALUES (
                    '${markerNameInput.value}',
                    '${markerTextInput.value}')`;

    // Cleaning the form after having obtained their values
    markerNameInput.value = null;
    markerTextInput.value = null;

    httpPerformRequest(urlBack,
        'POST',
        JSON.stringify({dbQuery: insertQuery}))
        .then((res) => {
            console.log("*** Response ***");
            console.log(res);})
}


