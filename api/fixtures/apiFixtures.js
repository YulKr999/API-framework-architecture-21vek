import { test as base } from '@playwright/test';
import { CartController } from '../../api/controllers/CartController';
import { CatalogController } from '../../api/controllers/CatalogController';
import { generateUuid } from '../../utils/uuid';

export const test = base.extend({
    userUuid: async ({}, use) => {
        await use(generateUuid());
    },

    cartController: async ({ request, userUuid }, use) => {
        await use(new CartController(request, userUuid));
    },

    catalogController: async ({ request }, use) => {
        await use(new CatalogController(request));
    }
});

export { expect } from '@playwright/test';