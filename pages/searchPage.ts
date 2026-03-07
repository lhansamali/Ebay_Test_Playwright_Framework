import { Locator, Page } from "@playwright/test";

export class SearchPage {
    readonly page: Page;
    readonly baseURL: string;
    readonly searchInput: Locator;
    readonly selectItem: Locator;
    readonly relatedProducts: Locator;

    constructor(page: Page, baseURL: string) {
        this.page = page;
        this.baseURL = baseURL;
        this.searchInput = page.getByPlaceholder('Search for anything');
        this.selectItem = page.locator('ul.srp-results li.s-card');
        this.relatedProducts = page.locator('div.MHN- div.uV_m a.wwfl');
    }
    async navigate() {
        await this.page.goto(this.baseURL);
    }
    async searchForItem(item: string) {
        await this.searchInput.fill(item);
        await this.searchInput.press('Enter');
    }
    async selectFirstItem() {
        const [newPage] = await Promise.all([
            this.page.context().waitForEvent('page'),
            this.selectItem.first().click(),
        ]);
        return newPage;
    }
    async getRelatedProductsCount() {
        return await this.relatedProducts.count();
    }

}