const apiKey = "f0b96097ebb24c8a98e160326252406";
let currentTempC = null;

function getWeather() {
  const city = document.getElementById("cityInput").value;
  if (!city) {
    alert("Please enter a city name.");
    return;
  }
  fetchWeather(city);
}

function getLocationWeather() {
  if (!navigator.geolocation) {
    alert("Geolocation not supported.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      fetchWeather(`${latitude},${longitude}`);
    },
    () => alert("Unable to get your location.")
  );
}

function fetchWeather(query) {
  const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${query}`;

  fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error("Location not found");
      return response.json();
    })
    .then((data) => {
      const { temp_c, condition } = data.current;
      const iconUrl = condition.icon;
      const cityName = data.location.name;

      currentTempC = temp_c;

      document.getElementById("weatherResult").innerHTML = `
        <h2>${cityName}</h2>
        <img src="https:${iconUrl}" alt="icon" class="weather-icon"/>
        <p><strong>${condition.text}</strong></p>
        <p id="tempVal"><strong>${temp_c}°C</strong></p>
      `;
      document.getElementById("toggleBtn").style.display = "inline-block";
    })
    .catch((error) => {
      document.getElementById("weatherResult").innerText = "❌ Weather data unavailable.";
      console.error(error);
    });
}

function toggleTemp() {
  const tempElement = document.getElementById("tempVal");
  const toggleBtn = document.getElementById("toggleBtn");
  if (!currentTempC) return;

  if (toggleBtn.textContent.includes("°F")) {
    const tempF = (currentTempC * 9) / 5 + 32;
    tempElement.innerHTML = `<strong>${tempF.toFixed(1)}°F</strong>`;
    toggleBtn.textContent = "Switch to °C";
  } else {
    tempElement.innerHTML = `<strong>${currentTempC}°C</strong>`;
    toggleBtn.textContent = "Switch to °F";
  }
}

function updateDateTime() {
  const now = new Date();
  document.getElementById("datetime").textContent = now.toLocaleString();
}
setInterval(updateDateTime, 1000);
