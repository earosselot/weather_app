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
                data.wind.deg,
                params.units);
            return weather
        } catch(error) {
            console.log('error: ');
            console.log(error);
        }

    };


    async fetchAPI (params) {
        let APIkey = '652e61acc78edad67e8910709ea3d274';
        if (params['cityName']) {
            try {
                let rawData = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?q=${params.cityName}&appid=${APIkey}&units=${params.units}`,
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
                    `https://api.openweathermap.org/data/2.5/weather?lat=${params.lat}&lon=${params.long}&appid=${APIkey}&units=${params.units}`,
                    {mode: 'cors'});
                let json = await rawData.json();
                return json;
            } catch (error) {
                // TODO: manejar los errores 404, cuando no se ingresa una ciudad válida.
                console.log('error: ');
                console.log(error);
            }
        }
    };

    changeUnits(weather, units) {

    }
}


class Weather {
    constructor(_city, _weather, _description, _icon, _temp, _feelsLike, _country, _sunrise, _sunset, _timezone, _temp_min, _temp_max, _humidity, _clouds, _windSpeed, _windDirection, _units) {
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
        // TODO: wind units toggle m/sec -> mph
        this.windSpeed = _windSpeed;
        this.windDirection = _windDirection;
        this.units = _units;
        this.unitSymbol = this.setUnitsSymbol(_units);
    }

    calculateTimezone(sunrise, timezone) {
        let sunriseMs = sunrise * 1000;
        let timezoneMs = timezone * 1000;
        let date = new Date(sunriseMs);
        let offset = date.getTimezoneOffset() * 60000;
        return new Date(sunriseMs + offset + timezoneMs);
    }

    setUnitsSymbol(units) {
        if (units === 'metric') {
            return '°C';
        } else if (units === 'imperial') {
            return '°F';
        } else {
            return 'invalid units';
        }
    }

    toggleUnits() {
        if (this.units === 'metric') {
            this.temp = this.tempToImperial(this.temp);
            this.feelsLike = this.tempToImperial(this.feelsLike);
            this.temp_min = this.tempToImperial(this.temp_min);
            this.temp_max = this.tempToImperial(this.temp_max);
            this.units = 'imperial';
            this.unitSymbol = '°F';
            this.windSpeed = this.velocityToImperial(this.windSpeed);
        } else if (this.units === 'imperial') {
            this.temp = this.tempToMetric(this.temp);
            this.feelsLike = this.tempToMetric(this.feelsLike);
            this.temp_min = this.tempToMetric(this.temp_min);
            this.temp_max = this.tempToMetric(this.temp_max);
            this.units = 'metric';
            this.unitSymbol = '°C';
            this.windSpeed = this.velocityToMetric(this.windSpeed);
        }
    }

    tempToMetric(field) {
        field = (field - 32) * (5 / 9);
        return field
    }

    tempToImperial(field) {
        field = (field * (9 / 5)) + 32;
        return field
    }

    velocityToMetric(field) {
        field = field / 2.236936;
        return field;
    }

    velocityToImperial(field) {
        field = field * 2.236936;
        return field;
    }

}

export { WeatherServices }
