const express = require("express");
const app = express();


class Weather {

}

class Clothes {

}

class TextRecognizer {

    parseText(text) {
        return  {phrase: "что мне надеть", phraseCode: 0};
    }


    constructor(text) {
        this.command = this.parseText(text);
    }

    getPhrase() {
        return this.command


    }
}
app.use(express.json())    // <==== parse request body as JSON

const whichOneOfCommand = (command) =>{
    if(command.phraseCode ===  0){
        return new Clothes();
    }

}

app.post("/alice", function (req, res) {

    const command = req.body.request.command;
    const text = new TextRecognizer(command)

    const response = {
        'response': {
            'text': "Привет! Это навык ''По погоде'' и я помогу вам одеться в соответствии с погодными условиями в Санкт-Петербурге. " +
                "Если вы хотите узнать, как одеться сегодня, чтобы чувствовать себя комфортно, просто спросите меня: 'что мне надеть?' " +
                "Чтобы узнать прогноз погоды на сегодняшний день, скажите: 'какая сегодня погода?'",
            "buttons": [{'title': 'какая сегодня погода?!', 'hide': true}, {'title': 'что мне надеть?', 'hide': true}],
            'end_Session': false,
        },
        'version': '1.0'
    }
    res.send(response);

});


app.listen(5000, function () {
    console.log("Сервер ожидает подключения...");
});


