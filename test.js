const WHAT_TO_WEAR = "WHAT_TO_WEAR";
const WHAT_WEATHER = "WHAT_WEATHER";
const WHAT_TO_WEAR_AND_WHAT_WEATHER = "WHAT_TO_WEAR_AND_WHAT_WEATHER";


const hello =  (
    "Привет! Это навык 'По погоде' и я помогу вам одеться в соответствии с погодными условиями в Санкт-Петербурге." +
    "Если вы хотите узнать, как одеться сегодня, чтобы чувствовать себя комфортно, просто спросите меня: 'что мне надеть?'"+
    "Чтобы узнать прогноз погоды на сегодняшний день, скажите: 'какая сегодня погода?'"
)


const response = (answ) => {
    return (
        {
            'response': answ,
            'version': '1.0'
        }
    )
}

const whatIsCommand = (command) => {
    if(command === "что мне надеть"){
        return WHAT_TO_WEAR;
    }
    if(command === "какая сегодня погода"){
        return WHAT_WEATHER;
    }
    if(command === "что мне надеть и какая сегодня погода"){
        return WHAT_TO_WEAR_AND_WHAT_WEATHER;
    }
}

const res = (text, buttons) => {
    return {
        'text': text,
        'buttons': buttons
    }
}


class Weather {
    constructor() {

    }
}

class Wear {

    constructor() {
        this.weather = new Weather();
    }


    getWearAtToday(){
        return "надень че та"
    }
}


const answer = (command) => {
    switch(command){
        case WHAT_TO_WEAR:{
            return res("надень что нибудь", );
        }
        case WHAT_WEATHER:{
            return res("ты в питере детка", []);
        }
        case WHAT_TO_WEAR_AND_WHAT_WEATHER:{
            return res("надень футболку и в рюкзак засунь куртку", []);
        }
        default:{
            const buttons = [
                {"title": "что мне надеть","hide": true},
                {"title": "какая сегодня погода", "hide": true}
            ]
            return res("Не поняла вас. Хотите, чтобы я посоветовала, как вам сегодня одеться?", buttons)
        }
    }
}

module.exports.handler = async function (event, context) {
    const command = context._data.request.command;
    if(command === ""){
        const buttons = [
            {"title": "что мне надеть","hide": true},
            {"title": "какая сегодня погода", "hide": true}
        ]
        return response(res(hello, buttons));
    }
    const commandIs = whatIsCommand(command)

    return response(answer(commandIs)) // функция будет ассинхронной
};