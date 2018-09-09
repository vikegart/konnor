const moment = require('moment-timezone');
moment.locale('ru');

module.exports = {
    dayTime(hourly, timezone) {
        hourly = hourly.filter((hour) => {
            return moment(hour.time * 1000).tz(timezone).hour() === 3 || moment(hour.time * 1000).tz(timezone).hour() === 7 || moment(hour.time * 1000).tz(timezone).hour() === 15 || moment(hour.time * 1000).tz(timezone).hour() === 21;
        })
        return hourly;
    },
    insertHours(daily, hourly, timezone) {
        daily.forEach((day) => {
            day.hourly = [];
            let dayOfWeek = moment(day.time * 1000).tz(timezone).format('dddd');
            hourly.forEach((hour) => {
                let hourDay = moment(hour.time * 1000).tz(timezone).format('dddd')
                if (dayOfWeek === hourDay) {
                    day.hourly.push(hour);
                }

            });
            day.hourly = this.dayTime(day.hourly, timezone);
        })
        return daily;
    },
    floorTemp(temperature) {
        return temperature > 0 ? `+${Math.round(temperature)}` : Math.round(temperature);
    },
    generateMessage(messageObj, weather, array) {
        let condition = array[2].toLowerCase();
        let daily = this.insertHours(weather.daily.data, weather.hourly.data, weather.timezone);
        switch (condition) {
            case 'сейчас':
                return this.generateCurrentForecast(weather.currently, array[1]);
                break;
            case 'завтра':
                return this.generateTomorrowForecast(daily[1], array[1]);
                break;
            case 'сегодня':
                return this.generateTodayForecast(daily[0], array[1]);
                break;
            case 'неделя':
                return this.generateWeekForecast(weather.daily, array[1], weather.timezone);
            default:
                return "я понимаю только 'завтра' 'сейчас' 'сегодня' 'неделя' "
        }
    },
    generateCurrentForecast(currently, city) {
        let temperature = this.floorTemp(currently.temperature);
        let apparentTemperature = this.floorTemp(currently.apparentTemperature);
        let precipChance = Math.round(currently.precipProbability * 100);
        let humidity = Math.round(currently.humidity * 100);
        let windSpeed = Math.round(currently.windSpeed * 1.6 * 100) / 100;
        let precipString = precipChance === 0 ? `Без осадков.` : `Вероятность осадков - ${precipChance}%`;
        return `Сейчас в городе ${city}: ${currently.summary.toLowerCase()}
        Температура - ${temperature}, чувствуется как - ${apparentTemperature}.
        ${precipString}
        Влажность: ${humidity}%.
        Ветер: ${windSpeed} км/ч.
        `
    },
    generateTomorrowForecast(tomorrow, city) {
        let temperatureMax = this.floorTemp(tomorrow.temperatureMax);
        let temperatureMin = this.floorTemp(tomorrow.temperatureMin);
        let apparentMax = this.floorTemp(tomorrow.apparentTemperatureMax);
        let apparentMin = this.floorTemp(tomorrow.apparentTemperatureMin);
        let windSpeed = Math.round(tomorrow.windSpeed * 1.6 * 100) / 100;
        let humidity = Math.round(tomorrow.humidity * 10000) / 100;
        let precipString = tomorrow.precipProbability === 0 ? 'Без осадков' : `Вероятность осадков - ${tomorrow.precipProbability * 100}%`;
        return `Завтра в городе ${city}: ${tomorrow.summary.toLowerCase()} 
        Температура днем: ${temperatureMax}, ночью: ${temperatureMin}.
        Чувствуется как ${apparentMax} и ${apparentMin}.
        ${precipString}
        Влажность: ${humidity}%.
        Ветер: ${windSpeed} км/ч. 
        `
    },
    generateTodayForecast(today, city) {
        let temperatureMax = this.floorTemp(today.temperatureMax);
        let temperatureMin = this.floorTemp(today.temperatureMin);
        let apparentMax = this.floorTemp(today.apparentTemperatureMax);
        let apparentMin = this.floorTemp(today.apparentTemperatureMin);
        let windSpeed = Math.round(today.windSpeed * 1.6 * 100) / 100;
        let humidity = Math.round(today.humidity * 10000) / 100;
        let precipString = today.precipProbability === 0 ? 'Без осадков' : `Вероятность осадков - ${today.precipProbability * 100}%`
        return `Сегодня в городе ${city}: ${today.summary.toLowerCase()}
        Температура днем - ${temperatureMax}, ночью - ${temperatureMin}.
        Чувствуется как ${apparentMax} и ${apparentMin}.
        ${precipString}
        Влажность: ${humidity}%.
        Ветер: ${windSpeed} км/ч.`
    },
    generateWeekForecast(week, city, timezone) {
        let weekForecast = week.data;
        let response = `${week.summary}`;
        weekForecast.forEach((day) => {
            let dayString = this.generateTodayForecast(day, city);
            let dayName = moment(day.time * 1000).tz(timezone).format('dddd');
            dayName = dayName[0].toUpperCase() + dayName.substring(1, dayName.length);
            console.log('day', dayName);
            dayString = dayString.replace('Сегодня', dayName);
            console.log('dayString', dayString);
            response = response + '\n\n' + dayString;
        });
        return response;
    }
}