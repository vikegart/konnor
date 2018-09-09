const chislOrZnam = require('./parity');
const shedule321 = require('./shedule321');

const getShedule = (dayOfWeek) => {
    let currentShedule;
    if (chislOrZnam == 'числитель') {
        currentShedule = shedule321.chisl;
    } else {
        currentShedule = shedule321.znamen
    }
    switch (dayOfWeek) {
        case 0:
            return currentShedule.monday;
        default:
            return 'не верный день недели'
            break;
    }
}


module.exports = {
    chislOrZnam: chislOrZnam,
    getShedule: getShedule,
}