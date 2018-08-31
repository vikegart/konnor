const apiai = require('apiai');
const TOKENS = require('../secret_tokens');
let dialogFlowToken = TOKENS.dialogFlow;

const NeuroSessionId = 'e4278f61-9437-4dff-a24b-aaaaaaaaaaaa';
const fallBackText = 'Связь с центром не установлена, сорре(';

const app = apiai(dialogFlowToken);


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
    askDialogFlow: askDialogFlow,
}
