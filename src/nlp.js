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
  processMessage(session, callback, caller) {
    http({ url: config.LUIS_RECOGNIZER, qs: { q: session.message.text }, headers : { 'Content-Type': 'application/json' } },
     (err, res, body) =>{
       let jsBody = JSON.parse(body);
       callback.call(caller, session, jsBody.topScoringIntent.intent);
     });
  }
}

module.exports = NLP;
