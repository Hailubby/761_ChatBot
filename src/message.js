const request = require('request');

class message {
  constructor(
    senderId,
    timestamp,
    messageText,
    attachments,
    PAGE_ACCESS_TOKEN
  ) {
    this.senderId = senderId;
    this.timestamp = timestamp;
    this.text = messageText;
    this.attachments = attachments;
    this.PAGE_ACCESS_TOKEN = PAGE_ACCESS_TOKEN;
  }

  sendMessage(messageText) {
    let messageData = {
      recipient: {
        id: this.senderId
      },
      message: {
        text: messageText
      }
    };

    this.callSendAPI(messageData);
  }

  callSendAPI(messageData) {
    request({
      uri: 'https://graph.facebook.com/v2.6/me/messages',
      qs: { access_token: this.PAGE_ACCESS_TOKEN },
      method: 'POST',
      json: messageData

    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        let recipientId = body.recipient_id;
        let messageId = body.message_id;

        console.log('Successfully sent generic message with id %s to recipient %s',
          messageId, recipientId);
      } else {
        console.error('Unable to send message.');
        console.error(response);
        console.error(error);
      }
    });
  }
}

module.exports = message;
