import { useEffect, useState } from 'react';
import MapView from './components/MapView';
import 'leaflet/dist/leaflet.css';

const apiKeyTomorrow = import.meta.env.VITE_TOMORROW_API_KEY;

function App() {
  const [cityInput, setCityInput] = useState('');
  const [pois, setPois] = useState([]);
  const [location, setLocation] = useState({ lat: '', lon: '' });
  const [weather, setWeather] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [categorySuggested, setCategorySuggested] = useState(false);
  const [suggestedCategory, setSuggestedCategory] = useState(null);

  const [error, setError] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(
    '4deefb944765f83613cdba6e' // default category
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
    if (location.lat && location.lon) {
      fetchWeather(location.lat, location.lon);
    }
  }, [location]);

  useEffect(() => {
    console.log('POIs:', pois);
  }, [pois]);

  useEffect(() => {
    if (weather && temperature && !categorySuggested) {
      const suggestion = suggestCategoryByWeather(weather, temperature);
      if (suggestion) {
        setSuggestedCategory(suggestion); // Set the suggested category
        setCategorySuggested(true); // only do it once
      }
    }
  }, [weather, temperature]);

  useEffect(() => {
    if (categorySuggested && location.lat && location.lon) {
      fetchPOIs(location.lat, location.lon);
    }
  }, [categorySuggested, location.lat, location.lon]);

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

  const mapTomorrowWeatherCode = (code) => {
    const map = {
      0: 'unknown',
      1000: 'clear',
      1100: 'mostly_clear',
      1101: 'partly_cloudy',
      1102: 'mostly_cloudy',
      1001: 'cloudy',
      2000: 'fog',
      2100: 'light_fog',
      4000: 'drizzle',
      4001: 'rain',
      4200: 'light_rain',
      4201: 'heavy_rain',
      5000: 'snow',
      5001: 'flurries',
      5100: 'light_snow',
      5101: 'heavy_snow',
      6000: 'freezing_drizzle',
      6001: 'freezing_rain',
      6200: 'light_freezing_rain',
      6201: 'heavy_freezing_rain',
      7000: 'ice_pellets',
      7101: 'heavy_ice_pellets',
      7102: 'light_ice_pellets',
      8000: 'thunderstorm',
    };
    return map[code] || 'unknown';
  };

  const suggestCategoryByWeather = (condition, temperature) => {
    const tooHot = temperature > 30;
    const tooCold = temperature < 5;

    if (tooHot || tooCold) {
      return {
        label: `Too ${
          tooHot ? 'hot' : 'cold'
        } today (${temperature}°C), stay inside and enjoy Museums 🖼️`,
        id: '4bf58dd8d48988d181941735',
      };
    }

    switch (condition) {
      case 'clear':
      case 'mostly_clear':
      case 'partly_cloudy':
        return {
          label: `${condition} weather today (${temperature}°C), and enjoy Gardens 🌸`,
          id: '4bf58dd8d48988d15a941735',
        };

      case 'cloudy':
      case 'mostly_cloudy':
        return {
          label: `${condition} weather today (${temperature}°C), and have fun at Parks 🌳`,
          id: '4bf58dd8d48988d163941735',
        };

      case 'fog':
      case 'light_fog':
        return {
          label: `${condition} weather today (${temperature}°C), and enjoy Museums 🖼️ `,
          id: '4bf58dd8d48988d181941735',
        };

      case 'drizzle':
      case 'light_rain':
        return {
          label: `${condition} weather today (${temperature}°C), and enjoy Museums 🖼️ `,
          id: '4bf58dd8d48988d181941735',
        };

      case 'rain':
      case 'heavy_rain':
      case 'freezing_drizzle':
      case 'freezing_rain':
      case 'light_freezing_rain':
      case 'heavy_freezing_rain':
      case 'thunderstorm':
        return {
          label: `${condition} weather today (${temperature}°C), and enjoy Museums 🖼️ `,
          id: '4bf58dd8d48988d181941735',
        };

      case 'snow':
      case 'flurries':
      case 'light_snow':
      case 'heavy_snow':
        return {
          label: `${condition} weather today (${temperature}°C), and go to Restaurants 🍴`,
          id: '4d4b7105d754a06374d81259',
        };

      case 'ice_pellets':
      case 'heavy_ice_pellets':
      case 'light_ice_pellets':
        return {
          label: `${condition} weather today (${temperature}°C), and have some coffee ☕`,
          id: '4bf58dd8d48988d1e0931735',
        };

      default:
        return {
          label: `${condition} weather today (${temperature}°C), and go to Restaurants 🍴`,
          id: '4d4b7105d754a06374d81259',
        };
    }
  };

  const fetchWeather = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://api.tomorrow.io/v4/weather/realtime?location=${lat},${lon}&apikey=${apiKeyTomorrow}`
      );

      const data = await res.json();
      console.log('Tomorrow.io weather response:', data);

      if (data?.data?.values?.weatherCode) {
        const code = data.data.values.weatherCode;
        console.log(data.data.values);
        const condition = mapTomorrowWeatherCode(code); // Optional mapping
        const temperature = data.data.values.temperature;

        console.log('Mapped condition:', condition);
        console.log('Mapped temperature:', temperature);
        setWeather(condition);
        setTemperature(temperature);
      } else {
        setWeather(null);
      }
    } catch (err) {
      console.error('Tomorrow.io weather fetch failed:', err);
      setWeather(null);
    }
  };

  const handleSuggestedClick = async () => {
    const suggestion = suggestCategoryByWeather(weather, temperature);
    if (suggestion && location.lat && location.lon) {
      try {
        const res = await fetch(
          `http://localhost:3001/api/places?lat=${location.lat}&lon=${location.lon}&category=${suggestion.id}`
        );
        const data = await res.json();
        if (res.ok) {
          setPois(data.results || []);
        } else {
          setError(data.error || 'Failed to fetch suggested POIs.');
        }
      } catch (err) {
        setError('Failed to fetch suggested POIs.');
      }
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
    <div className='min-h-screen bg-gray-100 flex flex-col items-center p-2 text-gray-600'>
      <h1 className='font-serif bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text text-3xl font-bold mb-1 leading-tight text-center'>
        🌍 Tripwise
      </h1>

      <div className='w-full max-w-xl space-y-1'>
        {/* Weather Suggestion */}
        {weather && (
          <div className='text-sm text-gray-700 flex items-center'>
            <strong>
              {' '}
              {suggestCategoryByWeather(weather, temperature)
                ?.label.split(' ')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')}
            </strong>

            <button
              onClick={handleSuggestedClick}
              className='ml-1 inline-block bg-purple-500 text-white px-2 py-0.25 rounded shadow hover:bg-purple-300 text-xs'
            >
              GO!
            </button>
          </div>
        )}

        {/* Category Selector */}
        <div>
          <label className='block text-sm font-medium mb-1'>
            Select Category:
          </label>
          <select
            onChange={(e) => setSelectedCategory(e.target.value)}
            value={selectedCategory}
            className='w-full border px-3 py-0.5 rounded'
          >
            <optgroup label='🏛️ Landmarks & Museums'>
              <option value='4deefb944765f83613cdba6e'>
                🗿 Historic Sites
              </option>
              <option value='4bf58dd8d48988d181941735'>🖼️ Museums</option>
              <option value='4bf58dd8d48988d131941735'>
                ⛪ Religious Sites
              </option>
            </optgroup>
            <optgroup label='🌳 Nature & Outdoor'>
              <option value='4bf58dd8d48988d163941735'>🌳 Parks</option>
              <option value='4bf58dd8d48988d165941735'>
                ⛰️ Scenic Lookouts
              </option>
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
              <option value='52e81612bcbc57f1066b7a0c'>
                🍵 Bubble Tea Shop
              </option>
            </optgroup>
          </select>
        </div>

        {/* City Search */}
        <div>
          <label className='block text-sm font-medium mb-1'>Search City:</label>
          <input
            type='text'
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            placeholder='e.g. Seattle'
            className='w-full border px-3 py-0.5 rounded'
          />
        </div>

        <button
          onClick={handleCitySearch}
          className='bg-blue-500 text-white text-sm w-full px-3 py-0.5 rounded shadow hover:bg-blue-300'
        >
          {'Show Map'}
        </button>

        {error && <p className='text-red-600'>{error}</p>}
      </div>

      {/* Map Section */}
      {showMap && location.lat && location.lon && (
        <div className='w-full mt-2 h-[500px]'>
          <MapView
            lat={parseFloat(location.lat)}
            lon={parseFloat(location.lon)}
            pois={pois}
            weather={weather}
            temperature={temperature}
          />
        </div>
      )}
    </div>
  );
}

export default App;
