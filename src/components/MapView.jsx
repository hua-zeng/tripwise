import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect } from 'react';

function MapUpdater({ lat, lon }) {
  const map = useMap();

  useEffect(() => {
    map.setView([lat, lon], 13);
  }, [lat, lon, map]);

  return null;
}

function MapView({ lat, lon }) {
  return (
    <MapContainer
      center={[lat, lon]}
      zoom={13}
      scrollWheelZoom={true}
      className='h-full w-full'
    >
      <TileLayer
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        attribution='&copy; OpenStreetMap contributors'
      />
      <Marker position={[lat, lon]}>
        <Popup>Your selected location</Popup>
      </Marker>
      <MapUpdater lat={lat} lon={lon} />
    </MapContainer>
  );
}

export default MapView;
