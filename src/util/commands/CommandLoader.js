const Command = require('./Command');
const Store = require('../storage/Store');
const StoreKeys = require('../storage/StoreKeys');
const builder = require('botbuilder');
const config = require('../../../config.json');

const PROPERTIES = require('./CommandProperties');
const TYPES = require('./ResponseTypes');

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

      let sendable = true;
      const makeCard =
        types.includes(TYPES.LINK)  ||
        types.includes(TYPES.IMAGE) ||
        types.includes(TYPES.TITLE);
      const msg = new builder.Message(session);

      let card = new builder.HeroCard(session);

      // Add message if response includes a message (text)
      if (types.includes(TYPES.MESSAGE)) {
        let text = msgProto[TYPES.MESSAGE].split(';');
        let msgIndex = Math.floor(Math.random() * text.length);
        if (makeCard) {
          card.text(text[msgIndex]);
        } else {
          msg.text(text[msgIndex]);
        }
      }

      // Add buttons if response includes buttons
      if (types.includes(TYPES.BUTTONS)) {
        let buttonText = msgProto[TYPES.BUTTONS];
        buttonText = buttonText.split(';');
        let buttons = [];
        buttonText.forEach((button) => {
          buttons.push(builder.CardAction.imBack(session, button, button));
        });
        if (makeCard) {
          card.buttons(buttons);
        } else {
          msg.suggestedActions(
            builder.SuggestedActions.create(session, buttons)
          );
        }
      }

      if (types.includes(TYPES.IMAGE)) {
        let image = builder.CardImage.create(session, msgProto[TYPES.IMAGE]);
        card.images([image]);
      }

      if (types.includes(TYPES.LINK)) {
        let parts = msgProto[TYPES.LINK].split(';');
        let links = [];
        for (let i = 0; i < parts.length; i = i+2) {
          links.push(builder.CardAction.openUrl(session, parts[i+1], parts[i]));
        }
        card.buttons(links);
      }

      if (types.includes(TYPES.TITLE)) {
        card.title(msgProto[TYPES.TITLE]);
      }

      // Store input if response stores input
      if (types.includes(TYPES.STORE)) {
        let key = StoreKeys.Keys.indexOf(msgProto[TYPES.STORE]);
        this.store.write(session.message.user.id, key, session.message.text);
      }

      if (types.includes(TYPES.RECALL)) {
        sendable = false;
        let key = StoreKeys.Keys.indexOf(msgProto[TYPES.RECALL]);
        this.store.read(session.message.user.id, key)
        .then(value => {
          let text = msgProto[TYPES.MESSAGE];
          text = text.replace(`[${msgProto[TYPES.RECALL]}]`, value);
          if (makeCard) {
            card.text(text);
            msg.addAttachment(card);
          } else {
            msg.text(text);
          }
          session.send(msg);
        });
      }

      // Only send if async tasks are not constructing message
      // TODO This will create race conditions with multiple asyncs
      if (sendable) {
        if (makeCard) {
          msg.addAttachment(card);
        }
        session.send(msg);
      }
    });
    /* eslint-enable max-statements */
  }
}

module.exports = CommandLoader;
