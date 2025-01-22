document.getElementById('getWeather').addEventListener('click', function () {
    const city = document.getElementById('city').value;
    if (!city) {
        document.getElementById('weatherResult').innerHTML = '<p>Please enter a city name.</p>';
        return;
    }
    fetchWeather(city);
    updateSearchHistory(city);
});

document.getElementById('getLocationWeather').addEventListener('click', function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                fetchWeatherByCoordinates(lat, lon);
            },
            () => {
                document.getElementById('weatherResult').innerHTML = '<p>Unable to fetch location.</p>';
            }
        );
    } else {
        document.getElementById('weatherResult').innerHTML = '<p>Geolocation is not supported by this browser.</p>';
    }
});

function fetchWeather(city) {
    const apiKey = 'aa05ef14be67dc2fafd2fc85003c6c8c';
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => displayWeather(data))
        .catch(error => console.error(error));

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => displayForecast(data))
        .catch(error => console.error(error));
}

function fetchWeatherByCoordinates(lat, lon) {
    const apiKey = 'your_api_key_here';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => displayWeather(data))
        .catch(error => console.error(error));
}

function displayWeather(data) {
    if (data.cod === 200) {
        const weather = `
            <h2>${data.name}</h2>
            <p>Temperature: ${data.main.temp}°C</p>
            <p>Weather: ${data.weather[0].description}</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind Speed: ${data.wind.speed} m/s</p>
        `;
        document.getElementById('weatherResult').innerHTML = weather;
    } else {
        document.getElementById('weatherResult').innerHTML = `<p>${data.message}</p>`;
    }
}

function displayForecast(data) {
    if (data.cod === "200") {
        const forecast = data.list
            .filter(item => item.dt_txt.includes("12:00:00")) // Select daily forecast at noon
            .map(item => `
                <div class="forecast-item">
                    <p>${new Date(item.dt_txt).toLocaleDateString()}</p>
                    <p>Temp: ${item.main.temp}°C</p>
                    <p>${item.weather[0].description}</p>
                </div>
            `)
            .join("");
        document.getElementById('forecastResult').innerHTML = `
            <h3>5-Day Forecast</h3>
            <div class="forecast-container">${forecast}</div>
        `;
    } else {
        document.getElementById('forecastResult').innerHTML = `<p>${data.message}</p>`;
    }
}

function updateSearchHistory(city) {
    let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!history.includes(city)) {
        history.push(city);
        localStorage.setItem('searchHistory', JSON.stringify(history));
    }
    displaySearchHistory();
}

function displaySearchHistory() {
    const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    const historyHtml = history
        .map(city => `<button class="history-item">${city}</button>`)
        .join("");
    document.getElementById('searchHistory').innerHTML = historyHtml;

    document.querySelectorAll('.history-item').forEach(button => {
        button.addEventListener('click', () => {
            fetchWeather(button.textContent);
        });
    });
}

document.addEventListener('DOMContentLoaded', displaySearchHistory);
