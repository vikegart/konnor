
var needle = require('needle');
var cheerio = require('cheerio');


let anekdots = [];
let anekdotsBad = [];

const getAnekdot = (pickGood = true) => {
    return new Promise((resolve, reject) => {
        const pick = () => {
            if (pickGood) {
                return anekdots.length > 0 ? anekdots.shift() : null;
            }
            
            return anekdotsBad.length > 0 ? anekdotsBad.pop() : null;
        };
        const hasItemToPick = () => {
            return pickGood ? anekdots.length > 0 : anekdotsBad.length > 0;
        };
        
        let anekdot = pick();
        if (anekdot) {
            resolve(anekdot);
        }

        if (!hasItemToPick()) {
            needle.get('https://www.anekdot.ru/random/anekdot/', (err, res) => {
                if (err) {
                    if (!anekdot) {
                        reject();
                    }
                    return;
                }
                
                var $ = cheerio.load(res.body, { decodeEntities: false });
                const items = $('.content .topicbox[id]');
                
                let anekdotsAll = [];
                
                items.each((idx, element) => {
                    element = $(element);
                    
                    const item = {
                        date: element.find('p').text(),
                        rating: Number(element.find('.rates').attr('data-r').split(';')[0]),
                        textItems: element.find('.text').html().split('<br>')
                    };
                    
                    anekdotsAll.push(item);
                });
                
                // sort by rating
                try {

                    anekdotsAll = anekdotsAll.sort((x, y) => y.rating - x.rating);
                    
                    const midRating = anekdotsAll[Math.floor(anekdotsAll.length / 2)].rating;
                    
                    anekdots = anekdots.concat(anekdotsAll.filter(item => item.rating >= midRating));
                    anekdotsBad = anekdotsBad.concat(anekdotsAll.filter(item => item.rating < midRating));
                } catch (e){
                    reject(`anekdot skill err: ${e}`);
                }
                
                if (!anekdot) {
                    anekdot = pick();
                    if (anekdot) {
                        resolve(anekdot);
                    } else {
                        reject();
                    }
                }
            });
        }
    });
};

const giveMeAnekdot = (pickGood = true) => {
    return new Promise((resolve, reject) => {
        getAnekdot(pickGood).then((anekdot) => {
            if (!anekdot) {
                return reject('sorry(');
            }
            
            const mood = pickGood ? '\u{1F44D}' : '\u{1F44E}';
            const message = `${mood} Дата:${anekdot.date}, рейтинг:${anekdot.rating} \n\n${anekdot.textItems.join('\n')}`;
            return resolve(message);
        });

    })
};

module.exports = giveMeAnekdot;