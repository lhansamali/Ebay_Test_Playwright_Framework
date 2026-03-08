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

    async navigate() {
        await this.page.goto(this.baseURL);
    }

    async searchForItem(item: string) {
        await this.searchInput.fill(item);
        await this.searchInput.press('Enter');
    }

    async selectFirstItem(): Promise<Page> {
        const [newPage] = await Promise.all([
            this.page.waitForEvent('popup'),
            this.selectItem.first().click(),
        ]);
        // Wait for the new page to fully load
        await newPage.waitForLoadState('domcontentloaded');
        return newPage;
    }

    async getRelatedProductsCount(itemPage: Page): Promise<number> {
        // Wait for the section to appear on the ITEM page
        await itemPage.waitForSelector('#placement101875', { timeout: 10000 });
        const relatedProducts = itemPage.locator('#placement101875 a.wwfl');
        await relatedProducts.first().waitFor({ timeout: 10000 });
        return await relatedProducts.count();
    }
    async getTopRatedPlusRelatedItems(itemPage: Page): Promise<Locator> {
        await itemPage.waitForSelector('#placement101875', { timeout: 10000 });

        return itemPage.locator('#placement101875 .s-item').filter({
            hasText: 'Top Rated Plus'
        });
    }

    async getTopRatedPlusRelatedCount(itemPage: Page): Promise<number> {
        const items = await this.getTopRatedPlusRelatedItems(itemPage);
        return await items.count();
    }

    async getMainProductPrice(itemPage: Page): Promise<string> {
        await itemPage.waitForSelector('[data-testid="x-price-primary"]', { timeout: 10000 });
        return await itemPage
            .locator('#mainContent div.x-price-primary span.ux-textspans')
            .first()
            .innerText();

    }
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