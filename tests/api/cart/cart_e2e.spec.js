import { test, expect } from '../../../api/fixtures/apiFixtures';

test.describe('Shopping Cart E2E', () => {

    test('Full lifecycle: add, verify, remove', async ({ cartController, catalogController }) => {
        let productId;
        let cartItemId;

        await test.step('PRE-CONDITION: Verify cart is empty', async () => {
            await cartController.verifyCartIsEmpty();
        });

        await test.step('PRE-CONDITION: Get available product from homepage', async () => {
            productId = await catalogController.getRandomProduct();
        });

        await test.step('Add product to cart', async () => {
            await cartController.addItem(productId);
            cartItemId = await cartController.getItemIdByProductId(productId);
        });

        await test.step('Verify item in cart', async () => {
            await cartController.verifyProductInCart(productId);
        });

        await test.step('Remove item from cart', async () => {
            await cartController.removeItem(cartItemId);
        });

        await test.step('Verify item is removed from cart', async () => {
            await cartController.verifyProductNotInCart();
        });
    });
});