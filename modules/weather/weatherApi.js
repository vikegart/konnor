const axios = require('axios');
const DARK_SKY_API_KEY = require('../../secret_tokens').darkSkyApi;
const DARK_SKY_WEATHER_URL = `https://api.darksky.net/forecast/${DARK_SKY_API_KEY}/`;
const GEOCODE_YANDEX_URL = 'https://geocode-maps.yandex.ru/1.x/?format=json&geocode=';
module.exports = {
    fetchWeatherForCity: (location) => {
        let city;
        const weatherRequest = (lat, lng) => {
            return new Promise((resolve, reject) => {
                let requestUrl = `${DARK_SKY_WEATHER_URL}${lat},${lng}?&units=si&extend=hourly&lang=ru`;
                return axios.get(requestUrl).then((response) => {
                    response.data.city = city;
                    return resolve(response.data);
                }).catch((e) => {
                    console.log(e);
                });
            })
        }
        return new Promise((resolve, reject) => {
            const encodedLocation = encodeURIComponent(location);
            const requestGeoUrl = `${GEOCODE_YANDEX_URL}${encodedLocation}`;
            return axios.get(requestGeoUrl)
                .then((res) => {
                    const point = res.data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos;
                    const [lng, lat] = point.split(' ');
                    city = res.data.response.GeoObjectCollection.featureMember[0].GeoObject.name;
                    return {
                        lat,
                        lng,
                    }
                }).then((cords) => {
                    return weatherRequest(cords.lat, cords.lng).then(result => {
                        return resolve(result);
                    }, error => {
                        return reject(error)
                    })
                })
        })
    },
}