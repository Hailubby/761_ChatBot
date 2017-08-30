const Bot = require('./bot.js');
const Command = require('./command.js');

var bot = new Bot();

bot.load([
  new Command(new RegExp(`ping`,'i'), msg => {
    console.log('PONGING');
    msg.sendMessage("pong");
  }, [])
] );

bot.run();
