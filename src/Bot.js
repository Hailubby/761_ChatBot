const Logger = require('./util/logging/Logger.js');
const builder = require('botbuilder');
const express = require('express');
const bodyParser = require('body-parser');
const config = require('../config.json');
const NLP = require('./NLP.js');

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
    this.nlp = new NLP();
  }



  /**
   * Initializes and runs the bot.
   * Bot will listen for and respond to recognized user messages on run().
   */
  run() {
    // Create chat connector for communicating with the Bot Framework Service
    this.connector = new builder.ChatConnector({
        appId: config.MICROSOFT_APP_ID,
        appPassword: config.MICROSOFT_APP_PASSWORD
    });

    // Listen for messages from users
    this.app.post('/webhook', this.connector.listen());

    // Listen for messages from SPGeTTi application
    this.app.post('/appwebhook', (req, res) => {
    sendProactiveMessage.call(this, req, res);


    }); 

    const server = this.app.listen(3000, () => {
      console.log(`Listening on port ${server.address().port}`);
    });

      this.bot = new builder.UniversalBot(this.connector, session => {
      this.logger.log(session.message.user.id, session.message.text, 'receive');

      this.nlp.processMessage(session).then(intent => {
        this.match(session, intent);
      }, error => {
        console.error(error);
      });
      // this.match(await this.nlp.processMessage(session));
      // this.nlp.processMessage(session, this.match, this);
    });
  }

  match(session, intent){
    let responded = false;
    // console.log(intent);

    // Check if message should be responded to by a mid-level conversation thread followup
    if (this.userFollowups[session.message.user.id]){
      this.userFollowups[session.message.user.id].every(command => {
        if (command.match(intent)){
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
        if (command.match(intent)){
          console.error('in');
          command.respond(session);
          this.userFollowups[session.message.user.id] = command.followup;
          return false;
        }
        return true;
      });
    }
  }

  /**
   * Take in an array of commands and add it to the bots top level commands.
   *
   * @param {Command[]} commands
   */
  load(commands) {
    this.commands.push.apply(this.commands, commands);
  }
}

function sendProactiveMessage(req, res) {
  let userId = req.body.user_id;
  let messageContent = req.body.message;
  
  let address = {
  channelId: 'facebook',
  user: {
    id: userId,
  },
  bot: {
    id: '513268699012224',
    name: 'spgetti'
  },
  serviceUrl: 'https://facebook.botframework.com'
  }

  let msg = new builder.Message().address(address);
  msg.text(messageContent);
  msg.textLocale('en-US');
  this.bot.send(msg);

  sendProactiveMessage.call(this, address);
  console.log('Finished sending proactive message');

  res.send('Ok');
}

module.exports = Bot;
