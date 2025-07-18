// foursquare.js
export async function fetchPOIs(lat, lon) {
  const res = await fetch(
    `http://localhost:3001/api/places?lat=${lat}&lon=${lon}`
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to fetch POIs');
  }

  const data = await res.json();
  return data.results; // array of places
}
