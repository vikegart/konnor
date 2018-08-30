const apiai = require('apiai');
const NeuroSessionId = 'e4278f61-9437-4dff-a24b-aaaaaaaaaaaa';
const CLIENTBRAIN = '7da6cec36fec4b03ae4c8db5dbdb52c9';
const fallBackText = 'Связь с центром не установлена, сорре(';
const app = apiai(CLIENTBRAIN);


const askDialogFlow = (message) => {
    const peerIdString = message.peer_id.toString();
    const cuniqid = NeuroSessionId.slice(0, NeuroSessionId.length - peerIdString.length) + peerIdString;
    return new Promise((resolve, reject) => {
        const request = app.textRequest(message.text, {
            sessionId: cuniqid
        });

        request.on('response', function (response) {
            resolve(response.result.fulfillment.speech);
        });

        request.on('error', function (error) {
            console.log('dialogFlow err ' + error);
            reject(fallBackText);
        });

        request.end();
    })
}

module.exports = {
    askDialogFlow: askDialogFlow
}
