import {WeatherServices} from "./weather";

// TODO: agregar loading mientras carga la API
let weatherServices = new WeatherServices();

//Check if browser supports W3C Geolocation API
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
}

//Get latitude and longitude;
function successFunction(position) {
    let params = {};
    params['lat'] = position.coords.latitude;
    params['long'] = position.coords.longitude;
    weatherServices.createWeather(params)
        .then((weather) => {
            displayData(weather);
        })
}

function errorFunction() {
    let params = {};
    params['cityName'] = 'Montevideo';
    weatherServices.createWeather(params)
        .then((weather) => {
            displayData(weather);
        })
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

// Search request
searchButton.addEventListener('click', () => {
    let params = {};
    params['cityName'] = searchInput.value;
    weatherServices.createWeather(params)
        .then((weather) => {
            displayData(weather);
        })
})


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
    feelsLikeField.innerText = `Feels like ${data.feelsLike}°C`;
}

