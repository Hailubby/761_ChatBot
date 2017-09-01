const Bot = require('./bot.js');
const Command = require('./command.js');

let bot = new Bot();

bot.load([
  new Command(new RegExp('ping','i'), msg => {
    console.log('PONGING');
    msg.sendMessage('pong');
  }, [new Command(/basketball/i, msg => {
    console.log('Ballin\'');
    msg.sendMessage('Bounce');
  })])
] );

bot.run();
