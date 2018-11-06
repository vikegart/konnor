const sendMessageToKoshatnik = {
    callName: 'напиши',
    action: (bot, message, TOKENS) => {
        if (message.peer_id < 1000000000) {
            const messageToKoshatnik = message.text
                .split(regSendMessageToKoshatnik, 2)[1].trim();
            bot.send(messageToKoshatnik, 2000000001).catch(
                function (e) {
                    console.log(e);
                }
            );
        }
    }
}

module.exports = sendMessageToKoshatnik;