const sendMessageAll = {
    callName: 'об[ъь]явление',
    action: (bot, message, TOKENS) => {
        const alertMessage = message.text
                .split(/об[ъь]явление/i, 2)[1]
                .trim();
            bot.api('messages.getConversationMembers', { peer_id: message.peer_id, group_id: TOKENS.groupId })
                .then(res => {
                    const mentionIds = res.profiles.map(profile => `@id${profile.id}`);
                    bot.send(`сообщение для всех: ${alertMessage} ${mentionIds.toString()}`, message.peer_id).catch(
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
    }
}

module.exports = sendMessageAll;