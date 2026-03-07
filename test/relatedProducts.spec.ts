import { beforeEach } from "node:test";
import { baseTest as test, expect } from "../fixtures/BaseTest";

test.describe('Related Products Tests', () => {
    test.beforeEach(async ({ searchPage }) => {
        await searchPage.navigate();
        await searchPage.searchForItem('wallet');
        await searchPage.selectFirstItem();

    });
    test('Verify related products are displayed', async ({ searchPage }) => {
        const relatedProductsCount = await searchPage.getRelatedProductsCount();
        expect(relatedProductsCount).toBe(6);
    });
    test('Verify that all the related products are best sellers', async ({ searchPage }) => {
       
        const relatedProductsCount = await searchPage.getRelatedProductsCount();
        for (let i = 0; i < relatedProductsCount; i++) {
            await expect(searchPage.relatedProducts.nth(i)).toContainText('Top Rated Plus');
        }
    })

})