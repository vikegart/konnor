const skillList = {
    [require('./anekdot/index').callName] : require('./anekdot/index').action,
    [require('./pairs/index').callName] : require('./pairs/index').action,
    [require('./mentionAll/index').callName] : require('./mentionAll/index').action,
    [require('./messageToAll/index').callName] : require('./messageToAll/index').action,
    [require('./getSong/index').callName] : require('./getSong/index').action,
    [require('./who/index').callName] : require('./who/index').action,
    [require('./whatUCan/index').callName] : require('./whatUCan/index').action,
    [require('./sendMessageToChat/index').callName] : require('./sendMessageToChat/index').action,
    [require('./askForYes/index').callName] : require('./askForYes/index').action,
}

module.exports = skillList;