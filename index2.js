const fetch = require("node-fetch");

const API_KEY = '4144b224-125d-48a5-a15f-01a2b0834291';


const url = "https://api.weather.yandex.ru/v2/forecast?lat=59.9386&lon=30.3141"

const config = {
    headers: {
        'X-Yandex-API-Key': API_KEY
    }
}


const getWeather = () => {
    return new Promise(((resolve, reject) => {
        fetch(url, config)
            .then(async res => {
                const data = await res.json()
                console.log(data.fact)
                console.log(data.forecasts[0])
                resolve(data)
            })
    }))
}


getWeather()