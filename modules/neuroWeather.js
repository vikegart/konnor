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
                const result = responses[0].queryResult;
                let dateTime;
                try {
                    dateTime = result.outputContexts[0].parameters.fields['date-time.original'].stringValue;
                }
                catch (exep) {
                    console.log(exep);
                    dateTime;
                }
                if (result.allRequiredParamsPresent) {
                    let city;
                    if (result.parameters.fields.address.stringValue){
                        city = result.parameters.fields.address.stringValue;
                    } else {
                        city = result.parameters.fields.address.structValue.fields.city.stringValue;
                    }
                    console.log(result.parameters.fields.address.stringValue);
                    return resolve({
                        text: result.fulfillmentText,
                        city: city,
                        dateTime: dateTime,
                        matchedWeather: result.intent,
                    })
                } else {
                    return resolve({
                        text: result.fulfillmentText,
                        city: undefined,
                        dateTime: dateTime,
                        matchedWeather: result.intent,
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