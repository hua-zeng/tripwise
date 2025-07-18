import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import L from 'leaflet';

function MapUpdater({ lat, lon }) {
  const map = useMap();

  useEffect(() => {
    map.setView([lat, lon], 13);
  }, [lat, lon, map]);

  return null;
}

function MapView({ lat, lon, pois = [] }) {
  return (
    <MapContainer
      center={[lat, lon]}
      zoom={13}
      scrollWheelZoom={true}
      className='h-full w-full rounded shadow-md'
    >
      <TileLayer
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        attribution='&copy; OpenStreetMap contributors'
      />

      {/* User location marker */}
      <Marker position={[lat, lon]}>
        <Popup>Your selected location</Popup>
      </Marker>

      {/* POI markers */}
      {pois.map((poi, i) => {
        const lat = poi.latitude;
        const lon = poi.longitude;

        // Skip POIs without valid lat/lon
        if (lat == null || lon == null) return null;

        return (
          <Marker
            key={i}
            position={[lat, lon]}
            icon={L.icon({
              iconUrl:
                'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [0, -41],
            })}
          >
            <Popup>
              <strong>{poi.name}</strong>
              <br />
              {poi.location?.address ||
                poi.location?.formatted_address ||
                'Address not available'}
            </Popup>
          </Marker>
        );
      })}

      <MapUpdater lat={lat} lon={lon} />
    </MapContainer>
  );
}

export default MapView;
