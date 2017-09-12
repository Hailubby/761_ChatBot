const Logger = require('./util/logging/Logger.js');
const builder = require('botbuilder');
const express = require('express');
const bodyParser = require('body-parser');
const config = require('../config.json');
const NLP = require('./nlp.js');


class Bot{
  constructor(){
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
   *  Handle the commands that the this bot is able to execute.
   *
   * Run is called at the start of the application and will listen on the port that
   * facebook will send it's messages to.
   */
  run(){
    // Create chat connector for communicating with the Bot Framework Service
    const connector = new builder.ChatConnector({
        appId: config.MICROSOFT_APP_ID,
        appPassword: config.MICROSOFT_APP_PASSWORD
    });

    // Listen for messages from users 
    this.app.post('/webhook', connector.listen());

    const server = this.app.listen(3000, function () {
      console.log('Listening on port %s', server.address().port);
    });

    // Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
    const bot = new builder.UniversalBot(connector, session => {
      // If there is an existing object in the dictionary then go through the array
      // of commands that this user can do.

      let nlp = new NLP();

      this.logger.log(message.senderId, message.text, 'receive');
      let responded = false;
      if (this.userFollowups[message.senderID]){
          responded = nlp.processMessage(this.userFollowups[message.senderID],this.userFollowups,message);
      }
      if (!responded){
         nlp.processMessage(this.commands,this.userFollowups,message);
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
