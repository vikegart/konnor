//DEPRECATED
//FREEZE

const VK = require('vk-node-sdk');
//TODO: correct path for tokens
const Group = new VK.Group(TOKENS.vkGroupFullRight);
Group.onMessageText((message) => {
    console.log(message);
    if (!(message.peer_id == 81292015 || message.peer_id == 141438738)) { // not me or Ilya
        return;
    }

    if (message.body.length > 200 || !(/я точно илья/i.test(message.body))) {
        message.addText('В сообщении должно быть не больше 200 символов или илья').send();
    } else {
        message.setTyping();

        VK.Utils.getBuffer('https://tts.voicetech.yandex.net/generate', {
            text: message.body.replace(/я точно илья/i, ''),
            format: 'mp3',
            lang: 'ru',
            speaker: 'zahar',
            emotion: 'neutral',
            speed: 0.8,
            key: TOKENS.yandexSpeech
        }, (buffer, response) => {
            if (response && response.headers['content-type'] == 'audio/mpeg') {
                let file = {
                    buffer: buffer,
                    filename: 'file.mp3',
                    mimetype: 'audio/mpeg'
                }
                message.peer_id = 2000000001;
                message.reply.peer_id = 2000000001;
                message.addVoice(file, 'file_name.mp3').send()
            } else {
                message.addText('Упс, возможно траблы с яндексом, напиши Викентию').send()
            }
        })
    }
})