type IterateAllPagesInput<Page, Item> = {
  getPage: ((previousPage?: Page) => Promise<Page>),
  hasNextPage: ((previousPage?: Page) => Promise<boolean>),
  extractDataListFromPage: ((p: Page) => Promise<Item[]>)
}

import * as highland from 'highland'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const generator = <Page extends unknown, Item extends unknown> ({getPage, hasNextPage, extractDataListFromPage}: IterateAllPagesInput<Page, Item>) => {
  let page: undefined | Promise<Page>;
  return function (push, next) {
    const handleResolvedPage = resolvedPage => {
      // push the data list into stream
      extractDataListFromPage(resolvedPage).then(dataList => push(null, dataList))
      hasNextPage(resolvedPage).then(resolvedHasNextPage => resolvedHasNextPage
        // signify that this function can be called again for next page
        ? next()
        // signify the end of stream, no more data
        : push(null, highland.nil))
      return resolvedPage
    }
    if (page === undefined) {
      // get the first page and resolve
      page = getPage().then(handleResolvedPage)
    } else {
      // get the next page then resolve, set page to next page
      page = page.then(getPage).then(handleResolvedPage)
    }
  }
}

export const generatorWithMaxPageLimit = <Page extends unknown, Item extends unknown> ({getPage, hasNextPage, extractDataListFromPage, maxNumberOfPages}: IterateAllPagesInput<Page, Item> & {maxNumberOfPages?: number}): ReturnType<typeof generator> => {
  if (maxNumberOfPages < 1) {
    throw new Error('maxNumberOfPages cannot be less than 1')
  }
  let retrievedPages = 0
  function getPageCountPage(...args: Parameters<typeof getPage>) : ReturnType<typeof getPage> {
    return getPage(...args).then(p => {
      retrievedPages++;
      return p
    })
  }
  async function shouldGetNextPage(...args: Parameters<typeof hasNextPage>): ReturnType<typeof hasNextPage> {
    if (maxNumberOfPages !== undefined && retrievedPages >= maxNumberOfPages) {
      return false
    }
    return hasNextPage(...args)
  }
  return generator(
    {
      getPage: getPageCountPage,
      hasNextPage: shouldGetNextPage,
      extractDataListFromPage
    }
  )
}

export function streamAllPages<Page, Item> (args: IterateAllPagesInput<Page, Item> & {
  maxNumberOfPages?: number;
}): Highland.Stream<Item> {
  return highland(
    generatorWithMaxPageLimit(args)
  )
}
