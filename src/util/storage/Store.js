const GStore = require('./GoogleSheetsStore');

/**
 * A store that stores data.
 */
class Store {
  constructor() {
    this.store = new GStore();
  }

  /**
   * Writes data *value* belonging to provided *id* and *key* to default storage location(s).
   * NOTE: Sheet access specified in config.json
   *
   * @param {string} id
   * @param {string} key
   * @param {string} value
   */
  write(id, key, value){
   return this.store.write(id, key, value);
  }

  /**
   * Reads data belonging to provided *key* and *value* from default storage location(s).
   * NOTE: Sheet access specified in config.json
   *
   * @param {string} id
   * @param {string} key
   */
  read(id, key) {
    return this.store.read(id, key);
  }
}

module.exports = Store;
