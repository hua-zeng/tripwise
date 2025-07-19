import { useEffect, useState } from 'react';
import MapView from './components/MapView';
import 'leaflet/dist/leaflet.css';

function App() {
  const [cityInput, setCityInput] = useState('');
  const [pois, setPois] = useState([]);
  const [location, setLocation] = useState({ lat: '', lon: '' });
  const [error, setError] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(
    '4deefb944765f83613cdba6e'
  );

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

  useEffect(() => {
    if (location?.lat && location?.lon) {
      fetchPOIs(location.lat, location.lon);
    }
  }, [selectedCategory]);

  const fetchPOIs = async (lat, lon) => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/places?lat=${lat}&lon=${lon}&category=${selectedCategory}`
      );
      const data = await res.json();
      if (res.ok) {
        setPois(data.results || []);
      } else {
        setError(data.error || 'Failed to fetch POIs.');
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

      {/* Category selector */}
      <div className='mb-4 w-full max-w-sm space-y-2'>
        <label className='block text-sm font-medium'>Select Category:</label>
        <select
          onChange={(e) => setSelectedCategory(e.target.value)}
          value={selectedCategory}
          className='w-full border px-3 py-2 rounded'
        >
          <optgroup label='🏛️ Landmarks & Museums'>
            <option value='4deefb944765f83613cdba6e'>🗿 Historic Sites</option>
            <option value='4bf58dd8d48988d181941735'>🖼️ Museums</option>
            <option value='4bf58dd8d48988d131941735'>⛪ Religious Sites</option>
          </optgroup>

          <optgroup label='🌳 Nature & Outdoor'>
            <option value='4bf58dd8d48988d163941735'>🌳 Parks</option>
            <option value='4bf58dd8d48988d165941735'>⛰️ Scenic Lookouts</option>
            <option value='4bf58dd8d48988d15a941735'>🌸 Gardens</option>
          </optgroup>

          <optgroup label='🍽️ Food & Drink'>
            <option value='4d4b7105d754a06374d81259'>🍴 Restaurants</option>
            <option value='4bf58dd8d48988d16a941735'>🍰 Bakeries</option>
            <option value='4bf58dd8d48988d1c9941735'>🍦 Ice Cream</option>
          </optgroup>

          <optgroup label='☕ Coffee & Beverages'>
            <option value='4bf58dd8d48988d1e0931735'>☕ Coffee Shops</option>
            <option value='4bf58dd8d48988d1dc931735'>🍵 Tea Houses</option>
            <option value='52e81612bcbc57f1066b7a0c'>🍵 Bubble Tea Shop</option>
          </optgroup>
        </select>
      </div>

      {/* City search input */}
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
