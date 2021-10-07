const express = require("express");
const app = express();
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
                const data = await res.json();
                const fact = data.fact;
                const forecastsNow = data.forecasts[0]
                const date = new Date(data.now * 1000);
                const timeNow = date.getHours() + 3;
                const stepOfHourWeather = (() => {
                        if (timeNow >= 0 && timeNow < 6) {
                            return {
                                now: {part: "night", now: fact}, //0
                                morning: {part: "morning", morning: forecastsNow.hours[5]},
                                day: {part: "day", day: forecastsNow.hours[11]},
                            }
                        }
                        if (timeNow >= 6 && timeNow < 12) {
                            return {
                                now: {part: "morning", now: fact},//5
                                day: {part: "day", day: forecastsNow.hours[11]},
                                evening: {part: "evening", evening: forecastsNow.hours[17]},
                            }
                        }
                        if (timeNow >= 12 && timeNow < 18) {
                            return {
                                now: {part: "day", now: fact},//11
                                evening: {part: "evening", evening: forecastsNow.hours[17]},
                                day: {part: "night", day: forecastsNow.hours[23]},
                            }
                        }
                        if (timeNow >= 18 && timeNow < 23) {
                            return {
                                now: {part: "evening", now: fact},//17
                                night: {part: "night", night: forecastsNow.hours[23]},
                                morning: {part: "morning", morning: forecastsNow.hours[23]},
                            }
                        }
                        if (timeNow >= 23) {
                            const forecastsTomorrow = data.forecasts[1]
                            return {
                                now: {part: "night", now: fact},//23
                                morning: {part: "morning", morning: forecastsTomorrow.hours[5]},
                                day: {part: "day", day: forecastsTomorrow.hours[11]},
                            }
                        }
                    }
                )()
                resolve(stepOfHourWeather)
            })
    }))
}


const incCountInvalidAnswer = (count_invalid_answer) => {
    if (user_said_something_incomprehensible.length - 1 > count_invalid_answer)
        return count_invalid_answer + 1;
    return 2;
}


const user_said_something_incomprehensible = [
    {
        'answer': "Не поняла вас. Хотите, чтобы я посоветовала, как вам сегодня одеться?",
        'buttons': [{"title": "что мне надеть", "hide": true}]
    },
    {
        'answer': "Хотите узнать какая сегодня погода?",
        'buttons': [{"title": "какая сегодня погода", "hide": true}]
    },
    {
        'answer': "Кажется, я так не умею... Попробуем еще раз или закрыть навык?",
        'buttons': [{"title": "пока", "hide": true}]
    },
    {
        'answer': "Если вы хотите узнать, как одеться сегодня, чтобы чувствовать себя комфортно, просто спросите меня: 'что мне надеть?'" +
            "Чтобы узнать прогноз погоды на сегодняшний день, скажите: 'какая сегодня погода?'"
    }
]

const WHAT_TO_WEAR = "WHAT_TO_WEAR"; //надеть
const WHAT_WEATHER = "WHAT_WEATHER"; // погода
const WHAT_CAN_YOU_DO = "WHAT_CAN_YOU_DO"; // погода
const USER_SAID_SOMETHING_INCOMPREHENSIBLE = "USER_SAID_SOMETHING_INCOMPREHENSIBLE"; // не понял
const BUY_BUY = "BUY_BUY"; // не понял
const REPEAT_YET = "REPEAT_YET"; // не понял


const alice_answers_after_inc = [
    WHAT_TO_WEAR,
    WHAT_WEATHER,
    REPEAT_YET
]


const hello = (
    "Привет! Это навык 'По погоде' и я помогу вам одеться в соответствии с погодными условиями в Санкт-Петербурге. " +
    "Если вы хотите узнать, как одеться сегодня, чтобы чувствовать себя комфортно, просто спросите меня: 'что мне надеть?'"
)




const chekRain = (condition) => {
    const rainValues = ["drizzle", "light-rain", "rain", "heavy-rain", "continuous-heavy-rain", "showers", "wet-snow", "thunderstorm", "thunderstorm-with-rain"]
    return !!rainValues.indexOf(condition);
}

const getWeatherScenario = (part) => {
    const feels_like = part.feels_like;
    const condition = part.condition;
    const prec_prob = part.prec_prob;
    const rainWillBe = chekRain(condition);
    const [umbrella, waterproofShoes] = (() => {
        if (prec_prob > 30)
            return ["Не забудьте взять зонтик!", ", которые выдержат сырую погоду."];
        if (prec_prob <= 30 && prec_prob > 0)
            return ["Возможно, вам понадобится зонтик, но это не точно.", ", которые выдержат сырую погоду."];
        return ["", ""];
    })()
    if (feels_like < -25) {
        return "Брр сегодня дико холодно!" +
            "Надевайте все самое теплое, что у вас есть: шапка-ушанка, шарф и теплые перчатки. Термобелье, дутые штаны и несколько слоев верхней одежды сейчас придутся очень кстати." +
            "В качестве обуви выбирайте утепленные ботинки или зимние сапоги." +
            "Надеюсь, вы не замерзнете!"
    }
    if (feels_like >= -25 && feels_like < -20) {
        return "Одевайтесь потеплее: шапка, шарф, перчатки. Обязательно теплую кофту под длинную зимнюю куртку или пуховик. Термобелье или дутые штаны тоже не помешают. " +
            "В качестве обуви выбирайте утепленные ботинки или зимние сапоги."
    }
    if (feels_like >= -20 && feels_like <= -15) {
        return "Наденьте длинную зимнюю куртку, шапку, шарф и перчатки. " +
            "Выбирайте штаны потеплее. " +
            "Несколько хлопковых вещей, надетых друг на друга, будут лучше толстого теплого свитера, надетого на голое тело. В качестве обуви выбирайте утепленные ботинки или зимние сапоги."
    }
    if (feels_like >= -15 && feels_like < -10) {
        return "Наденьте длинную зимнюю куртку, шапку, шарф и перчатки. " +
            "Выбирайте штаны потеплее. " +
            "Несколько хлопковых вещей, надетых друг на друга, будут лучше толстого теплого свитера, надетого на голое тело. В качестве обуви выбирайте утепленные ботинки или зимние сапоги."
    }
    if (feels_like >= -10 && feels_like < -5) {
        return "Сегодня подойдет дутая куртка или утепленное пальто, шарф, шапка или капюшон, перчатки. " +
            "В качестве обуви выбирайте утепленные ботинки или зимние сапоги."
    }
    if (feels_like >= -5 && feels_like < 0) {
        return `Сегодня подойдет зимняя куртка или можно  надеть теплую кофту под осеннее пальто. Наденьте шарф, шапку или капюшон. Возьмите перчатки. В качестве обуви выбирайте утепленные ботинки${waterproofShoes}. ${umbrella}`
    }
    if (feels_like >= 0 && feels_like < 5) {
        return "Наденьте теплую кофту под осеннюю куртку или пальто. Если у вас часто мерзнут руки, то возьмите перчатки. " +
            `На голову наденьте легкую шапку или капюшон. На шею подойдет легкий шарф или платок. В качестве обуви выбирайте демисезонные ботинки${waterproofShoes}. ${umbrella}`
    }
    if (feels_like >= 5 && feels_like < 10) {
        return "Наденьте кофту под осеннюю куртку или пальто. Если у вас часто мерзнут руки, то возьмите легкие перчатки. " +
            `На голову наденьте легкую шапку или капюшон. На шею подойдет легкий шарф или платок. В качестве обуви выбирайте демисезонные ботинки или кроссовки${waterproofShoes}. ${umbrella}`
    }
    if (feels_like >= 10 && feels_like < 15) {
        return `наденьте осеннюю куртку. если мёрзнут уши, то подойдет легкая шапка или капюшон. в качестве обуви выбирайте кроссовки или ботинки. ${umbrella}`
    }
    if (feels_like >= 15 && feels_like < 20) {
        return "наденьте кофту или легкую куртку. на ноги подойдут кроссовки или неутепленные ботинки."
    }
    if (feels_like >= 20 && feels_like < 25) {
        return `в футболке и джинсах будет отлично. если вы часто мерзнете, то можете накинуть легкую кофту. в качестве обуви подойдут нежаркие ботинки или кеды. ${umbrella}`
    }
    if (feels_like >= 20 && feels_like < 25) {
        return `в футболке и джинсах будет отлично. если вы часто мерзнете, то можете накинуть легкую кофту. в качестве обуви подойдут нежаркие ботинки или кеды. ${umbrella}`
    }
    if (feels_like > 25) {
        return `оденьтесь как можно легче, сегодня очень жарко. не забудьте про солнцезащитный крем и кепку. ${umbrella}`
    }
    return "к сожалению не могу вам ничего сказать"
}

const whatToWear = (stepOfTheHeader, when) => {
    return getWeatherScenario(stepOfTheHeader[when][when])

}

const generatingAForecast = (part, timeOfDay) => {

    const partName = (() => {
        if (timeOfDay === "day") return "днем";
        if (timeOfDay === "evening") return "вечером";
        if (timeOfDay === "night") return "ночью";
        if (timeOfDay === "morning") return "утром";
    })()

    const wind_speed = (() => {
        if (part.wind_speed < 5) return "ветер слабый";
        if (part.wind_speed < 8) return "ветер умеренный";
        if (part.wind_speed <= 15) return "ветер сильный";
        if (part.wind_speed > 15 && part.wind_speed <= 20) return "ветер очень сильный";
        if (part.wind_speed > 20) return "ветер очень очень сильный";
    })()

    const condition = (() => {
        if (part.condition === "clear") return "ясная погода";
        if (part.condition === "partly-cloudy") return "небольшая облачность";
        if (part.condition === "cloudy") return "небольшая облачность с прояснениями";
        if (part.condition === "overcast") return "пасмурная погода";
        if (part.condition === "drizzle") return "морось";
        if (part.condition === "light-rain") return "небольшой дождь";
        if (part.condition === "rain") return "дождь";
        if (part.condition === "moderate-rain") return "умеренно сильный дождь";
        if (part.condition === "heavy-rain") return "сильный дождь";
        if (part.condition === "continuous-heavy-rain") return "длительный сильный дождь";
        if (part.condition === "showers") return "ливень";
        if (part.condition === "wet-snow") return "дождь со снегом";
        if (part.condition === "light-snow") return "небольшой снег";
        if (part.condition === "snow") return "снег";
        if (part.condition === "hail") return "град";
        if (part.condition === "snow-showers") return "снегопад";
        if (part.condition === "thunderstorm") return "гроза";
        if (part.condition === "thunderstorm-with-rain") return "дождь с грозой";
        if (part.condition === "thunderstorm-with-hail") return "гроза с градом";
    })()


    return `Сегодня ${partName} ожидается ${condition}. Температура ${part.temp}°C, ощущается как ${part.feels_like}°C, градусов, ${wind_speed}.`

}


const whatWeather = (stepOfTheHeader, when) => {
    return generatingAForecast(stepOfTheHeader[when][when], stepOfTheHeader[when].part)
}



const response =  ({
                            text,
                            buttons = [],
                            count_invalid_answer = 0,
                            end_session = false,
                            nextPartWeather = {},
                            timeOfDay = [],
                            stepOfTheHeader
                        }) => {
    return {
        'response': {
            'text': text,
            'buttons': buttons,
            "end_session": end_session
        },
        'session_state': {
            'count_invalid_answer': count_invalid_answer,
            'nextPartWeather': nextPartWeather,
            "timeOfDay": timeOfDay,
            "stepOfTheHeader": stepOfTheHeader
        },
        'version': '1.0'
    }
}


const answer =  (command, what_number_answer, stepOfTheHeader, timeOfDay = "now") => {
    switch (command) {
        case WHAT_TO_WEAR: {
            const buttons = [{"title": "какая сейчас погода", "hide": true}, {"title": "что ты умеешь", "hide": true}, {"title": "пока", "hide": true}]
            const text = whatToWear(stepOfTheHeader, "now")
            return {text, buttons};
        }
        case WHAT_TO_WEAR_LATER: {
            const buttons = [{"title": "пока", "hide": true}, {"title": "какая сегодня погода", "hide": true}, {"title": "что ты умеешь", "hide": true}]
            const text = whatToWear(stepOfTheHeader, timeOfDay)
            return {text, buttons};
        }
        case ALICA_CANT_SAY_WEAR: {
            const [firstStepOfDay, secondStepOfDay] = (() => {
                let timesOfDay = [];
                if (stepOfTheHeader["day"]) timesOfDay.push("днем")
                if (stepOfTheHeader["morning"]) timesOfDay.push("утром")
                if (stepOfTheHeader["evening"]) timesOfDay.push("вечером")
                if (stepOfTheHeader["night"]) timesOfDay.push("ночью")
                return timesOfDay;
            })()
            const buttons = [
                {title: `что надеть ${firstStepOfDay}`, "hide": true},
                {title: `что надеть ${secondStepOfDay}`, "hide": true}
            ]
            const text = "К сожалению на это время суток я не могу вам ничего пподсказать"
            return {text, buttons};
        }
        case WHAT_CAN_YOU_DO: {
            const [now, firstStepOfDay, secondStepOfDay, timesOfDay] = (() => {
                let timesOfDay = [];
                timesOfDay.push("сейчас")
                if (stepOfTheHeader["now"].part === "morning") {
                    timesOfDay.push("днем")
                    timesOfDay.push("вечером")
                    timesOfDay.push(`${timesOfDay[0]}, ${timesOfDay[1]} или ${timesOfDay[2]}`)
                }
                if (stepOfTheHeader["now"].part === "day") {
                    timesOfDay.push("вечером")
                    timesOfDay.push("")
                    timesOfDay.push(`${timesOfDay[0]} или ${timesOfDay[1]}`)
                }
                if (stepOfTheHeader["now"].part === "evening") {
                    timesOfDay.push("ночью")
                    timesOfDay.push("")
                    timesOfDay.push(`${timesOfDay[0]} или ${timesOfDay[1]}`)
                }
                if (stepOfTheHeader["now"].part === "night") {
                    timesOfDay.push("утром")
                    timesOfDay.push("днем")
                    timesOfDay.push(`${timesOfDay[0]}, ${timesOfDay[1]} или ${timesOfDay[2]}`)
                }
                return timesOfDay;
            })()

            const text = `Могу рассказать, что надеть ${timesOfDay} и какая погода ${timesOfDay}.`
            const buttons = [
                {title: `что надеть ${now}`, "hide": true},
                {title: `что надеть ${firstStepOfDay}`, "hide": true},
            ]
            if (secondStepOfDay !== "") {
                buttons.push({title: `что надеть ${secondStepOfDay}`, "hide": true})
            }
            buttons.push({title: `какая погода сегодня ${now}`, "hide": true})
            buttons.push({title: `какая погода сегодня ${firstStepOfDay}`, "hide": true})
            if (secondStepOfDay !== "") {
                buttons.push({title: `какая погода сегодня ${secondStepOfDay}`, "hide": true})
            }
            return {text, buttons};
        }
        case WHAT_WEATHER: {
            const buttons = [{"title": "что мне надеть", "hide": true}]
            const text = whatWeather(stepOfTheHeader, timeOfDay);
            return {text, buttons, stepOfTheHeader};
        }
        case BUY_BUY: {
            const text = "До новых встреч!";
            const end_session = true;
            return {text, end_session}
        }
        case REPEAT_YET: {
            const text = "подсказать как вам одеться?";
            const buttons = [{"title": "да", "hide": true}]
            const count_invalid_answer = 1;
            return {text, buttons, count_invalid_answer, stepOfTheHeader}
        }
        case USER_SAID_SOMETHING_INCOMPREHENSIBLE: {
            const nowWeAnswer = user_said_something_incomprehensible[what_number_answer];
            const count_invalid_answer = incCountInvalidAnswer(what_number_answer);
            const buttons = nowWeAnswer.buttons;
            const text = nowWeAnswer.answer;
            return {text, buttons, count_invalid_answer}
        }
    }
}


const ALICA_CANT_SAY_WEAR = "ALICA_CANT_SAY_WEAR"
const WHAT_TO_WEAR_LATER = "WHAT_TO_WEAR_LATER"


const whatIsCommand = (command, count_invalid_answer, stepOfTheHeader, tokens) => {
    if (command === "что мне надеть" || command === "что мне надеть сейчас" || command === "что надеть сейчас" || command === "что сейчас надеть") {
        return [WHAT_TO_WEAR];
    }
    if (command === "что ты умеешь" || command === "что еще ты умеешь" || command === "что умеешь" || command === "что можешь еще" || command === "что еще ты можешь" || command === "что ты можешь") {
        return [WHAT_CAN_YOU_DO]
    }

    if (tokens.indexOf("надеть") !== -1 || tokens.indexOf("одеться") !== -1) {
        const timeOfDay = (() => {
            if (tokens.indexOf("днем") > 0) return "day"
            if (tokens.indexOf("утром") > 0) return "morning"
            if (tokens.indexOf("вечером") > 0) return "evening"
            if (tokens.indexOf("ночью") > 0) return "night"
        })()
        if (!!stepOfTheHeader[timeOfDay])
            return [WHAT_TO_WEAR_LATER, timeOfDay]
        return [ALICA_CANT_SAY_WEAR]
    }
    if (tokens.indexOf("погода") !== -1 && (tokens.indexOf("днем") !== -1 || tokens.indexOf("вечером") !== -1 || tokens.indexOf("утром") !== -1 || tokens.indexOf("ночью") !== -1)) {
        const timeOfDay = (() => {
            if (tokens.indexOf("днем") > 0) return "day"
            if (tokens.indexOf("утром") > 0) return "morning"
            if (tokens.indexOf("вечером") > 0) return "evening"
            if (tokens.indexOf("ночью") > 0) return "night"
        })()

        if (!!stepOfTheHeader[timeOfDay])
            return [WHAT_WEATHER, timeOfDay]
        return [ALICA_CANT_SAY_WEAR]
    }

    if (tokens.indexOf("погода") !== -1) {
        return [WHAT_WEATHER, "now"]
    }
    if (command === "да") {
        return [alice_answers_after_inc[count_invalid_answer - 1]];
    }
    if (command === "пока" || command === "закрыть навык" || command === "закрой навык") {
        return [BUY_BUY]
    }
    return [USER_SAID_SOMETHING_INCOMPREHENSIBLE];
}
app.use(express.json())    // <==== parse request body as JSON


app.post("/alice", async function (req, res) {

    const command = req.body.request.command;

    if (command === "") {

        const buttons = [
            {"title": `что мне надеть`, "hide": true},
            {"title": "какая сегодня погода", "hide": true},
            {"title": "что ты умеешь", "hide": true}
        ]
        const text = hello;
        const stepOfTheHeader = await getWeather();
        res.send(response({text, buttons, stepOfTheHeader}));
    } else {
        const count_invalid_answer = req.body.state.session.count_invalid_answer;
        const stepOfTheHeader = req.body.state.session.stepOfTheHeader;
        const tokens = req.body.request.nlu.tokens;
        const [commandIs, timeOfDay] = whatIsCommand(command, count_invalid_answer, stepOfTheHeader, tokens);
        const answ = answer(commandIs, count_invalid_answer, stepOfTheHeader, timeOfDay)
        answ["stepOfTheHeader"] = stepOfTheHeader;
        res.send( response(answ));
    }
});


app.listen(3000, function () {
    console.log("Сервер ожидает подключения...");
});


