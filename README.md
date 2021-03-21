
# stream-all-pages

When processing paginated data from a source, it's quite annoying to write `for` loops again and again. So I extract a function to help you iterately retrieve all your data conveniently and performantly. All you need is to define a function of how to retrieve next page based on previous page's result. Then you will get a stream to consume it. (It's a more powerful stream than native node stream, i.e. [highland stream](https://caolan.github.io/highland/), but you are free to treat it as a simple node stream)

Since this is a lazy stream, you can consume the data only as much as you need, and process the values without buffering too much stuff in memory.

# Installation

`npm install stream-all-pages`

# Sample Usage
Assume that you have an API to fetch data page by page, and the page response includes information of whether next page exitsts. Then your code will look like:

## Preapre the stream

```ts
    // you define how to retrieve a page, previous page will be supplied as the function argument after 1st-page call
const allPages = stream({
        getPage: async (previousPage = null) => {
            return fetch(`your/data/source?page=${previousPage.page + 1}`)
        },
        hasNextPage: async (previousPage) => previousPage.has_next,
        extractDataListFromPage: async (page) => page.data
    })
```

## Get a flattened list
```ts
// Use toArray when it's okay to buffer the data in memory. Use .pipe(somewhereElse) instead for stream processing if the data is HUGE
allPages.flatten().toArray((arr) => {console.log(arr)})
```

## Take only first few elements regardless of pages
```ts
// Use toArray when it's okay to buffer the data in memory. Use .pipe(somewhereElse) instead for stream processing if the data is HUGE
allPages.flatten().take(5).toArray((arr) => {console.log(arr)})
```

There are still many convenient ways to consumes the stream, which you can reference from [here](https://caolan.github.io/highland/#flatMap)

## License

Licensed under the APLv2. See the [LICENSE](https://github.com/jsynowiec/node-typescript-boilerplate/blob/main/LICENSE) file for details.
