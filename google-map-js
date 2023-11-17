// Autocomplete From Setup
$("[zip-search='form']").submit(function(event) {
  event.preventDefault();
  let zipValue = $("[zip-search='input']").val();
  window.location = "/google-maps/map" + "?zip=" + zipValue;
  return false;
});
// Get Zip From URL
let urlParams = new URLSearchParams(window.location.search);
let zip = urlParams.get('zip');
$("[zip-search='input']").val(zip);

async function initMap() {
  // Get data from list
  const locationsList = $("[locations='list']");
  const centerLat = +$("[center-lat]").attr("center-lat");
  const centerLng = +$("[center-lng]").attr("center-lng");
  const mapId = $("[map-id]").attr("map-id");
  const mapZoom = +$("[map-zoom]").attr("map-zoom");
  // Get zip from param
  const urlParams = new URLSearchParams(window.location.search);
  const paramZip = urlParams.get('zip');  
  // Initialize google services
  const geocoder = new google.maps.Geocoder();
  const service = new google.maps.DistanceMatrixService();
  const bounds = new google.maps.LatLngBounds();
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: mapZoom,
    center: { lat: centerLat, lng: centerLng },
    mapId: mapId,
    zoomControl: false,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: false
  });

  // Create arrays
  let locationsArr = [];
  let originArr = [];
  let destinationArr = [];
  
  // // Get CMS list from page by id
  let locationsItems = locationsList.children();
  locationsItems.each(function(){
    let collectionObj = {};
    collectionObj.div = $(this);
    locationsArr.push(collectionObj);
  });
  let infowindow = new google.maps.InfoWindow;

  // Location info
  let locationTitle = $("[location-info='title']");
  let locationAddress = $("[location-info='address']");
  let distanceContainer = $("[location-info='distance-container']");
  let distanceContainerText = distanceContainer.find($("[location-info='distance-text']"));
  let mapMarker = $("[location-info='map-marker']");
  // Show markers
  for (let i = 0; i < locationsArr.length; i++) {
    // Geocode address to latlng
    async function getLatLng() {
      let titleValue = locationsArr[i].div.find(locationTitle).text();
      locationsArr[i].title = titleValue;
      let address = locationsArr[i].div.find(locationAddress).text();
      locationsArr[i].address = address;
      let scheduleLink = locationsArr[i].div.find($("a:first")).attr('href');
      await geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == 'OK') {
          let latValue = results[0].geometry.location.lat();
          locationsArr[i].lat = latValue;
          let lngValue = results[0].geometry.location.lng();
          locationsArr[i].lng = lngValue;

          function setMarker() {
            let parser = new DOMParser();
            let pinSvgString = mapMarker.html();
            let pinSvg = parser.parseFromString(
              pinSvgString,
              "image/svg+xml",
            ).documentElement;
            let contentString =
              '<div class="text-color-black">'+
              '<h5>'+titleValue+'</h5>' +
              '<div class="padding-bottom padding-tiny"></div>' +
              "<p>" + address + "</p>" +
              '<div class="padding-bottom padding-tiny"></div>' +
              '<a target="_blank" href=' + scheduleLink + '>Get Directions</a>'+
              '</div>';
            let marker = new AdvancedMarkerElement({
              map,
              position: { 
                lat: latValue, 
                lng: lngValue
              },
              title: titleValue,
              content: pinSvg
            });
            marker.addListener("click", () => {
              infowindow.setContent(contentString);
              infowindow.open({
                anchor: marker,
                map,
              });
              // Adjust zoom and center
              map.setZoom(9);
              map.setCenter(marker.position);
            });
          }
          setMarker();

          // Set origin and destination arrays for distance matrix
          originArr.push(address);
          destinationArr.push(paramZip);
        }
      });
    }
    await getLatLng();
  }

  // Get distance if zip is present
  if (paramZip) {
    // Geocode zip and center map
    async function geocodeZip() {
      await geocoder.geocode( { 'address': paramZip}, function(results, status) {
        if (status == 'OK') {
          map.setCenter(results[0].geometry.location);
          
          service.getDistanceMatrix(
            {
              origins: originArr,
              destinations: destinationArr,
              travelMode: google.maps.TravelMode.DRIVING,
              unitSystem: google.maps.UnitSystem.IMPERIAL,
            }, callback);  
            function callback(response, status) {
              if (status == 'OK') {
                let origins = response.originAddresses;
                for (let i = 0; i < origins.length; i++) {
                  let results = response.rows[i].elements;
                  let element = results[i];
                  let distanceText = element.distance.text;
                  let distance = +distanceText.replace( / mi|,/g, '');
                  locationsArr[i].distance = distance;
                  locationsArr[i].div.find(distanceContainerText).text(distanceText);
                }
      
                // Sort by distance     
                locationsArr.sort(function (a, b) {
                  return a.distance - b.distance;
                });
                // Sort locations list based on distance sort
                for (let i = 0; i < locationsArr.length; i++) {
                  locationsList.append(locationsArr[i].div[0]);
                }
              }
            }      
        } else {
          distanceContainer.hide();
        }
      });
    }
    geocodeZip();
  } else {
    distanceContainer.hide();
  }
}

window.initMap = initMap;
