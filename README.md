[![Node.js version][nodejs-badge]][nodejs]
[![APLv2][license-badge]][license]

# stream-all-pages

When processing paginated data sources, it's quite annoying to write for loops again and again. So I extract a function to help you iterately retrive all your data sources. All you need is to define a function of how to retrieve next page based on previous page's result. Then you will get a stream to consume it. (It's a more powerful stream than native node stream, i.e. [highland stream](https://caolan.github.io/highland/), but you are free to treat it as a simple node stream)

# Sample Usage
Assume that you have an API to fetch data page by page, and the page response includes information of whether next page exitsts. Then your code will look like:

```ts
    // you define how to retrieve a page, previous page will be supplied as the function argument after 1st-page call
    stream({
        getPage: async (previousPage = null) => {
            return fetch(`your/data/source?page=${previousPage.page + 1}`)
        },
        hasNextPage: async (previousPage) => previousPage.has_next,
        extractDataListFromPage: async (page) => page.data
    })
    .flatten()
    // Use toArray when it's okay to buffer the data in memory. Use .pipe(somewhereElse) instead for stream processing if the data is HUGE
    .toArray((arr) => {
        console.log(arr)
    })

```
## License

Licensed under the APLv2. See the [LICENSE](https://github.com/jsynowiec/node-typescript-boilerplate/blob/main/LICENSE) file for details.
