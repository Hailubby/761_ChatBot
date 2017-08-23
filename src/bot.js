const FBClient = require('./fbclient.js');
const request = require('request');
const client = new FBClient(config.VERIFY_TOKEN, config.PAGE_ACCESS_TOKEN);

client.onMessage(message => {
  if (message.text === 'ping') {
    message.sendMessage('pong');
  } else {
    message.sendMessage(message.text);
  }
});

client.listen();
