const XLSX = require('xlsx');
const config = require('../../config.json');

/**
 * A list of loadable excel sheets
 *
 * Key: Flag to use on load()
 * Value: Name of sheet (in excel) to load
 */
const Modules = {
  'WELCOME': 'Welcome_Messages',
  'WELLNESS': 'Wellness_Messages',
  'CONVERSATION': 'User_Initiated_Messages',
  'FOLLOWUP': 'Follow_Up_Messages'
};

/**
 * Converts excel sheets stored in location specified in ../config.json to json
 */
class ExcelConverter {
  constructor() {
    // Retrieve the actual workbook file
    const directory = __dirname.concat(`\\..\\..\\${config.MESSAGES_SHEET_LOCATION}`);
    this.workbook = XLSX.readFile(directory);
  }

  /**
   * Converts sheet specified from Modules to json
   *
   * @param {string} module key of module to load, should be contained in Modules
   */
  convert(module) {
    let sheet = this.workbook.Sheets[Modules[module]];

    return XLSX.utils.sheet_to_json(sheet);
  }
}

module.exports = ExcelConverter;
