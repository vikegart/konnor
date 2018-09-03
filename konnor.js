console.log('all ok');

const DEBUG_MODE = true;
const freeProxyList = require('ps-free-proxy-list'); 
const source = freeProxyList();
const lyric = require("lyric-get");
const util = require('util');
const { Bot } = require('node-vk-bot');

const askForWearherSaratov = require('./modules/weatherSaratov');
const dialogFlow = require('./modules/dialogFlow');
const voiceToText = require('./modules/voiceToText');

const chatsForSend = require('./consts/chatsID');
const phrasesSticker = require('./consts/fallbackSticker');
const commands = require('./consts/commands');

//don't forget to add tokens in file and rename him
const TOKENS = require('./secret_tokens');

const regMentionAll = /позови всех/i;
const regGiftAll = /поздравь всех/i;
const regWho = /кто/i;
const regStopCallingByName = /заткнись чувак/i;
const regResumeCallingByName = /я скучал|я скучала/i;
const regName = /коннор|connor|конор|андроид/i;
const regWeather = /weather|погод[ауыен]|дождик|дождь/i;
const regSong = /текст песни/i;
const regSongQuerySplitter = /\,|🎵|🎶|by/i;
const regWhatUCan = /что ты умеешь|можешь|список команд|команды|твои способности/i;

let isReadyForReply = true;
let isReadyForWeather = true;
let proxyList = [];


const debugConsole = (variable, depth) => {
    DEBUG_MODE && console.log('debug: ' + util.inspect(variable, false, depth = 8));
}

const bot = new Bot({
    token: TOKENS.vkGroupFullRight,
    group_id: TOKENS.groupId
}).start()

console.log('bot started'); //spam weather
//get proxyList for day
source.load().then(
    response => {
        debugConsole(response);
        proxyList = response;
    },
    reject => debugConsole(reject)
);

!DEBUG_MODE && isReadyForWeather && askForWearherSaratov.askForWeather(proxyList[0] = '').then(
    response => {
        console.log('promise weather ' + response);
        for (let i = 0; i < chatsForSend.length; i++) {
            bot.send('Доброго утра! ' + response, chatsForSend[i]).catch(
                function (e) {
                    console.log('send weather to chat vk err ' + e);
                }
            );
        }
    },
    error => console.log('promise weather error' + error)
);

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

bot.on('update', update => {
    //check if audio message as forward
    if (update.type == 'message_new') {
        const message = update.object;
        if (message.fwd_messages.length != 0) {
            for (let i = 0; i < message.fwd_messages.length; i++) {
                let fwd_message = message.fwd_messages[i];
                if (voiceToText.hasVoiceAttached(fwd_message)) {
                    bot.api('messages.setActivity', { type: 'typing', peer_id: message.peer_id, group_id: TOKENS.groupId })
                        .then(res => console.log(util.inspect(res)));
                    voiceToText.voiceMessageToText(fwd_message).then(
                        response => {
                            bot.send(response, message.peer_id, { forward_messages: message.id.toString() }).catch(
                                function (e) {
                                    console.log('send voice to text to chat vk err ' + e);
                                }
                            );
                        },
                        error => {
                            bot.send(error, message.peer_id, { forward_messages: message.id.toString() }).catch(
                                function (e) {
                                    console.log('send voice to text to chat vk err ' + e);
                                }
                            );
                        }
                    )
                }
            }
        }

    }

})

bot.get(/./, message => {
    if (message.peer_id > 1000000000) { //message from conversation
        if (!regName.test(message.text)) { //if no name calling - no answeer
            return;
        }
    }

    switch (true) {
        case regWho.test(message.text) && isReadyForReply: {
            bot.api('messages.getConversationMembers', { peer_id: message.peer_id, group_id: TOKENS.groupId })
                .then(res => {
                    const mentionIds = res.profiles.map(profile => `@id${profile.id}`);
                    debugConsole(mentionIds);
                    const rand = Math.floor(Math.random() * mentionIds.length);
                    bot.send((mentionIds.length > 1
                        ? `хмм... кажется это ${mentionIds[rand]}`
                        : `ты :D , но лучше спроси меня об этом в беседе`), message.peer_id).catch(
                            function (e) {
                                console.log(e);
                            }
                        );
                })
                .catch(
                    function (e) {
                        console.log(e);
                    }
                );
            break;
        }
        case regMentionAll.test(message.text): {
            bot.api('messages.getConversationMembers', { peer_id: message.peer_id, group_id: TOKENS.groupId })
                .then(res => {
                    //const usersNamesOrIds = res.profiles.map(profile => profile.screen_name != '' ? profile.screen_name : profile.id );
                    //console.log(util.inspect(usersNamesOrIds));
                    const mentionIds = res.profiles.map(profile => `@id${profile.id}`);
                    debugConsole(mentionIds);
                    bot.send('я призываю всех ' + `${mentionIds.toString()}`, message.peer_id).catch(
                        function (e) {
                            console.log(e);
                        }
                    );
                })
                .catch(
                    function (e) {
                        console.log(e);
                    }
                );
            break;
        }
        case regGiftAll.test(message.text) && isReadyForReply: {
            bot.api('messages.getConversationMembers', { peer_id: message.peer_id, group_id: TOKENS.groupId })
                .then(res => {
                    const mentionIds = res.profiles.map(profile => `@id${profile.id}`);
                    debugConsole(mentionIds);
                    bot.send('всех с праздником :D ' + `${mentionIds.toString()}`, message.peer_id).catch(
                        function (e) {
                            console.log(e);
                        }
                    );
                })
                .catch(
                    function (e) {
                        console.log(e);
                    }
                );
            break;
        }
        case regStopCallingByName.test(message.text) && isReadyForReply: {
            isReadyForReply = false;
            bot.send('окей, я пойду к Хенку с:', message.peer_id).catch(
                function (e) {
                    console.log(e);
                }
            );
            break;
        }
        case regResumeCallingByName.test(message.text): {
            isReadyForReply = true;
            bot.send('еее, здорова чуваки с: ', message.peer_id).catch(
                function (e) {
                    console.log(e);
                }
            );
            break;
        }
        case regWhatUCan.test(message.text): {
            bot.send(commands, message.peer_id).catch(
                function (e) {
                    console.log(e);
                }
            );
            break;
        }
        case regWeather.test(message.text) && isReadyForReply: {
            bot.api('messages.setActivity', { type: 'typing', peer_id: message.peer_id, group_id: TOKENS.groupId })
                .then(res => console.log(util.inspect(res)));
            askForWearherSaratov.askForWeather(proxyList[0] = '').then(
                response => {
                    console.log('promise weather ' + response);
                    bot.send(response, message.peer_id).catch(
                        function (e) {
                            console.log('send vk weather err ' + e);
                        }
                    );
                },
                error => console.log('promise weather error' + error)
            );
            break;
        }
        case regSong.test(message.text): {
            //get song name and artist from message

            const lyricQuery = message.text.replace(regSong, '').replace(regName, '');
            const lyricData = {
                author: lyricQuery.split(regSongQuerySplitter, 2)[0].trim(),
                songName: lyricQuery.split(regSongQuerySplitter, 2)[1].trim(),
            };
            lyric.get(lyricData.author, lyricData.songName, function (err, res) {
                if (err) {
                    console.log(err);
                    //retry and swap parametrs
                    lyric.get(lyricData.songName, lyricData.author, function (err, res) {
                        if (err) {
                            console.log(err);
                            bot.send(`я не могу найти, может это ты в запросе ошибся? \n Ибо ответ из Киберлайф ${err}`, message.peer_id).catch(
                                function (e) {
                                    console.log(e);
                                }
                            );
                        }
                        else {
                            bot.send(`пришлось поменять местами автора и название, но я справился \n \n ${res}`, message.peer_id).catch(
                                function (e) {
                                    console.log(e);
                                }
                            );
                        }
                    });

                }
                else {
                    bot.send(`держи \n \n ${res}`, message.peer_id).catch(
                        function (e) {
                            console.log(e);
                        }
                    );
                }
            });
            break;
        }
        case /proxy/i.test(message.text): {
            source.load().then(
                response => debugConsole(response),
                reject => debugConsole(reject)
            )
            break;
        }
        default: {
            if (!isReadyForReply) {
                break;
            }
            dialogFlow.askDialogFlow(message).then(
                response => {
                    bot.send(response, message.peer_id).catch(
                        function (e) {
                            console.log(e);
                        }
                    );
                },
                error => console.log('promise dialogFlow error ' + error)
            )
        }
    }
})
