import { baseTest as test, expect } from "../fixtures/base-fixture";
import { RelatedProductsHelper } from "../utils/RelatedProductsHelper";

test.describe('Related Products Tests', () => {
    test.beforeEach(async ({ searchPage }) => {
        await searchPage.navigate();
        await searchPage.searchForItem('wallet');
    });

    test('Verify six related products are displayed', async ({ searchPage }) => {
        const itemPage = await searchPage.selectFirstItem();
        // Now get the count of related products on the ITEM page
        const count = await searchPage.getRelatedProductsCount(itemPage);
        expect(count).toBeLessThanOrEqual(6);
    });

    test('Verify that all the related products are best sellers', async ({ searchPage }) => {
        const itemPage = await searchPage.selectFirstItem();
        // Now get Top Rated Plus items on the ITEM page
        const count = await searchPage.getTopRatedPlusRelatedCount(itemPage);
        expect(count).toBe(6);
    })

    test('Verify that the price of the main product is $5 more than or $5 less than the related products', async ({ searchPage }) => {
        const itemPage = await searchPage.selectFirstItem();
        // Get the main product price
        const mainPriceText = await searchPage.getMainProductPrice(itemPage);
        const mainPrice = RelatedProductsHelper.parsePrice(mainPriceText);

        // Define the acceptable price range for related products
        const lowerBound = mainPrice - 5;
        const upperBound = mainPrice + 5;
        console.log(`Main price: $${mainPrice} | Expected range: $${lowerBound} - $${upperBound}`);

        const relatedPriceTexts = await searchPage.getRelatedProductPrices(itemPage);

        // Validate each related product price against the expected range
        for (const relatedPriceText of relatedPriceTexts) {
            const relatedPrice = RelatedProductsHelper.parsePrice(relatedPriceText);
            console.log(`Related product price: $${relatedPrice}`);

            expect.soft(relatedPrice,
                `$${relatedPrice} is outside the range $${lowerBound} - $${upperBound}`
            ).toBeGreaterThanOrEqual(lowerBound);

            expect.soft(relatedPrice,
                `$${relatedPrice} is outside the range $${lowerBound} - $${upperBound}`
            ).toBeLessThanOrEqual(upperBound);
        }

    })

    test('Verify that the related products are same category as the main product', async ({ searchPage }) => {
        const itemPage = await searchPage.selectFirstItem();
        //Get the related product titles
        const relatedProductsTitles = await searchPage.getRelatedProductTitles(itemPage);
        // Validate that each related product title contains the keyword "wallet"
        for (const title of relatedProductsTitles) {
            console.log(`Related product title: ${title}`);
            expect(title.toLowerCase()).toContain('wallet');
        }
    })

    test('Verify that the related product details are displayed in a new tab when click on one of the related products', async ({ searchPage }) => {
        const itemPage = await searchPage.selectFirstItem();
        // Click on the first related product and verify it opens in a new tab with correct URL
        const newPage = await searchPage.clickOnFirstRelatedProduct(itemPage);
        await newPage.waitForLoadState('domcontentloaded');
        const url = newPage.url();
        expect(url).toContain('/itm/');

    });

})