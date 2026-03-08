import { Locator, Page } from "@playwright/test";

export class SearchPage {
    readonly page: Page;
    readonly baseURL: string;
    readonly searchInput: Locator;
    readonly selectItem: Locator;


    constructor(page: Page, baseURL: string) {
        this.page = page;
        this.baseURL = baseURL;
        this.searchInput = page.getByPlaceholder('Search for anything');
        this.selectItem = page.locator('ul.srp-results li.s-card');
    }
    // Navigate to the base URL
    async navigate() {
        await this.page.goto(this.baseURL);
    }

    // Perform a search for a specific item
    async searchForItem(item: string) {
        await this.searchInput.fill(item);
        await this.searchInput.press('Enter');
    }

    // Select the first item from the search results and return the new page
    async selectFirstItem(): Promise<Page> {
        const [newPage] = await Promise.all([
            this.page.waitForEvent('popup'),
            this.selectItem.first().click(),
        ]);
        // Wait for the new page to fully load
        await newPage.waitForLoadState('domcontentloaded');
        return newPage;
    }

    // Get the count of related products on the ITEM page
    async getRelatedProductsCount(itemPage: Page): Promise<number> {
        // Wait for the section to appear on the ITEM page
        await itemPage.waitForSelector('#placement101875', { timeout: 10000 });
        const relatedProducts = itemPage.locator('#placement101875 a.wwfl');
        await relatedProducts.first().waitFor({ timeout: 10000 });
        return await relatedProducts.count();
    }

    // Get the Top Rated Plus related products on the ITEM page
    async getTopRatedPlusRelatedItems(itemPage: Page): Promise<Locator> {
        await itemPage.waitForSelector('#placement101875', { timeout: 10000 });

        return itemPage.locator('#placement101875 .s-item').filter({
            hasText: 'Top Rated Plus'
        });
    }

    // Get the count of Top Rated Plus related products on the ITEM page
    async getTopRatedPlusRelatedCount(itemPage: Page): Promise<number> {
        const items = await this.getTopRatedPlusRelatedItems(itemPage);
        return await items.count();
    }

    //Get the price of the main product on the ITEM page
    async getMainProductPrice(itemPage: Page): Promise<string> {
        await itemPage.waitForSelector('[data-testid="x-price-primary"]', { timeout: 10000 });
        return await itemPage
            .locator('#mainContent div.x-price-primary span.ux-textspans')
            .first()
            .innerText();

    }

    // Get the prices of the related products on the ITEM page
    async getRelatedProductPrices(itemPage: Page): Promise<string[]> {
        await itemPage.waitForSelector('#placement101875 div.aQ4i', { timeout: 10000 });
        const relatedProducts = itemPage.locator('#placement101875 div.aQ4i');
        const count = await relatedProducts.count();
        const prices: string[] = [];
        for (let i = 0; i < count; i++) {
            const price = await relatedProducts.nth(i).innerText();
            prices.push(price);
        }
        return prices;
    }

    // Get the titles of the related products on the ITEM page
    async getRelatedProductTitles(itemPage: Page): Promise<string[]> {
        await itemPage.waitForSelector('#placement101875 div.r2-E', { timeout: 10000 });
        const relatedProducts = itemPage.locator('#placement101875 div.r2-E');
        const count = await relatedProducts.count();
        const titles: string[] = [];
        for (let i = 0; i < count; i++) {
            const title = await relatedProducts.nth(i).innerText();
            titles.push(title);
        }
        return titles;
    }

    // Click on the first related product 
    async clickOnFirstRelatedProduct(itemPage: Page): Promise<Page> {
        await itemPage.waitForSelector('#placement101875', { timeout: 10000 });
        const relatedProducts = itemPage.locator('#placement101875 a.wwfl');
        const [newPage] = await Promise.all([
            itemPage.waitForEvent('popup'),
            relatedProducts.first().click(),
        ]);
        await newPage.waitForLoadState('domcontentloaded');
        return newPage;
    }

}