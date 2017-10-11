const request = require('request');
const config = require('../config.json');

/**
 * NLP will handle the natural language processing in our application.
 *
 * Requests will be made to LUIS (Language understanding intelligence services).
 */
class NLP {
  /**
   * Take in the session object and extract the message that was passed with it.
   * Pass that message to LUIS to get the intent and then return the intent.
   *
   * @param {*} message
   */
  processMessage(message) {
    return new Promise((resolve, reject) => {
      request({
        url: config.LUIS_RECOGNIZER, qs: { q: message },
        headers: { 'Content-Type': 'application/json' }
      },
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
  /**
   * Takes in a new intent name and creates the intent for the LUIS AI.
   */
  loadIntent(intentName) {

    let requestURL = 'https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/' + config.LUIS_APP_ID + '/versions/0.1/intents';

    return new Promise((resolve, reject) => {
      request.post({
        url: requestURL,
        qs: {
          'subscription-key': config.LUIS_API_KEY
        },
        form: { name: intentName }
      },
        (err, res, body) => {
          if (res.statusCode == 201) {
            resolve(body);
          } else {
            reject(res.statusMessage);
          }
        });
    });
  }

  /**
   * Takes in an array of utterances to train an intent.
   * @param {string} intentName
   * @param {string[]} utterance
   */
  loadUtterance(intentName, utterance) {
    let requestURL = 'https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/' + config.LUIS_APP_ID + '/versions/0.1/examples';

    return new Promise((resolve, reject) => {
      let utteranceArray = [];
      utterance.forEach((e, i) => {
        utteranceArray.push({
          'intentName': intentName,
          text: e,
          entityLabels: []
        });
      });
      request.post({
        url: requestURL,
        qs: {
          'subscription-key': config.LUIS_API_KEY
        },
        json: utteranceArray
      },
        (err, res, body) => {
          if (res.statusCode == 201) {
            resolve(body);
          } else {
            reject(res.statusMessage);
          }
        });
    });
  }

/**
 * Exposed method to programmatically train the LUIS AI.
 */
  train() {
    let requestURL = 'https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/' + config.LUIS_APP_ID + '/versions/0.1/train';

    request.post({
      url: requestURL,
      qs: {
        'subscription-key': config.LUIS_API_KEY
      }
    },
      (err, res, body) => {
        if (res.statusCode == 202) {
        } else {
          console.err(Error(err));
        }
      });
  }
/**
 * Exposed method to programatically publish the newly trained LUIS AI. Currently set to publish as Staging.
 */
  publish() {
    let requestURL = 'https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/' + config.LUIS_APP_ID + '/publish';

    request.post({
      url: requestURL,
      qs: {
        'subscription-key': config.LUIS_API_KEY
      },
      form: {
        versionId: '0.1',
        isStaging: true,
        region: 'westus'
      }
    },
      (err, res, body) => {
        if (res.statusCode == 201) {
          console.info('Successfully published: ' + res.statusCode);
        } else {
          console.err(Error(err));
        }
      });
  }

}

module.exports = NLP;
