
    mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v10',
        center: ski.geometry.coordinates,
        zoom: 8,
    });

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
.setLngLat(ski.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({offset:25})
    .setHTML(
        `<h3>${ski.title}</h3><p>${ski.location}</p>`
    )
).addTo(map);
