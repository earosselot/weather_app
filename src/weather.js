
class WeatherServices {

    async createWeather(cityName) {
        let data = await this.fetchAPI(cityName);
        let weather = new Weather(data.name, data.weather[0].main, data.weather[0].description, data.weather[0].icon, data.main.temp, data.main.feels_like);
        return weather
    };


    async fetchAPI (params, units = 'metric') {
        let APIkey = '652e61acc78edad67e8910709ea3d274';
        if (params['cityName']) {
            try {
                let rawData = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?q=${params.cityName}&appid=${APIkey}&units=${units}`,
                    {mode: 'cors'});
                let json = await rawData.json();
                return json;
            } catch (error) {
                console.log('error: ')
                console.log(error);
            }
        } else if (params['lat']) {
            try {
                let rawData = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${params.lat}&lon=${params.long}&appid=${APIkey}&units=${units}`,
                    {mode: 'cors'});
                let json = await rawData.json();
                return json;
            } catch (error) {
                console.log('error: ')
                console.log(error);
            }
        }

    };


    // GetData(json){
    //     let obj = {};
    //     obj['weather'] = json.weather.main;
    //     obj['description'] = json.weather.description;
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
    // };

}


class Weather {

    constructor(_city, _weather, _description, _icon, _temp, _feelsLike) {
        this.city = _city;
        this.weather = _weather;
        this.description = _description;
        this.icon = _icon;
        this.temp = _temp;
        this.feelsLike = _feelsLike;
    }

}


export { WeatherServices }
