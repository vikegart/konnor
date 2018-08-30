const https = require('https');
const fs = require('fs');
const yandex_speech = require('yandex-speech');
const parseString = require('xml2js').parseString;

const folderName = './voices/';


const download = function (url, dest, cb) { //cb - callBack
    const file = fs.createWriteStream(folderName + dest);
    const request = https.get(url, function (response) {
        response.pipe(file);
        file.on('finish', function () {
            file.close(cb);  // close() is async, call cb after close completes.
        });
    }).on('error', function (err) { // Handle errors
        fs.unlink(dest, (err) => {  // Delete the file async.
            if (err) {
                console.log(err.message);
            }
        });
        if (cb) cb(err.message);
    });
};

const voiceMessageToText = (message) => {
    const urlVoice = message.attachments[0].doc.preview.audio_msg.link_mp3;
    const generatedFilename = `voice${message.peer_id}${Date.now()}.mp3`;
    return new Promise((resolve, reject) => {
        download(urlVoice, generatedFilename, (err) => {
            if (err) {
                reject(err);
            }
            yandex_speech.ASR({
                developer_key: '10247188-b7de-4259-a22b-5acca675903e',
                file: folderName + generatedFilename,
            }, function (err, httpResponse, xml) {
                if (err) {
                    reject(err);
                } else {
                    fs.unlink(folderName + generatedFilename, (err) => { //del file
                        if (err) {
                            console.log('err deleting ' + err.message);
                        }
                    });
                    parseString(xml, (err, result) => {
                        const success = result.recognitionResults.$.success;
                        if (success == 1) {
                            resolve(result.recognitionResults.variant[0]._);
                        } else {
                            reject('не удалось распознать');
                        }
                    });
                }
            })
        });
    })

}

const hasVoiceAttached = (message) => {
    return message.attachments.length != 0 &&
        message.attachments[0].type === 'doc' &&
        message.attachments[0].doc.preview.audio_msg


}

module.exports = {
    voiceMessageToText: voiceMessageToText,
    hasVoiceAttached: hasVoiceAttached
}

