const chislOrZnamen = () => {
    const now = new Date();
    //изначально считаем что сейчас знаменатель
    //true - числитель
    //false - знаменатель
    
    const dayFirstOfSeptember = (new Date(now.getFullYear(), 8, 1)).getDay();
    const dateFirstMondayInSeptember = (dayFirstOfSeptember == 2) ? 7 : (9 - dayFirstOfSeptember) % 7;
    
    const dayFirstOfJanuary = (new Date(now.getFullYear(), 0, 1)).getDay();
    const dateFirstMondayInJanuary = (dayFirstOfJanuary == 2) ? 7 : (9 - dayFirstOfJanuary) % 7;
    
    const currentDate = now.getDate();
    const currentMonth = now.getMonth();
    
    const countFullWeeksBeforeNY = Math.floor((now.getTime() - new Date(now.getFullYear(), 8, dateFirstMondayInSeptember).getTime()) / 86400000 / 7);
    const countFullWeeksAfterNY = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, dateFirstMondayInJanuary).getTime()) / 86400000 / 7);
    
    if (currentMonth > 8 && countFullWeeksBeforeNY % 2 != 0) {
        return 'числитель'
    }
    else if (currentMonth == 8) {
        if (currentDate >= dateFirstMondayInSeptember && countFullWeeksBeforeNY % 2 != 0) {
            return 'числитель'
        }
        else if (currentDate < dateFirstMondayInSeptember) {
            return 'числитель'
        }
    }
    else if (currentMonth < 8) {
        if (currentMonth <= 4 && currentMonth >= 0) {
            if ((currentMonth == 0) && (currentDate < dateFirstMondayInJanuary)) {
                if (dayFirstOfSeptember == 0 || dayFirstOfSeptember > 4) {
                    return 'числитель'
                }
            }
            else if (countFullWeeksAfterNY % 2 == 0) {
                return 'числитель'
            }
        }
        else if (currentMonth > 4) {
            console.log('сейчас лето, ты чего');
        }
    }
    return 'знаменатель'
}

module.exports = chislOrZnamen;