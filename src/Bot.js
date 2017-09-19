const Logger = require('./util/logging/Logger.js');
const builder = require('botbuilder');
const express = require('express');
const bodyParser = require('body-parser');
const config = require('../config.json');

class Bot {
  constructor() {
    // Conversations mapped to users
    this.userFollowups = {};
    // Top level commands
    this.commands = [];
    // Logger
    this.logger = new Logger();

    this.app = express();
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({
      extended: true
    }));
  }

  /**
   * Initializes and runs the bot.
   * Bot will listen for and respond to recognized user messages on run().
   */
  run(){
    // Create chat connector for communicating with the Bot Framework Service
    this.connector = new builder.ChatConnector({
        appId: config.MICROSOFT_APP_ID,
        appPassword: config.MICROSOFT_APP_PASSWORD
    });

    // Listen for messages from users 
    this.app.post('/webhook', this.connector.listen());

    this.server = this.app.listen(3000, function () {
      console.log('Listening on port %s', this.server.address().port);
    });

    // Receive messages from the user
    this.bot = new builder.UniversalBot(this.connector, session => {
      this.logger.log(session.message.user.id, session.message.text, 'receive');

      // Check if message should be responded to by a mid-level conversation thread followup
      let responded = false;
      if (this.userFollowups[session.message.user.id]){
        this.userFollowups[session.message.user.id].every(command => {
          if (command.match(session.message.text)){
            command.respond(session);
            this.userFollowups[session.message.user.id] = command.followup;
            responded = true;
            return false;
          }
          return true;
        });
      }

      // If message has not been responded to, attempt to find a top level response
      if (!responded){
        this.commands.every(command => {
          if (command.match(session.message.text)){
            command.respond(session);
            this.userFollowups[session.message.user.id] = command.followup;
            return false;
          }
          return true;
        });
      }
    });
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
