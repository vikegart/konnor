console.log('all ok');

const DEBUG_MODE = require('./konnor_config');
const util = require('util');
const { Bot } = require('node-vk-bot');

const weatherApi = require('./modules/weather/weatherApi');
const constructors = require('./modules/weather/constructors');
const dialogFlow = require('./modules/dialogFlow');
const voiceToText = require('./modules/voiceToText');
const calculator = require('./modules/calculator');

const chatsForSend = require('./consts/chatsID');
const phrasesSticker = require('./consts/fallbackSticker');


//don't forget to add tokens in file and rename him
const TOKENS = require('./secret_tokens');

const neuroWeather = require('./modules/neuroWeather');

const regName = /коннор|connor|конор|андроид/i;


const debugConsole = (variable, depth) => {
    DEBUG_MODE && console.log('debug: ' + util.inspect(variable, false, depth = 8));
}

const bot = new Bot({
    token: TOKENS.vkGroupFullRight,
    group_id: TOKENS.groupId,
}).start()

console.log('bot started');

const dubugChatsId = require('./consts/debug_chatsID');
DEBUG_MODE && dubugChatsId.forEach((chat) => {
    neuroWeather(`Какая погода сегодня в ${chat.city}?`, chat.id).then(
        response => {
            debugConsole(response);
            if (response.city) {
                weatherApi.fetchWeatherForCity(response.city).then((res) => {
                    let messageArr = [];
                    messageArr[1] = res.city;
                    if (response.dateTime) {
                        messageArr[2] = response.dateTime;
                    }
                    const weather = constructors.generateMessage('', res, messageArr);
                    bot.send(weather, chat.id).catch(
                        function (e) {
                            console.log('send vk weather err ' + e);
                        }
                    );
                }).catch((e) => {
                    debugConsole(e);
                })
            }
        },
        error => {
            debugConsole(error);
        }
    )
})

!DEBUG_MODE && chatsForSend.forEach((chat) => {
    neuroWeather(`Какая погода сегодня в ${chat.city}?`, chat.id).then(
        response => {
            debugConsole(response);
            if (response.city) {
                weatherApi.fetchWeatherForCity(response.city).then((res) => {
                    let messageArr = [];
                    messageArr[1] = res.city;
                    if (response.dateTime) {
                        messageArr[2] = response.dateTime;
                    }
                    let weather = constructors.generateMessage('', res, messageArr);
                    bot.send(weather, chat.id).catch(
                        function (e) {
                            console.log('send vk weather err ' + e);
                        }
                    );
                }).catch((e) => {
                    debugConsole(e);
                })
            }
        },
        error => {
            debugConsole(error);
        }
    )
})


bot.on('poll-error', error => {
    console.error('error occurred on a working with the Long Poll server ' +
        `(${util.inspect(error)})`)
})

bot.on('sticker', message => {
    if (message.peer_id > 1000000000) { //message from conversation
        return;
    }
    let rand = Math.floor(Math.random() * phrasesSticker.length);
    bot.send(phrasesSticker[rand], message.peer_id).catch(
        function (e) {
            console.log('send weather to chat vk err ' + e);
        }
    );
})

bot.on('voice', message => {
    console.log('get voice ' + util.inspect(message));

    //UPD 05.07.2019
    //I have some issues with Yandex API and temporally disabled this function
    return;

    const options = { forward_messages: message.id.toString() };
    bot.api('messages.setActivity', { type: 'typing', peer_id: message.peer_id, group_id: TOKENS.groupId })
        .then(res => console.log(util.inspect(res)));
    voiceToText.voiceMessageToText(message).then(
        response => {
            bot.send(response, message.peer_id, options).catch(
                function (e) {
                    console.log('send voice to text to chat vk err ' + e);
                }
            );
        },
        error => {
            bot.send(error, message.peer_id, options).catch(
                function (e) {
                    console.log('send voice to text to chat vk err ' + e);
                }
            );
        }
    )
})

const skillList = require('./skills/skillList');

bot.get(/./, message => {
    if (message.peer_id > 1000000000) { //message from conversation
        if (!regName.test(message.text)) { //if no name calling - no answeer
            return;
        }
    }
    bot.api('messages.setActivity', { type: 'typing', peer_id: message.peer_id, group_id: TOKENS.groupId })
        .then(res => console.log(util.inspect(res)));

    message.text = message.text.replace(regName, ''); //delete him name

    for (let skillName in skillList) {
        const regExp = RegExp(skillName, 'i');
        if (regExp.test(message.text)) {
            console.log('matched: ' + skillName);
            skillList[skillName](bot, message, TOKENS);
            return;
        }
    }


    calculator(message.text).then(
        response => {
            bot.send(response, message.peer_id).catch(
                function (e) {
                    console.log(e);
                }
            )
        },
        error => {
            console.log('calc err: ' + error);
            neuroWeather(message.text, message.peer_id).then(
                response => {
                    debugConsole(response);
                    if (response.city) {
                        weatherApi.fetchWeatherForCity(response.city).then((res) => {
                            let messageArr = [];
                            messageArr[1] = res.city;
                            if (response.dateTime) {
                                messageArr[2] = response.dateTime;
                            }
                            let weather = constructors.generateMessage('', res, messageArr);
                            bot.send(weather, message.peer_id).catch(
                                function (e) {
                                    debugConsole(e);
                                    console.log('send vk weather err ' + e);
                                }
                            );
                        }).catch((e) => {
                            debugConsole(e);
                        })
                    }
                    if (response.matchedWeather) {
                        bot.send(response.text, message.peer_id).catch(
                            function (e) {
                                console.log(e);
                            }
                        )
                    } else {
                        dialogFlow.askDialogFlow(message).then(
                            response => {
                                bot.send(response, message.peer_id).catch(
                                    function (e) {
                                        console.log(e);
                                    }
                                )
                            },
                            error => console.log('promise dialogFlow error ' + error)
                        )
                    }
                },
                error => {
                    debugConsole(error);
                }
            )


        }
    )
})
