import { useEffect, useState } from 'react';
import './index.css';

function App() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
      },
      (err) => {
        console.error('Geolocation error:', err);
        setError('Unable to get location.');
      }
    );
  }, []);

  return (
    <div className='min-h-screen bg-gray-100 flex flex-col items-center justify-center text-gray-800 p-4'>
      <h1 className='text-4xl font-bold mb-4'>🌍 Tripwise</h1>

      {error ? (
        <p className='text-red-500'>{error}</p>
      ) : location ? (
        <p className='text-lg'>
          Your location:{' '}
          <span className='font-medium'>
            {location.lat.toFixed(3)}, {location.lon.toFixed(3)}
          </span>
        </p>
      ) : (
        <p className='text-gray-600'>Getting your location...</p>
      )}
    </div>
  );
}

export default App;
