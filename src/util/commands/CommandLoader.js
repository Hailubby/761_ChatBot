const Command = require('./Command');
const Store = require('../storage/Store');
const StoreKeys = require('../storage/StoreKeys');
const builder = require('botbuilder');
const config = require('../../../config.json');

const PROPERTIES = {
  ID: 'ID',
  KEY: 'Key',
  TYPE: 'Type',
  FOLLOWUPS: 'Follow Ups',
};

const TYPES = {
  MESSAGE: 'Message',
  BUTTONS: 'Buttons',
  INPUT: 'Input'
};

/**
 * Loads sets of commands based on modules specified in config.json.
 */
class CommandLoader {
  constructor() {
    this.store = new Store();
  }

  shouldLoad(module) {
    return config.LOAD_MODULES.includes(module);
  }

  /**
   * Loads a set of commands (see Command.js) based on ../config.json LOAD_MODULES.
   *
   * WARN: Spreadsheet based commands should conform to templates.
   */
  load() {
    let commands = [];
    if (this.shouldLoad('CONVERSATION')) {
      this.conversationJSON = require('../../../resources/conversation.json');
      this.followUpJSON = require('../../../resources/followup.json');

      for (let i = 0; i < this.conversationJSON.length; i++) {
        commands.push(this.getCommand(i, this.conversationJSON));
      }
    }

    return commands;
  }

  /**
   * Loads a command
   *
   * @param {int} id The ID of the command to load (should be unique)
   * @param {object} json The json object containing the command
   */
  getCommand(id, json) {
    const obj = json[id];
    const key = obj[PROPERTIES.KEY];
    const respond = this.makeResponse(obj);

    let followUpsIDArr = obj[PROPERTIES.FOLLOWUPS];

    if (followUpsIDArr) {
      followUpsIDArr = followUpsIDArr.split(';').map(function(item) {
        return item.trim();
      });
    }

    let followUpsArr = [];

    if (followUpsIDArr) {
      followUpsIDArr.forEach(followUpID => {
        followUpsArr.push(this.getCommand(followUpID, this.followUpJSON));
      });
    }

    return new Command(key, respond, followUpsArr);
  }

  /**
   * Makes a response function based on the command object.
   *
   * @param {Object} msgProto A json object representing a message
   */
  makeResponse(msgProto) {
    const types = msgProto[PROPERTIES.TYPE].split(';');

    /* eslint-disable max-statements */
    return (session => {
      const Logger = require('./../logging/Logger');
      const logger = new Logger();

      logger.log(
        session.message.user.id,
        msgProto[TYPES.MESSAGE],
        'sent'
      );

      const msg = new builder.Message(session);
      // Add message if response includes a message (text)
      if (types.includes(TYPES.MESSAGE)) {
        msg.text(msgProto[TYPES.MESSAGE]);
      }

      // Add buttons if response includes buttons
      if (types.includes(TYPES.BUTTONS)) {
        let buttonText = msgProto[TYPES.BUTTONS];
        buttonText = buttonText.split(';');
        let buttons = [];
        buttonText.forEach((button) => {
          buttons.push(builder.CardAction.imBack(session, button, button));
        });
        msg.suggestedActions(
          builder.SuggestedActions.create(session, buttons)
        );
      }

      // Store input if response stores input
      if (types.includes(TYPES.INPUT)) {
        let key = StoreKeys.indexOf(msgProto[TYPES.INPUT]);
        if (key) {
          console.log(session.message.text);
          this.store.write(session.message.user.id, key, session.message.text);
        }
      }

      session.send(msg);
    });
    /* eslint-enable max-statements */
  }
}

module.exports = CommandLoader;
