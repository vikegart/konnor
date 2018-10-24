const commands = require('./commands');

const whatUCan = {
    callName: 'что ты [умеешь|можешь]|команды',
    action: (bot, message, TOKENS) => {
        bot.send(commands, message.peer_id).catch(
            function (e) {
                console.log(e);
            }
        );
    }
}

module.exports = whatUCan;