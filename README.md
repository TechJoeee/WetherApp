# Wether

A polished, responsive weather dashboard built with semantic HTML, CSS, and vanilla JavaScript. Wether turns live weather data into a calm, readable experience with current conditions, hourly outlooks, saved locations, and a five-day forecast.

This project started as a learning exercise for working with APIs, asynchronous JavaScript, DOM rendering, responsive design, and purposeful animation. It intentionally uses a small, dependency-light stack so the implementation stays easy to understand and extend.

![Wether weather dashboard](https://placehold.co/1200x700/f3f1eb/172124?text=Wether+weather+dashboard)

## Features

- Search for cities anywhere in the world
- Live current conditions
- Current temperature, feels-like temperature, high, and low
- Twelve-hour outlook with:
  - Temperature
  - Weather condition
  - Precipitation probability
  - Current-hour emphasis
- Five-day forecast
- Saved locations stored in the browser
- Quick switching between saved cities
- Celsius and Fahrenheit conversion
- Browser geolocation support
- UV index
- Sunrise time
- Wind speed, humidity, visibility, and pressure
- Loading, empty, and API error states
- Responsive layout for mobile, tablet, and desktop
- Keyboard-friendly controls and visible focus states
- Reduced-motion support through `prefers-reduced-motion`

## Tech stack

### Frontend

- **HTML5** for the page structure and semantic elements
- **CSS3** for the visual system, responsive layout, transitions, and weather illustration
- **Vanilla JavaScript** for state, API requests, rendering, storage, and interactions
- **Tailwind CSS CDN** for a small amount of utility configuration and font-family setup
- **Google Fonts**
  - Bricolage Grotesque for display typography
  - Noto Sans for interface and supporting text

### Data and browser APIs

- **Open-Meteo Geocoding API** for city search
- **Open-Meteo Forecast API** for current, hourly, and daily weather
- **Geolocation API** for the current-location action
- **Web Storage API** for saved cities, the last location, and temperature-unit preference

No API key is required for the current Open-Meteo integration.

## Getting started

### Requirements

You only need:

- A modern browser
- A local static file server
- An internet connection for weather data and web fonts

No `npm install` step is required.

### Run locally

Clone the repository:

```bash
git clone https://github.com/TechJoeee/WetherApp.git
cd WetherApp
```

Start a static server from the project directory. For example, with Node.js:

```bash
node -e "const http=require('http'),fs=require('fs'),path=require('path');http.createServer((req,res)=>{const file=req.url==='/'?'index.html':req.url.slice(1);const filePath=path.join(process.cwd(),file);fs.readFile(filePath,(error,data)=>{if(error){res.writeHead(404);res.end('Not found');return;}res.writeHead(200);res.end(data);});}).listen(4173,()=>console.log('Wether running at http://localhost:4173'))"
```

Then open:

```text
http://localhost:4173
```

You can also use any static server, including the Live Server extension in Visual Studio Code.

## How it works

The application follows a simple data flow:

```text
User enters a city
        ↓
Open-Meteo geocoding finds the best matching place
        ↓
The place coordinates are sent to the forecast API
        ↓
The response is stored in application state
        ↓
The current weather, hourly forecast, details, and daily forecast render
        ↓
The selected place is stored locally for the next visit
```

### City search

The search first calls the Open-Meteo geocoding endpoint:

```text
https://geocoding-api.open-meteo.com/v1/search
```

The first matching result supplies the latitude, longitude, city name, and country code used by the forecast request.

### Weather request

The forecast request includes:

- Current temperature
- Relative humidity
- Apparent temperature
- Day/night state
- Weather code
- Surface pressure
- Wind speed
- Visibility
- Hourly temperature
- Hourly precipitation probability
- Hourly weather code
- Daily weather code
- Daily high and low
- Daily maximum UV index
- Sunrise and sunset

### Weather codes

Open-Meteo returns WMO weather interpretation codes. `app.js` maps those codes to a readable condition, description, and icon. This keeps API-specific values separate from the text shown to the user.

## Project structure

```text
WetherApp/
├── index.html       # Application markup and page structure
├── styles.css       # Design system, responsive layout, and visual effects
├── app.js           # API calls, state, rendering, and interactions
├── DESIGN.md        # Durable visual and interaction decisions
├── PRODUCT.md       # Product purpose, users, constraints, and principles
└── README.md        # Project documentation
```

## Browser storage

Wether stores small pieces of non-sensitive UI state in `localStorage`:

| Key | Purpose |
| --- | --- |
| `wether-unit` | Stores `celsius` or `fahrenheit` |
| `wether-last-place` | Restores the last searched city |
| `wether-saved-locations` | Stores up to five saved locations |

No account, personal profile, or weather history is stored on a server.

## Accessibility and responsive behavior

- Semantic sections and labelled controls are used throughout the page.
- Search and action controls work with keyboard input.
- Focus-visible outlines are preserved for keyboard users.
- Status and error messages use an `aria-live` region.
- Weather illustration elements are hidden from screen readers because they are decorative.
- Hourly and saved-location rows can scroll horizontally on narrow screens.
- Forecast and detail layouts adapt from multi-column desktop layouts to mobile-friendly stacked or scrolling views.
- Motion is reduced when the user has enabled `prefers-reduced-motion`.

## Design direction

The interface uses a premium editorial direction rather than a conventional weather-card dashboard:

- Warm off-white canvas
- Dark ink typography
- Restrained coral weather accent
- Large, expressive temperature display
- Thin rules and open spacing
- Quiet data rows instead of nested cards
- Subtle atmospheric weather illustration

The main design goal is to make the current answer immediately obvious while keeping the planning tools—hourly outlook, saved locations, details, and forecast—available without visual noise.

## Known limitations

- City search currently uses the first geocoding match rather than showing a selectable results list.
- Weather data depends on the availability of the Open-Meteo services.
- Unit switching currently changes temperatures only; wind and visibility remain in metric units.
- Saved locations are device-local and are not synchronized between browsers.
- The current-location action uses browser permission and may not work on insecure origins outside localhost.
- The weather illustration is a lightweight CSS representation and does not yet change its shape for every condition.

## Possible next steps

- Add geocoding suggestions and disambiguation for duplicate city names.
- Add a seven-day forecast and precipitation timeline.
- Add sunset, daylight progress, and moon information.
- Add cached responses and offline-friendly behavior.
- Add request cancellation with `AbortController`.
- Add URL state such as `?city=Tokyo`.
- Add richer weather-specific animations for rain, snow, wind, and night.
- Convert the project into an installable Progressive Web App.
- Add automated tests for formatting, weather-code mapping, and state transitions.

## Data attribution

Weather and geocoding data are provided by [Open-Meteo](https://open-meteo.com/).

## License

No license has been selected for this learning project yet. Add a license file before distributing or reusing the code publicly.
