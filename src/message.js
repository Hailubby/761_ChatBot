const request = require('request');

class Message {
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

  sendGenericMessage(GMessage) {

    this.messageData = {
      recipient: {
        id: this.senderId
      },
      message: {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: []
          }
        }
      }
    };

    for (let i = 0; i < GMessage.length; i++) {
      this.constructGenericMessage(i, GMessage[i]);
    }

    console.log(this.messageData.message.attachment.payload);
    this.callSendAPI(this.messageData);
  }

  constructGenericMessage(index, GMessage) {

    let elements = this.messageData.message.attachment.payload.elements;

    let element = {};
    element.title = GMessage.title;
    element.subtitle = GMessage.subtitle;
    element.buttons = [];

    let buttonsArray = GMessage.buttons;
    let thumbnail = GMessage.thumbnail;

    for (let i = 0; i < buttonsArray.length; i++) {
      let btn = {};
      btn.type = 'web_url';
      btn.url = (buttonsArray[i])[1];
      btn.title = (buttonsArray[i])[0];
      element.buttons.push(btn);
    }

    if (!(thumbnail === undefined)) {
        element.image_url = thumbnail[0];
        if (thumbnail.length === 2) {
          element.item_url = thumbnail[1];
        }
    }
    elements.push(element);
  }
}

module.exports = Message;
