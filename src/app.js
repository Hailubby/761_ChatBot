/**
 * Application entry point.
 * 
 * Creates a bot, loads commands, and runs bot.
 */

const Bot = require('./Bot.js');
const CommandLoader = require('./util/commands/CommandLoader');

const bot = new Bot();
const loader = new CommandLoader();

const commands = loader.load();
bot.load(commands);

bot.run();
