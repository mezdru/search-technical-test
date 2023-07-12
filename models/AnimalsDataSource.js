/**
 * Represents a data source which contains the country-person-animal data.
 * It validates all the data entities so that we can interact with it without unexpected errors.
 */
class AnimalsDataSource {
  /**
   * @type {Array}
   * @private
   */
  #data;

  /**
   * Validation schema of the 'country' entity.
   * @type {Object}
   */
  COUNTRY_SCHEMA = {
    name: (value) => typeof value === "string",
    people: (value) => Array.isArray(value),
  };

  /**
   * Validation schema of the 'person' entity.
   * @type {Object}
   */
  PERSON_SCHEMA = {
    name: (value) => typeof value === "string",
    animals: (value) => Array.isArray(value),
  };

  /**
   * Validation schema of the 'animal' entity.
   * @type {Object}
   */
  ANIMAL_SCHEMA = {
    name: (value) => typeof value === "string",
  };

  /**
   * @param {Array} source
   */
  constructor(source) {
    this.#data = [];

    source && (this.data = source);
  }

  /**
   * Validate all data entities regarding current class validation schemas
   * @param {Array} data
   */
  isDataValid(data) {
    if (!Array.isArray(data)) return false;

    // Test all entities to see if validation rules are respected
    // If one (or more) validation rule is "false", the final result will be "false"
    return data.reduce(
      (prev, country) =>
        prev &&
        this.isObjectValid(country, this.COUNTRY_SCHEMA) &&
        country.people.reduce(
          (personPrev, person) =>
            personPrev &&
            this.isObjectValid(person, this.PERSON_SCHEMA) &&
            person.animals.reduce(
              (animalPrev, animal) =>
                animalPrev && this.isObjectValid(animal, this.ANIMAL_SCHEMA),
              true
            ),
          true
        ),
      true
    );
  }

  /**
   * Tests the "object" to know if it respects the validation "schema"
   * @param {Object} object
   * @param {Object} schema
   */
  isObjectValid(object, schema) {
    const errors = Object.keys(schema).filter(
      (key) => !schema[key](object[key])
    ).length;

    return errors === 0;
  }

  /**
   * Returns current data.
   * Each entity (country, person) name is populated with a number.
   * This number represents the number of children in the entity.
   * @returns {Array}
   */
  getDataWithChildrenCount() {
    return this.#data.map(({ name: countryName, people }) => ({
      name: `${countryName} [${people.length}]`,
      people: people.map(({ name: personName, animals }) => ({
        name: `${personName} [${animals.length}]`,
        animals,
      })),
    }));
  }

  /**
   * Populate an array of object containing positions
   * [{countryPosition, personPosition, animalPosition}]
   * to the matching data stored inside the data source.
   * @param {Array} documents
   * @returns {Array}
   */
  populateDocuments(documents) {
    const data = this.#data;
    let results = [];

    // rebuild final data, only with country which are in documents
    for (let c = 0; c < data.length; c++) {
      const currentCountryRows = documents.filter(
        ({ countryPosition }) => countryPosition === c
      );

      if (!currentCountryRows.length) continue;

      const row = { name: data[c].name, people: [] };

      // rebuild country data, only with people which are in documents for this country
      for (let p = 0; p < data[c].people.length; p++) {
        const currentPersonRows = currentCountryRows.filter(
          ({ personPosition }) => personPosition === p
        );

        if (!currentPersonRows.length) continue;

        // finally, filter current person animals to keep only the ones in documents
        row.people.push({
          name: data[c].people[p].name,
          animals: data[c].people[p].animals.filter((animal, index) =>
            currentPersonRows.some(({ animalPosition: a }) => a === index)
          ),
        });
      }

      results.push(row);
    }

    return results;
  }

  get data() {
    return this.#data;
  }

  set data(source) {
    if (!this.isDataValid(source))
      throw new Error("'source' parameter isn't valid.");

    this.#data = source;
  }
}

module.exports = AnimalsDataSource;
