'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const Message = require('./message.js');
const config = require('../config.json');

class FBClient {
  constructor() {
    this.app = express();
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({
      extended: true
    }));
  }

  onMessage(callback, caller) {
    this.app.post('/webhook', (req,res) => {
      var data = req.body;

      // Make sure this is a page subscription
      if (data.object === 'page') {

        // Iterate over each entry - there may be multiple if batched
        data.entry.forEach(function(entry) {
          var pageID = entry.id;
          var timeOfEvent = entry.time;

          // Iterate over each messaging event
          entry.messaging.forEach(function(event) {
            if (event.message) {
              receivedMessage(event, callback, caller);
            } else if (event.postback) {
              receivedPostback(event);
            } else {
              console.log('Webhook received unknown event: ', event);
            }
          });
        });

        // Assume all went well.
        //
        // You must send back a 200, within 20 seconds, to let us know
        // you've successfully received the callback. Otherwise, the request
        // will time out and we will keep trying to resend.
        res.sendStatus(200);
      }
    } );
  }

  validate() {
    this.app.get('/webhook', function(req, res) {
      if (req.query['hub.mode'] === 'subscribe' &&
          req.query['hub.verify_token'] === config.token) {
        console.log('Validating webhook');
        res.status(200).send(req.query['hub.challenge']);
      } else {
        console.error('Failed validation. Make sure the validation tokens match.');
        res.sendStatus(403);
      }
    });
  }

  postCallback (req, res) {
      var data = req.body;

      // Make sure this is a page subscription
      if (data.object === 'page') {

        // Iterate over each entry - there may be multiple if batched
        data.entry.forEach(function(entry) {
          var pageID = entry.id;
          var timeOfEvent = entry.time;

          // Iterate over each messaging event
          entry.messaging.forEach(function(event) {
            if (event.message) {
              receivedMessage(event, callback);
            } else if (event.postback) {
              receivedPostback(event);
            } else {
              console.log('Webhook received unknown event: ', event);
            }
          });
        });

        // Assume all went well.
        //
        // You must send back a 200, within 20 seconds, to let us know
        // you've successfully received the callback. Otherwise, the request
        // will time out and we will keep trying to resend.
        res.sendStatus(200);
      }
  }

  //Startup the server
  listen() {
    var server = this.app.listen(3000, function () {
      console.log('Listening on port %s', server.address().port);
    });
  }

}
module.exports = FBClient;


function receivedMessage(event, callback, caller) {
  console.log(event);

  let senderID = event.sender.id;
  let recipientID = event.recipient.id;
  let timeOfMessage = event.timestamp;
  let message = event.message;

  let messageId = message.mid;

  let messageText = message.text;
  let messageAttachments = message.attachments;

  let msg = new Message(
    senderID,
    timeOfMessage,
    messageText,
    messageAttachments,
    config.PAGE_ACCESS_TOKEN
  );

  callback.call(caller, msg);

    // if (messageText) {
    //   // If we receive a text message, check to see if it matches a keyword
    //   // and send back the template example. Otherwise, just echo the text we received.
    //   switch (messageText) {
    //     case 'generic':
    //       sendGenericMessage(senderID);
    //       break;
    //     case 'ping':
    //       sendTextMessage(senderID,'pong');
    //       break;

    //     default:
    //       sendTextMessage(senderID, messageText);
    //   }
    // } else if (messageAttachments) {
    //   sendTextMessage(senderID, 'Message with attachment received');
    // }
  }

  function receivedPostback(event) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfPostback = event.timestamp;

    // The 'payload' param is a developer-defined field which is set in a postback
    // button for Structured Messages.
    var payload = event.postback.payload;

    console.log('Received postback for user %d and page %d with payload "%s" ' +
      'at %d', senderID, recipientID, payload, timeOfPostback);

    // When a postback is called, we'll send a message back to the sender to
    // let them know it was successful
    //sendTextMessage(senderID, 'Postback called');
  }

