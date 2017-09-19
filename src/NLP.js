const http = require('request');
const config = require('../config.json');

/**
 * NLP will handle the natural language processing in our application.
 *
 * Requests will be made to LUIS (Language understanding intelligence services).
 */
class NLP {
  constructor(
  ) {
  }

  /**
   * Take in the session object and extract the message that was passed with it.
   * Pass that message to LUIS to get the intent and then return the intent.
   *
   * @param {*} session
   */
  processMessage(session) {
    return new Promise((resolve, reject) => {
      http({ url: config.LUIS_RECOGNIZER, qs: { q: session.message.text },
        headers: { 'Content-Type': 'application/json' } },
        (err, res, body) => {
          if (res.statusCode == 200) {
            let jsBody = JSON.parse(body);
            resolve(jsBody.topScoringIntent.intent);
          } else {
            reject(res.statusMessage);
          }
        });
    });
  }
}

module.exports = NLP;
