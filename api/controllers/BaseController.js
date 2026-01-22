import { HTTP_STATUS } from '../../utils/constants';

export class BaseController {
    constructor(request, userUuid) {
        this.request = request;
        this.userUuid = userUuid;
    }

    getHeaders() {
        return {
            'X-Gate-User-Uuid': this.userUuid,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
    }

    async expectStatus(response, expectedStatus = HTTP_STATUS.OK) {
        const actualStatus = response.status();
        if (actualStatus !== expectedStatus) {
            const body = await response.text().catch(() => 'No body');
            const method = response.request().method();
            const url = response.url();

            throw new Error(
                `API Assertion Failed!\n` +
                `Request: ${method} ${url}\n` +
                `Expected status: ${expectedStatus}\n` +
                `Actual status: ${actualStatus}\n` +
                `Response body: ${body.length > 500 ? body.substring(0, 500) + '...' : body}`
            );
        }
    }
}