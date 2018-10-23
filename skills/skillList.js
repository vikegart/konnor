const skillList = {
    [require('./anekdot/index').callName] : require('./anekdot/index').action,
    [require('./pairs/index').callName] : require('./pairs/index').action,
    [require('./mentionAll/index').callName] : require('./mentionAll/index').action,
}

module.exports = skillList;