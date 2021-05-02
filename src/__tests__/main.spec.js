'use strict';

const { streamAllPages } = require('../main');

describe('streamAllPages', () => {
  test('works as expected', () => {
    const getPage = async ([a, b] = [0, 0]) => {
      return [a + 1, b + 3];
    };
    streamAllPages({
      getPage,
      hasNextPage: async ([x, y]) => x + y < 10,
      extractDataListFromPage: async (x) => x,
    })
      .flatten()
      .toArray((arr) => {
        expect(arr).toEqual([1, 3, 2, 6, 3, 9]);
      });
  });
  test('stop retrieving pages on max page = 2', () => {
    const getPage = async ([a, b] = [0, 0]) => {
      return [a + 1, b + 3];
    };
    streamAllPages({
      getPage,
      hasNextPage: async ([x, y]) => x + y < 10,
      extractDataListFromPage: async (x) => x,
      maxNumberOfPages: 2,
    })
      .flatten()
      .toArray((arr) => {
        // 2 pages total 4 numbers only
        expect(arr).toEqual([1, 3, 2, 6]);
      });
  });
  test('stop retrieving pages on max page = 1', () => {
    const getPage = async ([a, b] = [0, 0]) => {
      return [a + 1, b + 3];
    };
    streamAllPages({
      getPage,
      hasNextPage: async ([x, y]) => x + y < 10,
      extractDataListFromPage: async (x) => x,
      maxNumberOfPages: 1,
    })
      .flatten()
      .toArray((arr) => {
        // 2 pages total 4 numbers only
        expect(arr).toEqual([1, 3]);
      });
  });
  test('stop retrieving pages on max page = 0', () => {
    const getPage = async ([a, b] = [0, 0]) => {
      return [a + 1, b + 3];
    };
    expect(() =>
      streamAllPages({
        getPage,
        hasNextPage: async ([x, y]) => x + y < 10,
        extractDataListFromPage: async (x) => x,
        maxNumberOfPages: 0,
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"maxNumberOfPages cannot be less than 1"`,
    );
  });
});
