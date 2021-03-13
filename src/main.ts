type IterateAllPagesInput<Page, Item> = {
  getPage: ((previousPage?: Page) => Promise<Page>) | ( (previousPage?: Page) => Page),
  hasNextPage: ((previousPage?: Page) => Promise<boolean>) | ((previousPage?: Page) => Promise<boolean>),
  extractDataListFromPage: ((p:Page) => Item[]) | ((p:Page) => Promise<Item[]>)
}

type IterateAllPagesGenerator<Page, Item> = (args: IterateAllPagesInput<Page, Item>) => (maxPages: number) => AsyncGenerator<unknown[], void, unknown>

export const generator: IterateAllPagesGenerator<unknown, unknown>  = ({
  getPage,
  hasNextPage,
  extractDataListFromPage
}) => {
  return async function* iterateAllPages(maxPages: number) {
      let page;
      for (let round = 0; round < maxPages; round++) {

        if (round === 0) {
          page = await getPage()
        } else {
          page = await getPage(page)
        }

        const dataList = await extractDataListFromPage(page)
        yield dataList

        if (!(await hasNextPage(page))) {
          break;
        }
      }
      return;
  }
}
