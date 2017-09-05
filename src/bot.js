const FBClient = require('./fbclient.js');
const Message = require('./message.js');
const Command = require('./command.js');
const Client = new FBClient();
const NLP = require('./nlp.js');


class Bot{
  constructor(){
    // Conversations mapped to users
    this.userFollowups = {};
    // Top level commands
    this.commands = [];
  }

  /**
   *  Handle the commands that the this bot is able to execute.
   *
   * Run is called at the start of the application and will listen on the port that
   * facebook will send it's messages to.
   */
  run(){
    Client.onMessage(message => {
      // If there is an existing object in the dictionary then go through the array
      // of commands that this user can do.

      let nlp = new NLP();

      let responded = false;
      if (this.userFollowups[message.senderID]){
          responded = nlp.processMessage(this.userFollowups[message.senderID],this.userFollowups,message);
      }
      if (!responded){
         nlp.processMessage(this.commands,this.userFollowups,message);
      }
    }, this);
    Client.listen();
  }

  /**
   * Take in an array of commands and add it to the bots top level commands.
   *
   * @param {Command[]} commands
   */
  load(commands){
    this.commands.push.apply(this.commands, commands);
  }
}

module.exports = Bot;
