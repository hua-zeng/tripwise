import { useEffect, useState } from 'react';
import MapView from './components/MapView';
import 'leaflet/dist/leaflet.css';

function App() {
  const [cityInput, setCityInput] = useState('');
  const [location, setLocation] = useState({ lat: '', lon: '' });
  const [error, setError] = useState('');
  const [showMap, setShowMap] = useState(false);

  // Fetch current location on first load
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude.toFixed(5),
          lon: pos.coords.longitude.toFixed(5),
        };
        setLocation(coords);
      },
      (err) => {
        console.error(err);
        setError('❌ Unable to get current location.');
      }
    );
  }, []);

  const handleCitySearch = async () => {
    if (cityInput.trim() === '') {
      setShowMap(true); // fallback to current location
      return;
    }

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          cityInput
        )}`
      );
      const data = await res.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        setLocation({ lat: parseFloat(lat), lon: parseFloat(lon) });
        setShowMap(true); // re-render map
        setError('');
      } else {
        setError('❌ City not found.');
      }
    } catch (err) {
      console.error(err);
      setError('❌ Failed to fetch city coordinates.');
    }
  };

  return (
    <div className='min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6 text-gray-800'>
      <h1 className='font-serif bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text text-6xl font-bold mb-6 leading-tight'>
        🌍 Tripwise
      </h1>

      <div className='mb-4 w-full max-w-sm space-y-2'>
        <label className='block text-sm font-medium'>Search City:</label>
        <input
          type='text'
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)}
          placeholder='e.g. Tokyo'
          className='w-full border px-3 py-2 rounded'
        />
      </div>

      <button
        onClick={handleCitySearch}
        className='bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700'
      >
        {showMap ? 'Update Map' : 'Show Map'}
      </button>

      {error && <p className='mt-4 text-red-600'>{error}</p>}

      {showMap && location.lat && location.lon && (
        <div className='w-full h-[500px] mt-6'>
          <MapView
            lat={parseFloat(location.lat)}
            lon={parseFloat(location.lon)}
          />
        </div>
      )}
    </div>
  );
}

export default App;
