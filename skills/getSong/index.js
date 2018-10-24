const regSong = /текст песни/i;
const regSongQuerySplitter = /\,|🎵|🎶|by/i;
const lyric = require("lyric-get");

const getSongText = {
    callName: 'текст песни',
    action: (bot, message, TOKENS) => {
        const lyricQuery = message.text.replace(regSong, '');
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
    }
}

module.exports = getSongText;