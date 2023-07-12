const InvertedIndex = require("../lib/InvertedIndex");
const AnimalsDataSource = require("../models/AnimalsDataSource");

/**
 * Animals Controller contains actions linked to a "country-people-animals" data source
 */
class AnimalsController {
  /**
   * Controller data source
   * @type {AnimalsDataSource}
   * @private
   */
  #dataSource;

  /**
   * Controller search index
   * @type {InvertedIndex}
   * @private
   */
  #index;

  /**
   * @param {Object} json
   */
  constructor(json) {
    this.#dataSource = new AnimalsDataSource(json);
    this.#index = new InvertedIndex();
    this.#index.buildIndexFromDataSource(this.#dataSource);
  }

  /**
   * Returns data with animals filtered by the pattern provided
   * @param {String} pattern
   * @returns {Object}
   */
  filter(pattern) {
    // get results
    let documents = this.#index.getDocuments(pattern);

    // sort by positions to keep the order intact.
    documents = documents.sort(
      (a, b) =>
        a.countryPosition - b.countryPosition ||
        a.personPosition - b.personPosition ||
        a.animalPosition - b.animalPosition
    );

    // populate the data
    return this.#dataSource.populateDocuments(documents);
  }

  /**
   * Returns data with the number of children for each entity
   * @returns {Object}
   */
  count() {
    return this.#dataSource.getDataWithChildrenCount();
  }
}

module.exports = AnimalsController;
