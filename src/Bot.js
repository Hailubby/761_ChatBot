const Logger = require('./util/logging/Logger.js');
const builder = require('botbuilder');
const express = require('express');
const bodyParser = require('body-parser');
const config = require('../config.json');
const NLP = require('./NLP.js');
const followUpJSON = require('../resources/followup.json');
const loader = require('./util/commands/CommandLoader');

class Bot {
  constructor() {
    // Conversations mapped to users
    this.userFollowups = {};
    // Top level commands
    this.commands = [];
    // Logger
    this.logger = Logger;

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

    // Listen for messages from SPGeTTi application to send to users
    this.app.post('/appwebhook', (req, res) => {
      try {
        sendProactiveMessage.call(this, req);
        //Send 'successfully sent' message to sender
        res.send('Successfully sent a message to Facebook user');
      } catch (e) {
        console.error('Proactive message send unsuccessful');
        console.error(e);
        res.status(400);
        res.send(e.body);
      }
    });

    const server = this.app.listen(3000, () => {
      console.info(`Listening on port ${server.address().port}`);
    });


    // Receive messages from the user
    this.bot = new builder.UniversalBot(this.connector, session => {
      this.logger.log(session.message.user.id, session.message.text, 'receive')
        .catch(err => {
          // Make a new logsheet for users if there is one that does not exist
          this.logger.init(session.message.user.id, session.message.user.name)
            .then(() => {
              this.logger.log(session.message.user.id, session.message.text, 'receive');
            });
        });


      this.nlp.processMessage(session.message.text).then(intent => {
        this.match(session, intent);
      }, error => {
        console.error(error);
      });
      // this.match(await this.nlp.processMessage(session));
      // this.nlp.processMessage(session, this.match, this);
    });
  }

  match(session, intent) {
    let responded = false;

    // Check if message should be responded to by a mid-level conversation thread followup
    if (this.userFollowups[session.message.user.id]) {
      this.userFollowups[session.message.user.id].every(command => {
        if (command.match(intent)) {
          command.respond(session);
          this.userFollowups[session.message.user.id] = command.followup;
          responded = true;
          return false;
        }
        return true;
      });
    }

    // If message has not been responded to, attempt to find a top level response
    if (!responded) {
      this.commands.every(command => {
        if (command.match(intent)) {
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

module.exports = Bot;

/**
 * Send a message that will be sent to a specific user, as specified by their Facebook ID (user_id)
 * @param {*} req  The HTTP request containing Facebook user ID to send message to (in user_id) and message content (in message)
 */
function sendProactiveMessage(req) {

  if (!req.body.user_id || !req.body.message) {
    throw 'MissingParameterException';
  }

  //Verify authentication token
  let headerToken = req.headers.authorization;
  if (headerToken === config.POST_AUTH) {
    let userId = req.body.user_id;
    let messageContent = req.body.message;

    //These followups received must already exist in spreadsheet/json form
    let followups = req.body.followups.split(';');
    let followCommands = [];
    for (let key of followups) {
      followCommands.push(loader.getCommand(key, followUpJSON));
    }
    this.userFollowups[userId] = followCommands;

    //Build address for bot to send message to
    let address =
      {
        channelId: 'facebook',
        user: {
          id: userId
        },
        bot: {
          id: '513268699012224',
          name: 'spgetti'
        },
        serviceUrl: 'https://facebook.botframework.com'
      };

    //Build message with text content, send through bot
    let msg = new builder.Message().address(address);
    msg.text(messageContent);
    this.bot.send(msg);
  } else {
    throw 'AuthenticationException';
  }

}
