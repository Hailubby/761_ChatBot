const ExcelConverter = require('./util/ExcelConverter');
const fs = require('fs');
const config = require('../config.json');

function shouldLoad(module) {
    return config.LOAD_MODULES.includes(module);
}

const converter = new ExcelConverter();
if (shouldLoad('CONVERSATION')) {
    console.log('BUILDING CONVERSATION...');
    fs.writeFileSync(`${__dirname}/../resources/conversation.json`, JSON.stringify(converter.convert('CONVERSATION')));
    fs.writeFileSync(`${__dirname}/../resources/followup.json`, JSON.stringify(converter.convert('FOLLOWUP')));
}

console.log('BUILD COMPLETED');