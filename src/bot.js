const FBClient = require('./fbclient.js');
const Logger = require('./util/logging/Logger.js');
const Client = new FBClient();

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
      this.logger.log(message.senderId, message.text, 'receive');
      let responded = false;
      if (this.userFollowups[message.senderId]){
        this.userFollowups[message.senderId].every(command => {
          if (command.key.test(message.text)){
            command.respond(message);
            this.userFollowups[message.senderId] = command.followup;
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
            this.userFollowups[message.senderId] = command.followup;
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
