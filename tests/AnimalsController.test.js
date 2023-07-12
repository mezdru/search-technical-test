const AnimalsController = require("../controllers/AnimalsController");
const { testData } = require("./data/testData");

describe("count", () => {
  test("Should append the children count to the parent name for countries and people", () => {
    const animalsController = new AnimalsController(testData);
    const expectedLength = 5;
    const expectedFirstCountryName = "Dillauti [5]";
    const expectedSecondPersonName = "Blanche Viciani [8]";

    const results = animalsController.count();
    const firstCountryName = results[0]?.name;
    const secondPersonName = results[0]?.people[1]?.name;

    expect(results).toBeInstanceOf(Array);
    expect(results.length).toBe(expectedLength);
    expect(firstCountryName).toBe(expectedFirstCountryName);
    expect(secondPersonName).toBe(expectedSecondPersonName);
  });
});

describe("filter", () => {
  test("Should filter the data to keep animals containing the pattern", () => {
    const animalsController = new AnimalsController(testData);
    const expectedLength = 5;
    const expectedFirstAnimalName = "Narwhal";
    const expectedSecondAnimalName = "Badger";

    const results = animalsController.filter("r");
    const firstAnimalName = results[0]?.people[0]?.animals[0]?.name;
    const secondAnimalName = results[0]?.people[0]?.animals[1]?.name;

    expect(results).toBeInstanceOf(Array);
    expect(results.length).toBe(expectedLength);
    expect(firstAnimalName).toBe(expectedFirstAnimalName);
    expect(secondAnimalName).toBe(expectedSecondAnimalName);
  });

  test("Should filter the data and find 0 results", () => {
    const animalsController = new AnimalsController(testData);
    const expectedLength = 0;

    const results = animalsController.filter("ryyy");

    expect(results).toBeInstanceOf(Array);
    expect(results.length).toBe(expectedLength);
  });
});
