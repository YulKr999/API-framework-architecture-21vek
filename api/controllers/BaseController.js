import { expect } from '@playwright/test';

export class BaseController {
    constructor(request, userUuid) {
        this.request = request;
        this.userUuid = userUuid;
    }

    async validate(response) {
        await expect(response).toBeOK();
        return response;
    }

    getHeaders() {
        return {
            'X-Gate-User-Uuid': this.userUuid,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
    }
}