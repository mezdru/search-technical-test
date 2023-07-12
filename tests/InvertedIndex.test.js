const InvertedIndex = require("../lib/InvertedIndex");
const AnimalsDataSource = require("../models/AnimalsDataSource");
const { testData } = require("./data/testData");

/**
 * Count the number of subword tokens inside a name (without changing the order of the chars).
 * @param {String} name
 */
function countSubTokens(name) {
  const n = name.length;
  return (n * n + n) / 2;
}

describe("buildIndexFromName", () => {
  const doc = { test: true };
  const invertedIndex = new InvertedIndex();

  afterEach(() => {
    invertedIndex.clearIndex();
  });

  test("Should not add elements to index if name is empty", () => {
    const name = "";
    const tokensCount = countSubTokens(name);
    const index = invertedIndex.index;

    invertedIndex.buildIndexFromName(name, doc);

    expect(index).toBeInstanceOf(Object);
    expect(Object.keys(index).length).toBe(tokensCount);
  });

  test("Should add all name tokens to the index", () => {
    const name = "abcd";
    const tokensCount = countSubTokens(name);
    const index = invertedIndex.index;

    invertedIndex.buildIndexFromName(name, doc);

    expect(index).toBeInstanceOf(Object);
    expect(Object.keys(index).length).toBe(tokensCount);
    expect(index[name[0]][0]).toBe(doc);
    expect(index[name.substring(1, 3)][0]).toBe(doc);
    expect(index[name][0]).toBe(doc);
  });

  test("Should add all name tokens to the index, without regarding the name length", () => {
    const name =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const tokensCount = countSubTokens(name);
    const index = invertedIndex.index;

    invertedIndex.buildIndexFromName(name, doc);

    expect(index).toBeInstanceOf(Object);
    expect(Object.keys(index).length).toBe(tokensCount);
    expect(index[name[0]][0]).toBe(doc);
    expect(index[name.substring(1, 3)][0]).toBe(doc);
    expect(index[name][0]).toBe(doc);
  });

  test("Should add all name tokens to the index, even special chars", () => {
    const name = "@&,)!?/+";
    const tokensCount = countSubTokens(name);
    const index = invertedIndex.index;

    invertedIndex.buildIndexFromName(name, doc);

    expect(index).toBeInstanceOf(Object);
    expect(Object.keys(index).length).toBe(tokensCount);
    expect(index[name[0]][0]).toBe(doc);
    expect(index[name.substring(1, 3)][0]).toBe(doc);
    expect(index[name][0]).toBe(doc);
  });

  test("Should add all name tokens to the index, without duplicate values", () => {
    const name = "aaaa";
    // tokensCount equals 4 because only "a", "aa", "aaa" and "aaaa" are uniques in the name "aaaa"
    const tokensCount = 4;
    const index = invertedIndex.index;

    invertedIndex.buildIndexFromName(name, doc);

    expect(index).toBeInstanceOf(Object);
    expect(Object.keys(index).length).toBe(tokensCount);
    expect(index["a"].length).toBe(1);
    expect(index["a"][0]).toBe(doc);
  });
});

// JSON is already a valid AnimalsDataSource source in these tests, as it's checked inside AnimalsDataSource constructor.
describe("buildIndexFromDataSource", () => {
  test("Should not add elements to index if there are 0 people", () => {
    const json = [{ name: "c0", people: [] }];
    const invertedIndex = new InvertedIndex();
    const dataSource = new AnimalsDataSource(json);
    const index = invertedIndex.index;
    const tokensCount = 0;

    invertedIndex.buildIndexFromDataSource(dataSource);

    expect(index).toBeInstanceOf(Object);
    expect(Object.keys(index).length).toBe(tokensCount);
  });

  test("Should not add elements to index if there are no animals", () => {
    const json = [{ name: "c0", people: [{ name: "p1", animals: [] }] }];
    const invertedIndex = new InvertedIndex();
    const dataSource = new AnimalsDataSource(json);
    const index = invertedIndex.index;
    const tokensCount = 0;

    invertedIndex.buildIndexFromDataSource(dataSource);

    expect(index).toBeInstanceOf(Object);
    expect(Object.keys(index).length).toBe(tokensCount);
  });

  test("Should throw an error if the data source isn't an AnimalsDataSource", () => {
    const invertedIndex = new InvertedIndex();

    expect(invertedIndex.buildIndexFromDataSource).toThrow(
      new Error("'dataSource' parameter must be an AnimalsDataSource.")
    );
  });

  test("Should add all elements to index if the data source is valid and contains animals", () => {
    const json = [
      {
        name: "c0",
        people: [{ name: "p1", animals: [{ name: "a1" }, { name: "a2" }] }],
      },
    ];
    const invertedIndex = new InvertedIndex();
    const dataSource = new AnimalsDataSource(json);
    const index = invertedIndex.index;
    // "a", "1", "2", "a1" and "a2"
    const tokensCount = 5;

    invertedIndex.buildIndexFromDataSource(dataSource);

    expect(index).toBeInstanceOf(Object);
    expect(Object.keys(index).length).toBe(tokensCount);
    expect(index["a"].length).toBe(2);
    expect(index["a2"].length).toBe(1);
    expect(index["a2"][0]).toStrictEqual({
      countryPosition: 0,
      personPosition: 0,
      animalPosition: 1,
    });
  });
});

describe("getDocuments", () => {
  const json = testData;
  const invertedIndex = new InvertedIndex();
  const dataSource = new AnimalsDataSource(json);
  const index = invertedIndex.index;
  const tokensCount = 5639;

  afterEach(() => {
    invertedIndex.clearIndex();
  });

  test("Should return one document which contains the positions of the result", () => {
    const pattern = "Oryx";

    invertedIndex.buildIndexFromDataSource(dataSource);
    const searchResult = invertedIndex.getDocuments(pattern);

    expect(index).toBeInstanceOf(Object);
    expect(Object.keys(index).length).toBe(tokensCount);
    expect(searchResult).toBeInstanceOf(Array);
    expect(searchResult.length).toBe(1);
    expect(searchResult[0]).toStrictEqual({
      countryPosition: 4,
      personPosition: 4,
      animalPosition: 5,
    });
  });

  test("Should throw an error as empty patterns aren't allowed", () => {
    invertedIndex.buildIndexFromDataSource(dataSource);

    expect(invertedIndex.getDocuments).toThrow(
      new Error("'pattern' parameter must be a string and can't be empty.")
    );
  });

  test("Should return an empty array if the pattern isn't in the index keys", () => {
    const pattern = "Oryyx";

    invertedIndex.buildIndexFromDataSource(dataSource);
    const searchResult = invertedIndex.getDocuments(pattern);

    expect(index).toBeInstanceOf(Object);
    expect(Object.keys(index).length).toBe(tokensCount);
    expect(searchResult).toBeInstanceOf(Array);
    expect(searchResult.length).toBe(0);
    expect(searchResult[0]).toBe(undefined);
  });
});
