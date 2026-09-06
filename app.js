const state = {
  unit: localStorage.getItem("wether-unit") || "celsius",
  weather: null,
  place: null,
};

const els = {
  content: document.querySelector("#weatherContent"),
  input: document.querySelector("#cityInput"),
  search: document.querySelector("#searchButton"),
  status: document.querySelector("#statusMessage"),
  toggle: document.querySelector("#unitToggle"),
  location: document.querySelector("#locationButton"),
  saved: document.querySelector("#savedLocations"),
  saveLocation: document.querySelector("#saveLocation"),
};

const weatherTypes = {
  0: ["Clear sky", "A bright, open sky.", "☀️"],
  1: ["Mainly clear", "A bright day with a little passing cloud.", "🌤️"],
  2: ["Partly cloudy", "A comfortable day with a few passing clouds.", "⛅"],
  3: ["Overcast", "A calm, fully clouded sky.", "☁️"],
  45: ["Foggy", "Low cloud and reduced visibility.", "🌫️"],
  48: ["Rime fog", "A cool, misty atmosphere.", "🌫️"],
  51: ["Light drizzle", "A little rain in the air.", "🌦️"],
  53: ["Drizzle", "Steady light rain nearby.", "🌦️"],
  55: ["Heavy drizzle", "A persistent, fine rain.", "🌧️"],
  61: ["Light rain", "A passing shower is likely.", "🌦️"],
  63: ["Rain", "Rain moving through the area.", "🌧️"],
  65: ["Heavy rain", "A proper wet-weather day.", "🌧️"],
  71: ["Light snow", "A soft fall of snow.", "🌨️"],
  73: ["Snow", "Snow showers across the area.", "🌨️"],
  75: ["Heavy snow", "A deep, wintry spell.", "❄️"],
  80: ["Rain showers", "Short showers, then brighter spells.", "🌦️"],
  81: ["Rain showers", "Scattered showers nearby.", "🌧️"],
  82: ["Heavy showers", "A lively burst of rain.", "⛈️"],
  95: ["Thunderstorm", "Thunder and rain passing through.", "⛈️"],
  99: ["Storm with hail", "A stormy, unsettled sky.", "⛈️"],
};

function getWeatherType(code) {
  return weatherTypes[code] || ["Changeable", "Conditions are shifting.", "🌤️"];
}

function formatDate(dateString, options) {
  return new Intl.DateTimeFormat("en-GB", options).format(new Date(dateString));
}

function convertTemperature(value) {
  return state.unit === "fahrenheit" ? Math.round((value * 9) / 5 + 32) : Math.round(value);
}

function temperature(value) {
  return `${convertTemperature(value)}°`;
}

function weatherRequest(latitude, longitude) {
  const params = new URLSearchParams({
    latitude,
    longitude,
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,surface_pressure,wind_speed_10m,visibility",
    hourly: "temperature_2m,precipitation_probability,weather_code",
    daily: "weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,sunrise,sunset",
    forecast_days: "5",
    timezone: "auto",
  });
  return fetch(`https://api.open-meteo.com/v1/forecast?${params}`).then((response) => {
    if (!response.ok) throw new Error("Weather data is unavailable right now.");
    return response.json();
  });
}

function savedLocations() {
  return JSON.parse(localStorage.getItem("wether-saved-locations") || "[]");
}

function renderSavedLocations() {
  const locations = savedLocations();
  els.saved.innerHTML = locations.map((place) => `<button class="saved-location" type="button" data-lat="${place.latitude}" data-lon="${place.longitude}">${place.name}<span>${place.country_code}</span></button>`).join("");
  els.saved.querySelectorAll(".saved-location").forEach((button) => {
    button.addEventListener("click", () => loadPlace({ latitude: button.dataset.lat, longitude: button.dataset.lon, name: button.firstChild.textContent, country_code: button.lastChild.textContent }));
  });
}

function isSaved(place) {
  return savedLocations().some((saved) => saved.latitude === place.latitude && saved.longitude === place.longitude);
}

function saveCurrentPlace() {
  if (!state.place || isSaved(state.place)) return;
  const locations = [...savedLocations(), state.place].slice(-5);
  localStorage.setItem("wether-saved-locations", JSON.stringify(locations));
  renderSavedLocations();
  els.saveLocation.textContent = "✓ Saved";
}

function renderHourly() {
  const { hourly } = state.weather;
  const currentIndex = Math.max(0, hourly.time.findIndex((time) => time >= state.weather.current.time));
  const hours = hourly.time.slice(currentIndex, currentIndex + 12).map((time, index) => {
    const dataIndex = currentIndex + index;
    const [, , icon] = getWeatherType(hourly.weather_code[dataIndex]);
    const label = index === 0 ? "Now" : formatDate(time, { hour: "numeric" });
    return `<article class="hourly-item${index === 0 ? " is-now" : ""}"><p>${label}</p><span aria-hidden="true">${icon}</span><strong>${temperature(hourly.temperature_2m[dataIndex])}</strong><small>${hourly.precipitation_probability[dataIndex]}% rain</small></article>`;
  });
  document.querySelector("#hourlyList").innerHTML = hours.join("");
}

function renderForecast() {
  const { daily } = state.weather;
  const days = daily.time.map((date, index) => {
    const [, , icon] = getWeatherType(daily.weather_code[index]);
    const day = index === 0 ? "Today" : formatDate(`${date}T12:00:00`, { weekday: "short" });
    return `<article class="forecast-day">
      <p>${day}</p>
      <div class="forecast-icon" aria-hidden="true">${icon}</div>
      <div class="forecast-temps"><strong>${temperature(daily.temperature_2m_max[index])}</strong><span>${temperature(daily.temperature_2m_min[index])}</span></div>
    </article>`;
  });
  els.saveLocation.addEventListener("click", saveCurrentPlace);
  document.querySelector("#forecastList").innerHTML = days.join("");
}

function renderWeather() {
  const { current, daily } = state.weather;
  const [condition, description] = getWeatherType(current.weather_code);
  document.querySelector("#locationName").textContent = `${state.place.name}, ${state.place.country_code}`;
  document.querySelector("#dateLabel").textContent = formatDate(current.time, { weekday: "long", month: "long", day: "numeric" }) + " · " + formatDate(current.time, { hour: "2-digit", minute: "2-digit" });
  document.querySelector("#conditionLabel").textContent = condition;
  document.querySelector("#conditionDescription").textContent = description;
  document.querySelector("#temperature").textContent = convertTemperature(current.temperature_2m);
  document.querySelector("#feelsLike").textContent = temperature(current.apparent_temperature);
  document.querySelector("#highTemp").textContent = temperature(daily.temperature_2m_max[0]);
  document.querySelector("#lowTemp").textContent = temperature(daily.temperature_2m_min[0]);
  document.querySelector("#windValue").textContent = `${Math.round(current.wind_speed_10m)} km/h`;
  document.querySelector("#humidityValue").textContent = `${Math.round(current.relative_humidity_2m)}%`;
  document.querySelector("#visibilityValue").textContent = `${(current.visibility / 1000).toFixed(1)} km`;
  document.querySelector("#pressureValue").textContent = `${Math.round(current.surface_pressure)} hPa`;
  document.querySelector("#uvValue").textContent = Math.round(daily.uv_index_max[0]);
  document.querySelector("#sunriseValue").textContent = formatDate(daily.sunrise[0], { hour: "2-digit", minute: "2-digit" });
  els.saveLocation.textContent = isSaved(state.place) ? "✓ Saved" : "☆ Save this place";
  renderHourly();
  renderForecast();
}

async function loadPlace(place) {
  setLoading(true);
  setStatus("");
  try {
    state.place = place;
    state.weather = await weatherRequest(place.latitude, place.longitude);
    localStorage.setItem("wether-last-place", JSON.stringify(place));
    renderWeather();
  } catch (error) {
    setStatus(error.message);
  } finally {
    setLoading(false);
  }
}

async function searchCity(query) {
  const value = query.trim();
  if (!value) return;
  setLoading(true);
  setStatus("");
  try {
    const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(value)}&count=1&language=en&format=json`);
    if (!geoResponse.ok) throw new Error("Unable to search for that city.");
    const geo = await geoResponse.json();
    if (!geo.results?.length) throw new Error(`We couldn't find "${value}". Try a nearby city.`);
    const place = geo.results[0];
    state.place = place;
    state.weather = await weatherRequest(place.latitude, place.longitude);
    localStorage.setItem("wether-last-place", JSON.stringify(place));
    renderWeather();
  } catch (error) {
    setStatus(error.message);
  } finally {
    setLoading(false);
  }
}

function setLoading(isLoading) {
  els.content.classList.toggle("is-refreshing", isLoading);
  els.search.disabled = isLoading;
  els.search.textContent = isLoading ? "Loading..." : "Search ↵";
}

function setStatus(message) {
  els.status.textContent = message;
}

function syncUnit() {
  els.toggle.classList.toggle("is-fahrenheit", state.unit === "fahrenheit");
  if (state.weather) renderWeather();
}

els.search.addEventListener("click", () => searchCity(els.input.value));
els.input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") searchCity(els.input.value);
});
els.toggle.addEventListener("click", () => {
  state.unit = state.unit === "celsius" ? "fahrenheit" : "celsius";
  localStorage.setItem("wether-unit", state.unit);
  syncUnit();
});
els.location.addEventListener("click", () => {
  if (!navigator.geolocation) return setStatus("Location services are not available in this browser.");
  setLoading(true);
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => searchCoordinates(coords.latitude, coords.longitude),
    () => { setLoading(false); setStatus("We couldn't access your location. Search for a city instead."); },
    { timeout: 8000 }
  );
});

async function searchCoordinates(latitude, longitude) {
  try {
    state.place = { name: "Your location", country_code: "" };
    state.weather = await weatherRequest(latitude, longitude);
    renderWeather();
  } catch (error) {
    setStatus(error.message);
  } finally {
    setLoading(false);
  }
}

syncUnit();
renderSavedLocations();
const savedPlace = JSON.parse(localStorage.getItem("wether-last-place") || "null");
searchCity(savedPlace?.name || "London");
