const incCountInvalidAnswer = (count_invalid_answer) => {
    if(user_said_something_incomprehensible.length - 1 > count_invalid_answer)
        return count_invalid_answer + 1;
    return 2;
}


const user_said_something_incomprehensible = [
    {
        'answer':  "Не поняла вас. Хотите, чтобы я посоветовала, как вам сегодня одеться?",
        'buttons':    [{"title": "что мне надеть","hide": true}]
    },
    {
        'answer': "Хотите узнать какая сегодня погода?",
        'buttons':   [{"title": "какая сегодня погода","hide": true}]
    },
    {
        'answer': "Кажется, я так не умею... Попробуем еще раз или закрыть навык?",
        'buttons':   [{"title": "пока","hide": true}]
    },
    {
        'answer': "Если вы хотите узнать, как одеться сегодня, чтобы чувствовать себя комфортно, просто спросите меня: 'что мне надеть?'" +
            "Чтобы узнать прогноз погоды на сегодняшний день, скажите: 'какая сегодня погода?'"
    }
]

const WHAT_TO_WEAR = "WHAT_TO_WEAR"; //надеть
const WHAT_WEATHER = "WHAT_WEATHER"; // погода
const WHAT_TO_WEAR_AND_WHAT_WEATHER = "WHAT_TO_WEAR_AND_WHAT_WEATHER"; // чез погода че надеть
const USER_SAID_SOMETHING_INCOMPREHENSIBLE = "USER_SAID_SOMETHING_INCOMPREHENSIBLE"; // не понял
const BUY_BUY = "BUY_BUY"; // не понял


const alice_answers_after_inc = [
    WHAT_TO_WEAR,
    WHAT_WEATHER,
    BUY_BUY
]


const hello = (
    "Привет! Это навык 'По погоде' и я помогу вам одеться в соответствии с погодными условиями в Санкт-Петербурге." +
    "Если вы хотите узнать, как одеться сегодня, чтобы чувствовать себя комфортно, просто спросите меня: 'что мне надеть?'" +
    "Чтобы узнать прогноз погоды на сегодняшний день, скажите: 'какая сегодня погода?'"
)


const response = (answ) => {
    return answ;
}


const res = (text, buttons, count_invalid_answer, end_session = false) => {
    return {
        'response': {
            'text': text,
            'buttons': buttons,
            "end_session": end_session
        },
        'session_state': {
            'count_invalid_answer': count_invalid_answer
        },
        'version': '1.0'
    }
}


const whatToWear = () => {
    return "Брр сегодня дико холодно!" +
        "Надевайте все самое теплое, что у вас есть: шапка-ушанка, шарф и теплые перчатки. Термобелье, дутые штаны и несколько слоев верхней одежды сейчас придутся очень кстати." +
        "В качестве обуви выбирайте утепленные ботинки или зимние сапоги." +
        "Надеюсь, вы не замерзнете!"
}


const whatWeather = () => {
    return "Облачно с прояснениями. В ближайшие 2 часа осадков не ожидается"
}

const answer = (command, what_number_answer) => {
    switch (command) {
        case WHAT_TO_WEAR: {
            const buttons =  [{"title": "какая сегодня погода","hide": true}]
            return res(whatToWear(), buttons, 0);
        }
        case WHAT_WEATHER: {
            const buttons =  [{"title": "что мне надеть","hide": true}]
            return res(whatWeather(), buttons, 0);
        }
        case WHAT_TO_WEAR_AND_WHAT_WEATHER: {
            return res("надень футболку и в рюкзак засунь куртку", [], 0);
        }
        case BUY_BUY: {
            return res("До новых встреч!", [], 0, true)
        }
        case USER_SAID_SOMETHING_INCOMPREHENSIBLE: {
            const nowWeAnswer = user_said_something_incomprehensible[what_number_answer];
            const updated_invalid_answer = incCountInvalidAnswer(what_number_answer);
            const buttons = nowWeAnswer.buttons;
            const answer =  nowWeAnswer.answer;
            return res(answer, buttons, updated_invalid_answer)
        }
    }
}

const whatIsCommand = (command, count_invalid_answer) => {
    if (command === "что мне надеть") {
        return WHAT_TO_WEAR;
    }
    if (command === "какая сегодня погода") {
        return WHAT_WEATHER;
    }
    if (command === "что мне надеть и какая сегодня погода") {
        return WHAT_TO_WEAR_AND_WHAT_WEATHER;
    }
    if(command === "да"){
        return alice_answers_after_inc[count_invalid_answer - 1];
    }
    if(command === "пока" || command === "закрыть навык" || command === "закрой навык") {
        return BUY_BUY
    }
    return USER_SAID_SOMETHING_INCOMPREHENSIBLE;
}



module.exports.handler = async function (event, context) {
    const command = context._data.request.command.toLowerCase();

    if (command === "") {
        const buttons = [
            {"title": `что мне надеть`, "hide": true},
            {"title": "какая сегодня погода", "hide": true}
        ]
        return response(res(hello, buttons, 0));
    }
    const count_invalid_answer = context._data.state.session.count_invalid_answer;

    const commandIs = whatIsCommand(command, count_invalid_answer);

    return response(answer(commandIs, count_invalid_answer))
};