const chislOrZnam = require('./logic');

const weekPair = {
    callName: 'какая неделя|неделя какая',
    action: (bot, message) => {
        let d = new Date();
        d.setHours(d.getHours() + 1); //for GMT+4
        
        let parity = 'сейчас ' + chislOrZnam(d);
        
        if (/завтра/i.test(message.text)) {
            d.setDate(d.getDate() + 1);
            parity = 'завтра ' + chislOrZnam(d);
        }
        if (/следующая/i.test(message.text)) {
            d.setDate(d.getDate() + 7);
            parity = 'следующая неделя ' + chislOrZnam(d);
        }
        bot.send(parity, message.peer_id).catch(
            function (e) {
                console.log(e);
            }
        );
    }
}

module.exports = weekPair;