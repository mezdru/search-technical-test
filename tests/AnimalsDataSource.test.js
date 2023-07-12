const AnimalsDataSource = require("../models/AnimalsDataSource");
const { testData } = require("./data/testData");

describe("isDataValid", () => {
  const dataSource = new AnimalsDataSource();

  test("Should be called when we set the data property", () => {
    const json = testData;
    const spy = jest.spyOn(dataSource, "isDataValid");

    dataSource.data = json;

    expect(spy).toHaveBeenCalled();
  });

  test("Should throw an error when the json is malformed", () => {
    const json = {
      name: "France",
      people: [
        {
          name: "Charles",
          animals: [
            {
              name: "Clovis",
            },
            {
              firstName: "Sanga",
            },
          ],
        },
      ],
    };
    const spy = jest.spyOn(dataSource, "isDataValid");

    const setData = () => {
      dataSource.data = json;
    };

    expect(setData).toThrow(new Error("'source' parameter isn't valid."));
    expect(spy).toHaveBeenCalled();
  });
});

describe("getDataWithChildrenCount", () => {
  test("Should append the children count to the parent name for countries and people", () => {
    const dataSource = new AnimalsDataSource(testData);
    const expectedLength = 5;
    const expectedFirstCountryName = "Dillauti [5]";
    const expectedSecondPersonName = "Blanche Viciani [8]";

    const results = dataSource.getDataWithChildrenCount();
    const firstCountryName = results[0]?.name;
    const secondPersonName = results[0]?.people[1]?.name;

    expect(results).toBeInstanceOf(Array);
    expect(results.length).toBe(expectedLength);
    expect(firstCountryName).toBe(expectedFirstCountryName);
    expect(secondPersonName).toBe(expectedSecondPersonName);
  });
});

describe("populateDocuments", () => {
  test("Should return one result for one document", () => {
    const documents = [
      { countryPosition: 0, personPosition: 1, animalPosition: 2 },
    ];
    const dataSource = new AnimalsDataSource(testData);
    const expectedLength = 1;

    const result = dataSource.populateDocuments(documents);

    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBe(expectedLength);
    expect(result[0]).toStrictEqual({
      name: "Dillauti",
      people: [
        {
          name: "Blanche Viciani",
          animals: [
            {
              name: "Snakes",
            },
          ],
        },
      ],
    });
  });

  test("Should return 0 results if document countries doesn't exist", () => {
    const documents = [
      { countryPosition: 10, personPosition: 1, animalPosition: 2 },
    ];
    const dataSource = new AnimalsDataSource(testData);
    const expectedLength = 0;

    const result = dataSource.populateDocuments(documents);

    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBe(expectedLength);
  });
});
