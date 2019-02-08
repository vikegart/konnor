const { Keyboard, KeyboardColor } = require('node-vk-bot');
const TOKENS = require('../../secret_tokens');

const askForYes = {
    callName: 'действуй',
    action: (bot, message) => {
        console.log('skill called');
        const keyboard = new Keyboard(true)
            .addButton('Задание принято.', KeyboardColor.PRIMARY)
            .addButton('Конечно, встреча добавлена!', KeyboardColor.POSITIVE);
        const cleanText = message.text.replace('действуй', '');
        const [time, day, place] = cleanText.split('!');
        bot.api('messages.send', {
            user_id: 108070501,
            peer_id: 108070501,
            message: `⭕ ОК900, новое задание из Киберлайф. Выдвигайтесь на место, там вас ждет координатор.
                         \n ⌚${time} 
                         \n 📅${day} 
                         \n 🗺${place} 
                         \n Пожалуйста проведите диагностику всех систем перед заданием и ответьте на это сообщение. `,
            group_id: TOKENS.groupId,
            keyboard: keyboard.toString()
        }).then(res => console.log(res))
    }
}

module.exports = askForYes;