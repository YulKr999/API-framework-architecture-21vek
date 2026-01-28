import { BaseController } from "./BaseController";
import { ENDPOINTS } from "../../utils/endpoints";
import { ITEM_TYPES } from "../../utils/constants";

export class CartController extends BaseController {

    async getCartResponse() {
        return await this.request.get(ENDPOINTS.cart, { headers: this.getHeaders() });
    }

    async addItem(productId, count = 1) {
        return await this.request.post(ENDPOINTS.cartItems, {
            headers: this.getHeaders(),
            data: {
                id: productId,
                type: ITEM_TYPES.PRODUCT,
                count: count
            }
        });
    }

    async removeItem(cartItemId) {
        return await this.request.delete(`${ENDPOINTS.cartItems}/${cartItemId}`, {
            headers: this.getHeaders(),
        });
    }

    async getCartItems() {
        const response = await this.getCartResponse();
        await this.validate(response); 
        
        const body = await response.json();
        return body?.data?.items || [];
    }
}