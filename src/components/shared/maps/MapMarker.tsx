
import mapboxgl from 'mapbox-gl';

interface MapMarkerProps {
  map: mapboxgl.Map;
  coordinates: [number, number];
  color: string;
  popupContent: string;
}

export const createMapMarker = ({
  map,
  coordinates,
  color,
  popupContent,
}: MapMarkerProps) => {
  const marker = document.createElement('div');
  marker.className = 'rounded-full';
  marker.style.backgroundColor = color;
  marker.style.width = '12px';
  marker.style.height = '12px';
  marker.style.border = '2px solid white';
  marker.style.boxShadow = '0 0 0 1px rgba(0, 0, 0, 0.1)';

  new mapboxgl.Marker(marker)
    .setLngLat(coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent))
    .addTo(map);

  return marker;
};
