import { BaseController } from "./BaseController";
import { ENDPOINTS } from '../../utils/endpoints';

export class CatalogController extends BaseController {

    async getWeeklyProductsResponse() {
        return await this.request.get(ENDPOINTS.weeklyProducts);
    }

    async getRandomProductCode() {
        const response = await this.getWeeklyProductsResponse();
        await this.validate(response); 
        
        const body = await response.json();
        const products = body.products || [];
        
        if (products.length === 0) return null;

        const randomIndex = Math.floor(Math.random() * products.length);
        return products[randomIndex].code;
    }
}