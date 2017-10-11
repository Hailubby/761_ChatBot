/**
 * Application entry point for Node.js.
 * When the commands "node app.js" is run the node plaform will look for
 * this file as the entry point.
 *
 * Creates a bot, loads commands, and runs bot.
 */

const Bot = require('./Bot.js');
const loader = require('./util/commands/CommandLoader');

const bot = new Bot();

const commands = loader.load();
bot.load(commands);

bot.run();
