import { test, expect } from '../../../api/fixtures/apiFixtures';
import { HTTP_STATUS } from '../../../utils/constants';

test.describe('Shopping Cart E2E', () => {

    test('Full lifecycle: add, verify, remove', async ({ cartController, catalogController }) => {
        let productId;
        let cartItemId;

        await test.step('PRE-CONDITION: Verify cart is empty', async () => {
            const items = await cartController.getCartItems();
            expect(items, 'Cart should be empty before test').toHaveLength(0);
        });

        await test.step('PRE-CONDITION: Get available product from catalog', async () => {
            productId = await catalogController.getRandomProductCode();
            expect(productId, 'Should get a valid product code').not.toBeNull();
        });

        await test.step('Add product to cart', async () => {
            const response = await cartController.addItem(productId);
            await expect(response.status()).toBe(HTTP_STATUS.NO_CONTENT);
            
            
            const items = await cartController.getCartItems();
            const item = items.find(i => i.entityId == productId);
            expect(item, 'Product should be found in cart').toBeDefined();
            cartItemId = item.itemId;
        });

        await test.step('Verify item data in cart', async () => {
            const items = await cartController.getCartItems();
            const item = items.find(i => i.entityId == productId);
            expect(item.entityId.toString()).toBe(productId.toString());
        });

        await test.step('Remove item from cart', async () => {
            const response = await cartController.removeItem(cartItemId);
            expect(response.status()).toBe(HTTP_STATUS.OK);
        });

        await test.step('Verify cart is empty after removal', async () => {
            const itemsAfter = await cartController.getCartItems();
            const item = itemsAfter.find(i => i.entityId == productId);
            
            expect(item, `Product ${productId} should be gone`).toBeUndefined();
            expect(itemsAfter, 'Cart should be empty').toHaveLength(0);
        });
    });
});