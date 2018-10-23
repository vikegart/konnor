const mentionAll = {
    callName: 'позови всех',
    action: (bot, message, TOKENS) => {
        bot.api('messages.getConversationMembers', { peer_id: message.peer_id, group_id: TOKENS.groupId })
            .then(res => {
                //const usersNamesOrIds = res.profiles.map(profile => profile.screen_name != '' ? profile.screen_name : profile.id );
                //console.log(util.inspect(usersNamesOrIds));
                const mentionIds = res.profiles.map(profile => `@id${profile.id}`);
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
    }
}

module.exports = mentionAll;