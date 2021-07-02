class WeatherServices {
    date;
    feels_like;

    async createWeather(params) {
        try {
            let data = await this.fetchAPI(params);
            let weather = new Weather(
                data.name,
                data.weather[0].main,
                data.weather[0].description,
                data.weather[0].icon,
                data.main.temp,
                data.main.feels_like,
                data.sys.country,
                data.sys.sunrise,
                data.sys.sunset,
                data.timezone,
                data.main.temp_min,
                data.main.temp_max,
                data.main.humidity,
                data.clouds.all,
                data.wind.speed,
                data.wind.deg);
            return weather
        } catch(error) {
            console.log('error: ');
            console.log(error);
        }

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
                console.log('error: ');
                console.log(error);
            }
        } else if (params['lat']) {
            try {
                let rawData = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${params.lat}&lon=${params.long}&appid=${APIkey}&units=${units}`,
                    {mode: 'cors'});
                let json = await rawData.json();
                console.log(json);
                return json;
            } catch (error) {
                console.log('error: ');
                console.log(error);
            }
        }

    };
}


class Weather {
    constructor(_city, _weather, _description, _icon, _temp, _feelsLike, _country, _sunrise, _sunset, _timezone, _temp_min, _temp_max, _humidity, _clouds, _windSpeed, _windDirection) {
        this.city = _city;
        this.weather = _weather;
        this.description = _description;
        this.icon = _icon;
        this.temp = _temp;
        this.feelsLike = _feelsLike;
        this.country = _country;
        this.sunrise = this.calculateTimezone(_sunrise, _timezone);
        this.sunset = this.calculateTimezone(_sunset, _timezone)
        this.temp_min = _temp_min;
        this.temp_max = _temp_max;
        this.humidity = _humidity;
        this.clouds = _clouds;
        this.windSpeed = _windSpeed;
        this.windDirection = _windDirection;
    }

    calculateTimezone(sunrise, timezone) {
        let sunriseMs = sunrise * 1000;
        let timezoneMs = timezone * 1000;
        let date = new Date(sunriseMs);
        let offset = date.getTimezoneOffset() * 60000;
        return new Date(sunriseMs + offset + timezoneMs);
    }
}

export { WeatherServices }
