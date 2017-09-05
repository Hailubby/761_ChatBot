const natural = require('natural');

class NLP {
  constructor(
  ) {
  }

  processMessage(commands,userFollowups,message){

    natural.PorterStemmer.attach();
    let words = message.text.tokenizeAndStem();
    console.log(words);

    this.responded = false;

    commands.every( command => {
      if (command.key.test(message.text)){
      command.respond(message);
      userFollowups[message.senderID] = command.followup;
      this.responded = true;
      return false;
     }
      return true;
    });

    return this.responded;
  }

}

module.exports = NLP;
