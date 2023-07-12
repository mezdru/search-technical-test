const AnimalsDataSource = require("../models/AnimalsDataSource");

/**
 * Create an inverted index from the data source.
 * To build the index, we will use all the name tokens possible without
 * changing the order of the chars in the name.
 */
class InvertedIndex {
  /**
   * @type {Object}
   * @private
   */
  #index;

  constructor() {
    this.#index = {};
  }

  /**
   * Builds the index with the name of each animal in the data source.
   * @param {AnimalsDataSource} dataSource
   */
  buildIndexFromDataSource(dataSource) {
    if (!(dataSource instanceof AnimalsDataSource))
      throw new Error("'dataSource' parameter must be an AnimalsDataSource.");

    dataSource.data.forEach((country, countryPosition) => {
      country.people.forEach((person, personPosition) => {
        person.animals.forEach((animal, animalPosition) => {
          const name = animal.name;
          const document = {
            countryPosition,
            personPosition,
            animalPosition,
          };

          this.buildIndexFromName(name, document);
        });
      });
    });
  }

  /**
   * Build the index with one name.
   * @example For "who", it will add "w", "h", "o", "wh", "ho", "who" to the index keys.
   * @param {Object} document
   * @param {String} name
   */
  buildIndexFromName(name, document) {
    const tokens = [];

    // Iterates through a cursor to control the length of the token we are working with
    for (let cursorLength = 1; cursorLength <= name.length; cursorLength++) {
      // For each cursor length, we will search for all tokens of this "cursor length"
      for (
        let startIndex = 0;
        startIndex + cursorLength <= name.length;
        startIndex++
      ) {
        const token = name.substring(startIndex, startIndex + cursorLength);

        // Heavy cost, but it allows me to avoid duplicate documents for the same "token".
        // It appends when a name contains duplicate chars (example: "Hello")
        if (tokens.includes(token)) continue;
        tokens.push(token);

        token in this.#index
          ? this.#index[token].push(document)
          : (this.#index[token] = [document]);
      }
    }
  }

  /**
   * Returns all documents which are indexed for the current pattern.
   * @param {String} pattern
   */
  getDocuments(pattern) {
    if (!pattern || !(typeof pattern === "string"))
      throw new Error(
        "'pattern' parameter must be a string and can't be empty."
      );

    return this.#index[pattern] || [];
  }

  /**
   * Reset _index property
   */
  clearIndex() {
    this.#index = {};
  }

  get index() {
    return this.#index;
  }
}

module.exports = InvertedIndex;
