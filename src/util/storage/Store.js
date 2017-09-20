const GStore = require('./GoogleSheetsStore');

/**
 * A store that stores data.
 */
class Store {
  constructor() {
    this.store = new GStore();
  }

  write(id, key, value){
   return this.store.write(id, key, value);
  }

  read(id, key) {
    return this.store.read(id, key);
  }
}

module.exports = Store;
