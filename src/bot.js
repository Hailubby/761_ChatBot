const FBClient = require('./fbclient.js');
const request = require('request');
const client = new FBClient();

client.onMessage(message => {
  if (message.text === 'ping') {
    message.sendMessage('pong');
  } else if (message.text === 'generic') {
    message.sendGenericMessage(['Title', 'Subtitle', [['Button Title 1', 'http://www.google.com'], ['Button Title 2', 'http://www.youtube.com']]]);
  } else {
    message.sendMessage(message.text);
  }
});

client.listen();
