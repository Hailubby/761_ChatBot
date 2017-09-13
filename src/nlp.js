const http = require('request');
const config = require('../config.json');

class NLP {
  constructor(
  ) {
  }

  xprocessMessage(commands, userFollowups, message) {

    // natural.PorterStemmer.attach();
    // let words = message.text.tokenizeAndStem();
    // console.log(words);

    this.responded = false;
    let bestOverall = 99999;
    let bestCommand;



    commands.every(command => {

      let output = natural.LevenshteinDistance(command.key.source, message.text, { search: true });

      console.log(output + ' ' + command.key.source + ' from: ' + message.text);
      if (bestOverall > output) {
        bestOverall = output;
        bestCommand = command;
      }
      if (bestOverall === 0) {
        return false;
      }
      return true;

    });

    if (bestOverall <= 10) {
      bestCommand.respond(message);
      userFollowups[message.senderID] = bestCommand.followup;
      this.responded = true;
    }
    return this.responded;
  }

  /**
   *
   * @param {string} utterance
   *
   * @returns {string} list of intents that matches
   */
  processMessage(utterance) {
    let top;
    http({ url: config.LUIS_RECOGNIZER, qs: { q: utterance } },
      (err, res, body) => {
        top = body.topScoringIntent;
      });
    return top;
  }

}

module.exports = NLP;
