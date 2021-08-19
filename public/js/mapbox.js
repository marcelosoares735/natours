/* eslint-disable */

export const dislpayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoibWFyY2Vsb3NvYXJlczczNSIsImEiOiJja3JtNTV1c3oxYjd0MndwODRjN3BodGp3In0.Z2n2YzFh8vSDrVMkB0HqAw';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/marcelosoares735/ckrm5r7vg39uj17rwvuwq8pg8',
    scrollZoom: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 30,
      closeOnClick: false,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 100,
      left: 100,
      right: 100,
    },
  });
};
