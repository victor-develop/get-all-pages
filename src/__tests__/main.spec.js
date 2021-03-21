'use strict'

const { streamAllPages } = require("../main")

describe('stream', () => {
    test('works as expected', () => {
        const getPage = async ([a, b] = [0, 0]) => {
            return [a + 1, b + 3]
        }
        streamAllPages({
            getPage,
            hasNextPage: async ([x, y]) => (x + y < 10),
            extractDataListFromPage: async (x) => x
        }).flatten().toArray((arr) => {
            expect(arr).toEqual([ 1, 3, 2, 6, 3, 9 ])
        })
    })
})
