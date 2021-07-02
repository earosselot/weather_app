import {WeatherServices} from "./weather";
import { format } from "date-fns";

let weatherServices = new WeatherServices();
let backgroundColor = {'01d': [232, 196, 12], '01n': [0, 0, 0], '02d': [193, 178, 98], '02n': [85, 83, 78], '03d': [85, 83, 78], '03n': [85, 83, 78], '04d': [85, 83, 78], '04n': [85, 83, 78], '09d': [56, 65, 184], '09n': [56, 65, 184], '10d': [56, 65, 184], '10n': [56, 65, 184], '11d': [78, 6, 213], '11n': [78, 6, 213], '13d': [21, 179, 191], '13n': [21, 179, 191], '50d': [5, 26, 95], '50n': [5, 26, 95]};
// TODO: hacer andar el boton de °C/°F
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
    updateWeather(params);
}

//Default city if user denies geolocation
function defaultWeather() {
    let params = {};
    params['cityName'] = 'Montevideo';
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
        initialWeather();
        console.log('error: ');
        console.log(error);
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
    tempField.innerText = Math.round(data.temp) + '°C';
    weatherField.innerText = data.weather;
    tempCardImage.setAttribute('src', `design/SVG/${data.icon}.svg`);
    cityNameField.innerText = `${data.city} (${data.country})`;
    feelsLikeField.innerText = `Feels like ${Math.round(data.feelsLike)}°C`;
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
    minTemp.innerText = `Min: ${Math.round(data.temp_min)}°C`;
    maxTemp.innerText = `Max: ${Math.round(data.temp_max)}°C`;
    humidity.innerText = `Humidity: ${data.humidity}%`;
    cloudCover.innerText = `Cloudiness: ${data.clouds}%`;
}

function fillWindCard(data) {
    const windDirectoin = document.getElementById('wind-image');
    const windSpeed = document.getElementById('wind-speed');
    windDirectoin.style.transform = `rotate(${data.windDirection}deg)`;
    windSpeed.innerText = `Speed: ${data.windSpeed}m/sec`;
}

// background-color: rgba(232, 196, 12, 0.2); soleado
// background-color: rgba(0, 0, 0, 0.2); noche
// background-color: rgba(193, 178, 98, 0.2); parcialmente nublado dia
// background-color: rgba(78, 6, 213, 0.2); tormenta
// background-color: rgba(85, 83, 78, 0.2); nublado total / parcialmente noche
// background-color: rgba(56, 65, 184, 0.2); lluvia
// background-color: rgba(21, 179, 191, 0.2); nieve
// background-color: rgba(5, 26, 95, 0.2); niebla

