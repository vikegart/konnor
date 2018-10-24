const skillList = {
    [require('./anekdot/index').callName] : require('./anekdot/index').action,
    [require('./pairs/index').callName] : require('./pairs/index').action,
    [require('./mentionAll/index').callName] : require('./mentionAll/index').action,
    [require('./messageToAll/index').callName] : require('./messageToAll/index').action,
    [require('./getSong/index').callName] : require('./getSong/index').action,
}

module.exports = skillList;