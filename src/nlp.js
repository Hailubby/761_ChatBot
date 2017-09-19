const http = require('request');
const config = require('../config.json');

class NLP {
    constructor(
    ) {
    }

    /**
     *
     * @param {string} utterance
     */
    processMessage(session) {
        return new Promise((resolve, reject) => {
            http({ url: config.LUIS_RECOGNIZER, qs: { q: session.message.text }, headers: { 'Content-Type': 'application/json' } },
                (err, res, body) => {
                    if(res == 200){
                        let jsBody = JSON.parse(body);
                        resolve(jsBody.topScoringIntent.intent);
                    }else{
                        reject(res.statusMessage);
                    }
                });
        });
    }
}

module.exports = NLP;
