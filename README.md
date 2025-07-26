# 🌍 Tripwise

**Tripwise** is a smart travel companion that recommends nearby places to visit based on real-time weather and your current or searched location. Whether you're in the mood for a sunny park stroll or need a rainy-day museum retreat, Tripwise helps you make the right choice—instantly and interactively.

<!-- Optional: add a screenshot here -->
<!-- ![Tripwise Screenshot](client/screenshot.png) -->

---

## 🚀 Features

- 🔍 Search any city or use your current location
- ☁️ Real-time weather data from [Tomorrow.io](https://www.tomorrow.io/)
- 📍 Smart suggestions based on temperature & weather conditions
- 🗺️ Interactive map using Leaflet with Points of Interest from Foursquare
- 🎯 Category selector for personalized exploration (e.g., parks, museums, cafes)

---

## 🛠️ Tech Stack

**Frontend:**

- React (Vite)
- Tailwind CSS
- Leaflet.js

**Backend:**

- Node.js
- Express (as a simple proxy server)

**APIs Used:**

- [Tomorrow.io](https://www.tomorrow.io/) — for real-time weather
- [Foursquare Places API](https://developer.foursquare.com/docs/) — for POI search
- [OpenStreetMap Nominatim](https://nominatim.org/) — for city geocoding

---

## 📦 Installation

### 1. Clone the repo

```bash
git clone https://github.com/hua-zeng/tripwise.git
cd tripwise
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create .env files

```
VITE_TOMORROW_API_KEY=your_tomorrow_api_key_here
FSQ_SERVICE_KEY=your_foursquare_api_key_here
```

### 4. Run the project

Start the backend

```bash
npm run server
```

Start the frontend

```bash
npm run dev
```

Open the app at: http://localhost:5173
