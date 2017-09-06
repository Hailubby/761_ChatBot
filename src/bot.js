const FBClient = require('./fbclient.js');
const Message = require('./message.js');
const Command = require('./command.js');
const Client = new FBClient();
const Logger = require('./log.js');

class Bot{
  constructor(){
    // Conversations mapped to users
    this.userFollowups = {};
    // Top level commands
    this.commands = [];
    // Logger
    this.logger = new Logger();
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
      this.logger.append(message.senderID, message.text);
      let responded = false;
      if (this.userFollowups[message.senderID]){
        this.userFollowups[message.senderID].every(command => {
          if (command.key.test(message.text)){
            command.respond(message);
            this.userFollowups[message.senderID] = command.followup;
            responded = true;
            return false;
          }
          return true;
        });
      }

      if (!responded){
        this.commands.every(command => {
          if (command.key.test(message.text)){
            command.respond(message);
            this.userFollowups[message.senderID] = command.followup;
            return false;
          }
          return true;
        });
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
