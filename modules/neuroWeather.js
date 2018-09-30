const projectId = 'weather-79a47';
const languageCode = 'ru-RU';

// Instantiate a DialogFlow client.
const dialogflow = require('dialogflow');


const askNeuroWeater = (query, userId) => {
    console.log(query, userId);
    const sessionId = userId.toString();
    const sessionClient = new dialogflow.SessionsClient({ keyFilename: './gweather.json' });
    const sessionPath = sessionClient.sessionPath(projectId, sessionId);

    // The text query request.
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: query,
                languageCode: languageCode,
            },
        },
    };
    return new Promise((resolve, reject) => {
        sessionClient
            .detectIntent(request)
            .then(responses => {
                //console.log('Detected intent');
                const result = responses[0].queryResult;
                //console.log(`  Query: ${result.queryText}`);
                //console.log(`  Response: ${result.fulfillmentText}`);
                if (result.intent) {
                    //console.log(`  Intent: ${result.intent.displayName}`);
                } else {
                    //console.log(`  No intent matched.`);
                }
                //console.log(result.parameters.fields.address.structValue.fields.city.stringValue);
                let dateTime;
                try {
                    dateTime = result.outputContexts[0].parameters.fields['date-time.original'].stringValue;
                }
                catch (exep) {
                    console.log(exep);
                    dateTime;
                }
                if (result.allRequiredParamsPresent) {
                    return resolve({
                        text: result.fulfillmentText,
                        city: result.parameters.fields.address.structValue.fields.city.stringValue,
                        dateTime: dateTime,
                    })
                } else {
                    return resolve({
                        text: result.fulfillmentText,
                        city: undefined,
                        dateTime: dateTime
                    })
                }
            })
            .catch(err => {
                console.error('ERROR:', err);
                return reject(err);
            });
    })
}

module.exports = askNeuroWeater;