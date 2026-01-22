import { BaseController } from "./BaseController";
import { ENDPOINTS } from "../../utils/endpoints";
import { ITEM_TYPES, HTTP_STATUS } from "../../utils/constants";

export class CartController extends BaseController {
    constructor(request, userUuid) {
        super(request, userUuid);
    }

    async addItem(productId, count = 1) {
        const response = await this.request.post(ENDPOINTS.cartItems, {
            headers: this.getHeaders(),
            data: {
                id: productId,
                type: ITEM_TYPES.PRODUCT,
                count: count
            }
        });
        
        await this.expectStatus(response, HTTP_STATUS.NO_CONTENT);
        console.log(`Add to cart product: [${productId}]`);

        return response;
    }

    async removeItem(cartItemId) {
        const response = await this.request.delete(`${ENDPOINTS.cartItems}/${cartItemId}`, {
            headers: this.getHeaders(),
        });

        await this.expectStatus(response);
        console.log(`Removed product: ${cartItemId}`);

        return response;
    }

    async findItemInCart(productId) {
        const items = await this.getCartItems();
        return items.find(i => i.entityId == productId) || null;
    }

    async getItemIdByProductId(productId) {
        const item = await this.findItemInCart(productId);
        console.log(`Product [${productId}]: ${item ? 'Found ItemID ' + item.itemId : 'Not Found'}`);
        return item ? item.itemId : null;
    }

    async verifyProductInCart(productId) {
        const item = await this.findItemInCart(productId);

        if (!item) {
            const currentItems = (await this.getCartItems()).map(i => i.entityId);
            throw new Error(`Assertion failed: Product [${productId}] not found. Current cart: [${currentItems.join(', ')}]`);
        }

        console.log(`Verified: Product [${productId}] is in cart (ItemID: ${item.itemId})`);
        return item.itemId;
    }

    async verifyProductNotInCart(productId) {
        const item = await this.findItemInCart(productId);

        if (item) {
            throw new Error(`Assertion failed: Product [${productId}] found in cart, but should be absent.`);
        }

        console.log(`Verified: Product [${productId}] is absent from cart.`);
    }





    async getCartItems() {
        const response = await this.request.get(ENDPOINTS.cart, {
            headers: this.getHeaders()
        });
        await this.expectStatus(response);

        const body = await response.json();
        return body?.data?.items || [];
    }

    async getItemIdByProductId(productId) {
        const items = await this.getCartItems();
        
        const item = items.find(i => i.entityId == productId);
        
        console.log(`Searching for ProductID: ${productId} | Result: ${item ? 'Found ItemID ' + item.itemId : 'Not Found'}`);
        return item ? item.itemId : null;
    }

    async verifyCartIsEmpty() {
        const items = await this.getCartItems();
        
        if (items.length !== 0) {
            console.error('Cart contains:', items.map(i => i.entityId));
            throw new Error(`Pre-condition failed: Cart is not empty. Found ${items.length} items.`);
        }
    }
}