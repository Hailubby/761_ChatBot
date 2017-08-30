const Bot = require('./bot.js');
const Command = require('./command.js');
const GMessage = require('./gmessage.js');

var bot = new Bot();

bot.load([
  new Command(new RegExp(`ping`,'i'), msg => {
    console.log('PONGING');
    msg.sendMessage("pong");
  }, []),
  new Command(new RegExp(`generic`, 'i'), msg => {
    var gMessage = new GMessage('Title', 'Subtitle');
    gMessage.addButton('Button Title 1', 'http://youtube.com');
    gMessage.addButton('Button Title 2', 'http://google.com');
    gMessage.addButton('Button Title 3', 'http://google.com');
    gMessage.addThumbnail('https://groceries.morrisons.com/productImages/110/110710011_0_640x640.jpg', 'http://google.com');
    msg.sendGenericMessage([gMessage, gMessage]);
  }, [])
] );

bot.run();
