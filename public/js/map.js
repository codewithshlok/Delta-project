

mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: listing.geometry.coordinates, // starting position [lng, lat]
    zoom: 8 // starting zoom
});




const marker1 = new mapboxgl.Marker({ color: 'red'})
.setLngLat(listing.geometry.coordinates) // Listing.geometry.coordinates
.setPopup(new mapboxgl.Popup({offset: 18})
.setHTML(`<h5>${listing.title}</h5><p>Exact Location will be provided after booking.</p>`))
.addTo(map);
