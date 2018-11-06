const who = {
    callName: 'кто',
    action: (bot, message, TOKENS) => {
        bot.api('messages.getConversationMembers', { peer_id: message.peer_id, group_id: TOKENS.groupId })
        .then(res => {
            const mentionIds = res.profiles.map(profile => `@id${profile.id}`);
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
    }
}

module.exports = who;