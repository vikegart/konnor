//const request = require('request');
const requestPromise = require('request-promise');
const TOKENS = require('../secret_tokens');
const apiKey = TOKENS.openWeather;
let city = 'saratov';
let saratovID = 498677;
//let urlWeatherNow = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
let urlWeatherNextFive = `http://api.openweathermap.org/data/2.5/forecast?id=${saratovID}&units=metric&appid=${apiKey}`

const regRain = /rain/i;

const DEBUG = false;
const urlProxy = 'http://142.93.202.233:8080';

let options = {
    uri: urlWeatherNextFive,
    json: true, // Automatically parses the JSON string in the response
    proxy: urlProxy,
};

const askForWeather = (newProxy) => {
    options.proxy = newProxy;
    return requestPromise(options).then(
        response => {
            const weather = response;
            for (let i = 0; i < 10; i++) {
                console.log(weather.list[i].weather[0].main);
                if (regRain.test(weather.list[i].weather[0].main)) {
                    //send rain alert
                    console.log(` ${weather.list[i].dt_txt} будет дождик, и температура ${weather.list[i].main.temp}`)
                    return `оу, кажется  ${weather.list[i].dt_txt} будет дождик, и температура составит ${weather.list[i].main.temp}`;
                }
            }
            console.log(`нет дождя будет ${weather.list[7].main.temp} градусов`);
            return `Дождя в ближайшие 9 часов не предвидится, а будет ${weather.list[2].main.temp} градусов`;

        },
        error => {
            console.log('promise weather error' + error);
            return 'не могу достучаться до погоды, кажется снова роскомнадзор шалит...';
        }
    )
}

DEBUG && askForWeather().then(
    response => {
        console.log('promise weather ' + response);
    },
    error => console.log('promise weather error' + error)
)

module.exports = {
    askForWeather: askForWeather,
};