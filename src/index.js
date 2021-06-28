import {WeatherServices} from "./weather";

// const APIkey = '652e61acc78edad67e8910709ea3d274';
// let cityName1 = 'Mendoza';
// Weather(APIkey, cityName1).then((resolve) => console.log(resolve));


let cityName = 'Neuquen';
let weatherServices = new WeatherServices();
weatherServices.createWeather(cityName).then((resolve) => console.log(resolve));


const mainField = document.getElementById('main-field');
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input')

searchInput.addEventListener('keyup', (event) => {
    if (event.code === "Enter") {
        event.preventDefault();
        searchButton.click();
    }
});

searchButton.addEventListener('click', () => {
    const inputValue = searchInput.value;
    weatherServices.createWeather(inputValue)
        .then((data) => {
            displayData(data, mainField);
        })
})


// Erases previous data on the App and renders the new data
function displayData (data, field) {
    field.innerHTML = '';
    displayField(data.temp, field);
}


// Creates a div element and displays data within DOMelement
function displayField (fieldData, DOMelement) {
    const field = document.createElement('div');
    field.textContent = fieldData;
    DOMelement.appendChild(field);
}


const DisplayControl = (() => {
    return {}
})();

// Weather function hits the weather api with the parameters passed and returns an object with fields used by the App
// async function Weather(APIkey, cityName, units = 'metric') {
//     let rawData = await fetch(
//         `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${APIkey}&units=${units}`,
//         {mode: 'cors'});
//     let data = await rawData.json();
//     return GetData(data);
// }


// Get data takes the weather json in and returns an object with only the data required by the app
// function GetData(json) {
//     let obj = {};
//     obj['weather'] = json.weather[0].main;
//     obj['description'] = json.weather[0].description;
//     obj['temp'] = json.main.temp;
//     obj['feelsLike'] = json.main.feels_like;
//     // json.main.temp_min
//     // json.main.temp_max
//     // json.main.pressure
//     // json.main.humidity
//     // json.clouds.all  // % of clouds
//     obj['city'] = json.name;  // city name
//     // json.sys.country  // country code 'AR', 'GB', 'JP', etc...
//     // json.sys.sunrise  // sunrise time, unix, UTC
//     // json.sys.sunset // sunset time, unix, UTC
//     // json.timezone  // shift in seconds form UTC
//     return obj;
// }


