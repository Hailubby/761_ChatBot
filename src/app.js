const Bot = require('./bot.js');
const CommandLoader = require('./CommandLoader');

const bot = new Bot();
const loader = new CommandLoader();

const commands = loader.load();
bot.load(commands);

bot.run();
