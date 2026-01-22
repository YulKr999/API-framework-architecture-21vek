import { BaseController } from "./BaseController";
import { ENDPOINTS } from '../../utils/endpoints';

export class CatalogController extends BaseController {
    constructor(request, userUuid = null) {
        super(request, userUuid);
    }

    async getWeeklyProducts() {
        const response = await this.request.get(ENDPOINTS.weeklyProducts);
        await this.expectStatus(response);
        
        const body = await response.json();

        if (!body.products || !Array.isArray(body.products)) {
            throw new Error(`Invalid API response: 'products' field is missing or not an array. URL: ${ENDPOINTS.weeklyProducts}`);
        }

        return body.products; 
    }

    async getRandomProduct() {
        const products = await this.getWeeklyProducts();

        const randomIndex = Math.floor(Math.random() * products.length);
        const product = products[randomIndex];
        
        console.log(`Selected product for test: [${product.code}] ${product.name}`);

        return product.code;
    }


}