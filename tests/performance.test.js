const { testData } = require("./data/testData");
const InvertedIndex = require("../lib/InvertedIndex");
const AnimalsDataSource = require("../models/AnimalsDataSource");
const Timer = require("../lib/Timer");
const AnimalsController = require("../controllers/AnimalsController");

// NOTE: Only valid if tests are always running in the same conditions
describe("Code Performance", () => {
  test("Should take less than 50ms to initialise the index with small data source", () => {
    const json = testData;
    const invertedIndex = new InvertedIndex();
    const dataSource = new AnimalsDataSource(json);
    const timer = new Timer();

    timer.start();
    invertedIndex.buildIndexFromDataSource(dataSource);
    timer.end();

    expect(timer.getDuration()).toBeLessThan(50);
  });

  test("Should take less than 15000ms to initialise the index with big data source", () => {
    // .fill().map(...) to avoid keeping the same reference between objects
    // https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array/fill
    const json = Array(1000)
      .fill()
      .map(() => testData)
      .flat();
    const invertedIndex = new InvertedIndex();
    const dataSource = new AnimalsDataSource(json);
    const timer = new Timer();

    timer.start();
    invertedIndex.buildIndexFromDataSource(dataSource);
    timer.end();

    expect(timer.getDuration()).toBeLessThan(15000);
  });

  test("Should take less than 5ms to filter after initialisation with small data source", () => {
    const json = testData;
    const animalsController = new AnimalsController(json);
    const timer = new Timer();

    timer.start();
    animalsController.filter("ry");
    timer.end();

    expect(timer.getDuration()).toBeLessThan(5);
  });

  // Should take less than Xms to filter after initialisation with big data source
  // Need to randomize all names for this test
});
