const anekdotReuest = require('./logic');

const giveMeAndekdot = {
    callName: 'анекдот',
    action: (bot, message) => {
        console.log('skill called');
        anekdotReuest(!/плохой/i.test(message.text)).then(
            res => {
                bot.send(res, message.peer_id).catch(
                    function (e) {
                        console.log(e);
                    }
                )
            },
            err => {
                bot.send(err, message.peer_id).catch(
                    function (e) {
                        console.log(e);
                    }
                )
            }
        )
    }
}

module.exports = giveMeAndekdot;