import {WeatherServices} from "./weather";
import { format } from "date-fns";

let weatherServices = new WeatherServices();
let backgroundColor = {'01d': [232, 196, 12], '01n': [0, 0, 0], '02d': [193, 178, 98], '02n': [85, 83, 78], '03d': [85, 83, 78], '03n': [85, 83, 78], '04d': [85, 83, 78], '04n': [85, 83, 78], '09d': [56, 65, 184], '09n': [56, 65, 184], '10d': [56, 65, 184], '10n': [56, 65, 184], '11d': [78, 6, 213], '11n': [78, 6, 213], '13d': [21, 179, 191], '13n': [21, 179, 191], '50d': [5, 26, 95], '50n': [5, 26, 95]};

let weather;
let units = 'metric';

//Check if browser supports W3C Geolocation API
function initialWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(geolocationWeather, defaultWeather);
    }
}

initialWeather()

//Get latitude and longitude;
function geolocationWeather(position) {
    let params = {};
    params['lat'] = position.coords.latitude;
    params['long'] = position.coords.longitude;
    params['units'] = units;
    updateWeather(params);
}

//Default city if user denies geolocation
function defaultWeather() {
    let params = {};
    params['cityName'] = 'Montevideo';
    params['units'] = units;
    updateWeather(params);
}

const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input')

// Enter key behaves as click on search button
searchInput.addEventListener('keyup', (event) => {
    if (event.code === "Enter") {
        event.preventDefault();
        searchButton.click();
    }
});

searchButton.addEventListener('click', searchCity);

function searchCity() {
    let params = {};
    params['cityName'] = searchInput.value;
    params['units'] = units;
    updateWeather(params);
}

async function updateWeather(params) {
    try {
        const cards = document.querySelectorAll('[id$="-card"]');
        cards.forEach((card) => showSpinner(card));

        weather = await weatherServices.createWeather(params);
        displayData(weather);

        let color = backgroundColor[weather.icon];
        let rgba = `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.2)`;
        cards.forEach((card) => card.style.backgroundColor = rgba)
        cards.forEach((card) => hideSpinner(card));
    } catch(error) {
        const notValidCityAlert = document.getElementById('not-valid-city-alert-container');
        notValidCityAlert.innerHTML = `
            <div class="alert alert-warning alert-dismissible fade show" role="alert" id="not-valid-city-alert">
              <strong>Holy guacamole!</strong> The city is not valid or not in our database. Returning to default city
              <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>'`;
        initialWeather();
    }
}

function showSpinner(card) {
    const cardBody = card.querySelector('[id$="card-body"]');
    const cardSpinner = card.querySelector('[id$="card-spinner-container"]');
    cardSpinner.setAttribute('class', 'd-flex align-items-center');
    cardBody.style.display = 'none';
}

function hideSpinner(card) {
    const cardBody = card.querySelector('[id$="card-body"]');
    const cardSpinner = card.querySelector('[id$="card-spinner-container"]');
    cardSpinner.setAttribute('class', 'd-none');
    cardBody.style.display = 'block';
}

// Erases previous data on the App and renders the new data
function displayData (data) {
    fillTemperatureCard(data);
    fillSunCard(data);
    fillAdditionalWeatherCard(data);
    fillWindCard(data);
}

function fillTemperatureCard(data) {
    const tempField = document.getElementById('temperature-text');
    const weatherField = document.getElementById('weather-text');
    const tempCardImage = document.getElementById('temp-card-image');
    const cityNameField = document.getElementById('city-name');
    const feelsLikeField = document.getElementById('feels-like');
    tempField.innerText = Math.round(data.temp) + data.unitSymbol;
    weatherField.innerText = data.weather;
    tempCardImage.setAttribute('src', `design/SVG/${data.icon}.svg`);
    cityNameField.innerText = `${data.city} (${data.country})`;
    feelsLikeField.innerText = `Feels like ${Math.round(data.feelsLike)}${data.unitSymbol}`;
}

function fillSunCard(data) {
    const sunriseTime = document.getElementById('sunrise-time');
    const sunsetTime = document.getElementById('sunset-time');
    sunriseTime.innerText = format(data.sunrise, 'HH:mm');
    sunsetTime.innerText = format(data.sunset, 'HH:mm');
}

function fillAdditionalWeatherCard(data) {
    const minTemp = document.getElementById('min-temp');
    const maxTemp = document.getElementById('max-temp');
    const humidity = document.getElementById('humidity');
    const cloudCover = document.getElementById('cloud-text');
    minTemp.innerText = `Min: ${Math.round(data.temp_min)}${data.unitSymbol}`;
    maxTemp.innerText = `Max: ${Math.round(data.temp_max)}${data.unitSymbol}`;
    humidity.innerText = `Humidity: ${data.humidity}%`;
    cloudCover.innerText = `Cloudiness: ${data.clouds}%`;
}

function fillWindCard(data) {
    const windDirectoin = document.getElementById('wind-image');
    const windSpeed = document.getElementById('wind-speed');
    windDirectoin.style.transform = `rotate(${data.windDirection}deg)`;
    windSpeed.innerText = `Speed: ${data.windSpeed.toFixed(2)}${data.windUnitSymbol}`;
}

const toggleUnitsButton = document.getElementById('toggle-units-button');

toggleUnitsButton.addEventListener('click', toggleUnits);

function toggleUnits() {
    weather.toggleUnits();
    displayData(weather);
    toggleButtonContent();
}

function toggleButtonContent() {
    if (toggleUnitsButton.innerHTML === '<b>°C</b> / °F') {
        toggleUnitsButton.innerHTML = '°C / <b>°F</b>';
    } else {
        toggleUnitsButton.innerHTML = '<b>°C</b> / °F';
    }
}
