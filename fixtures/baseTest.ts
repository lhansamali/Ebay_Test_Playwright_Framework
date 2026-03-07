import { Page, test, expect } from '@playwright/test';
import { SearchPage } from '../pages/searchPage';
type BaseTestFixtures = {
    baseURL: string;
    searchPage: SearchPage;
};

export const baseTest = test.extend<BaseTestFixtures>({
    baseURL: 'https://www.ebay.com/',
    searchPage: async ({ page, baseURL }, use) => {
        await page.addInitScript(() => {
            Object.defineProperty(navigator, 'webdriver', {
                get: () => undefined,
            });
        });
        const searchPage = new SearchPage(page, baseURL);
        await use(searchPage);
    }


});
export{expect}