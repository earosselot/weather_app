import {WeatherServices} from "./weather";

let weatherServices = new WeatherServices();

//Check if browser supports W3C Geolocation API
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(geolocationWeather, defaultWeather);
}

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
    const tempCard = document.getElementById('temp-card');
    showSpinner(tempCard);
    let weather = await weatherServices.createWeather(params);
    displayData(weather);
    hideSpinner(tempCard);
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
    const tempField = document.getElementById('temperature-text');
    const weatherField = document.getElementById('weather-text');
    const tempCardImage = document.getElementById('temp-card-image');
    const cityNameField = document.getElementById('city-name');
    const feelsLikeField = document.getElementById('feels-like');

    tempField.innerText = '';
    tempField.innerText = Math.round(data.temp) + '°C';

    weatherField.innerText = '';
    weatherField.innerText = data.weather;

    tempCardImage.setAttribute('src', `design/SVG/${data.icon}.svg`);

    cityNameField.innerText = '';
    cityNameField.innerText = `${data.city} (${data.country})`;

    feelsLikeField.innerText = '';
    feelsLikeField.innerText = `Feels like ${Math.round(data.feelsLike)}°C`;
}

