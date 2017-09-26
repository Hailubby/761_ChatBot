/**
 * Builds a set of JSON files from excel sheets specified in config.json
 */

const ExcelConverter = require('./util/ExcelConverter');
const fs = require('fs');
const config = require('../config.json');

function shouldLoad(module) {
    return config.LOAD_MODULES.includes(module);
}

const converter = new ExcelConverter();
if (shouldLoad('CONVERSATION')) {
    console.log('BUILDING CONVERSATIONS...');

    const conversationJSON = converter.convert('CONVERSATION');
    fs.writeFileSync(
        `${__dirname}/../resources/conversation.json`,
        JSON.stringify(conversationJSON, null, 2)
    );

    const followUpJSON = converter.convert('FOLLOWUP');
    fs.writeFileSync(
        `${__dirname}/../resources/followup.json`,
        JSON.stringify(followUpJSON, null, 2)
    );
    
    console.log('ADDING NEW STORAGE KEYS...');
    let StoreKeys = require('./util/storage/StoreKeys');
    const TYPES = require('./util/commands/ResponseTypes');
    for (let i = 0; i < conversationJSON.length; i++) {
        const msgProto = conversationJSON[i];
        let stores = msgProto[TYPES.STORE];
        if (stores) {
            stores = stores.split(';');
            stores.forEach( key => {
                if (!StoreKeys.Keys.includes(key)) {
                    console.log('new key' + key);
                    StoreKeys.Keys.push(key);
                }
            })
        }
    }
    for (let i = 0; i < followUpJSON.length; i++) {
        const msgProto = followUpJSON[i];
        let stores = msgProto[TYPES.STORE];
        if (stores) {
            stores = stores.split(';');
            stores.forEach( key => {
                if (!StoreKeys.Keys.includes(key)) {
                    StoreKeys.Keys.push(key);
                }
            })
        }
    }
    fs.writeFileSync(
        `${__dirname}/util/storage/StoreKeys.json`,
        JSON.stringify(StoreKeys, null, 2)
    );
}



console.log('BUILD COMPLETED');
