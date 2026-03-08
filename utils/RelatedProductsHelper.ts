export class RelatedProductsHelper {
    public static parsePrice(priceText: string): number {
        //Remove "US $", commas, "/ea"
        return parseFloat(priceText.replace(/[^0-9.]/g, ''));
    }


}