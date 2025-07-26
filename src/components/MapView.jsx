import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import L from 'leaflet';

const selectedLocationIcon = L.icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -41],
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  shadowSize: [41, 41],
});

function MapUpdater({ lat, lon }) {
  const map = useMap();

  useEffect(() => {
    map.setView([lat, lon], 13);
  }, [lat, lon, map]);

  return null;
}

function MapView({ lat, lon, pois = [], weather, temperature }) {
  console.log('weather:', weather, 'temperature:', temperature);

  const temperatureF = (temperature * 1.8 + 32).toFixed(1);

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
      <Marker position={[lat, lon]} icon={selectedLocationIcon}>
        <Popup>
          <div style={{ marginBottom: '8px' }}>Your current location</div>
          {weather ? (
            <>
              {' '}
              <div>
                Weather: <strong>{weather}</strong>
              </div>
              <div>
                Temperature: <strong>${temperatureF}°F</strong>
              </div>
            </>
          ) : (
            'Loading weather...'
          )}
        </Popup>
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
              <br />
              {poi.location?.formatted_address ||
                poi.location?.address ||
                'Address not available'}
              <br />
              {poi.categories?.[0]?.name && (
                <>
                  <em>Category:</em> {poi.categories[0].name}
                  <br />
                </>
              )}
            </Popup>
          </Marker>
        );
      })}

      <MapUpdater lat={lat} lon={lon} />
    </MapContainer>
  );
}

export default MapView;
