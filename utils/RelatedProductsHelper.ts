export class RelatedProductsHelper {
    /**
     * Parses the price text and returns a number.
     * @param priceText 
     * @returns 
     */
    public static parsePrice(priceText: string): number {
        //Remove "US $", commas, "/ea"
        return parseFloat(priceText.replace(/[^0-9.]/g, ''));
    }


}