import { useEffect, useState } from 'react';
import MapView from './components/MapView';
import 'leaflet/dist/leaflet.css';

function App() {
  const [cityInput, setCityInput] = useState('');
  const [pois, setPois] = useState([]);
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
        // Also fetch POIs for current location immediately
        fetchPOIs(coords.lat, coords.lon);
        setShowMap(true);
      },
      (err) => {
        console.error(err);
        setError('Unable to get current location.');
      }
    );
  }, []);
  useEffect(() => {
    console.log('POIs:', pois);
  }, [pois]);
  const fetchPOIs = async (lat, lon) => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/places?lat=${lat}&lon=${lon}`
      );
      const data = await res.json();
      if (res.ok) {
        setPois(data.results || []); // Make sure this matches your API response
      } else {
        setError('Failed to fetch POIs.');
      }
    } catch (err) {
      setError('Failed to fetch POIs.');
    }
  };

  const handleCitySearch = async () => {
    if (cityInput.trim() === '') {
      // fallback to current location POIs
      if (location.lat && location.lon) {
        await fetchPOIs(location.lat, location.lon);
        setShowMap(true);
      } else {
        setError('Please enter a city name or allow location access.');
      }
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
        const parsedLat = parseFloat(lat);
        const parsedLon = parseFloat(lon);
        setLocation({ lat: parsedLat, lon: parsedLon });
        setError('');
        await fetchPOIs(parsedLat, parsedLon);
        setShowMap(true);
      } else {
        setError('City not found.');
        setPois([]);
        setShowMap(false);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch city coordinates.');
      setPois([]);
      setShowMap(false);
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
          placeholder='e.g. Seattle'
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
          {/* Pass the POIs here */}
          <MapView
            lat={parseFloat(location.lat)}
            lon={parseFloat(location.lon)}
            pois={pois}
          />
        </div>
      )}
    </div>
  );
}

export default App;
