const skillList = {
    [require('./anekdot/index').callName] : require('./anekdot/index').action,
    [require('./pairs/index').callName] : require('./pairs/index').action,
}

module.exports = skillList;