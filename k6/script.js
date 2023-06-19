import http from 'k6/http';
import { check, sleep } from 'k6';
import { randomItem } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import { describe, expect } from 'https://jslib.k6.io/k6chaijs/4.3.4.3/index.js';

const endpoint = `${__ENV.FRONT}`;

const products = [
    '0PUK6V6EV0',
    '1YMWWN1N4O',
    '2ZYFJ3GM2N',
    '66VCHSJNUP',
    '6E92ZMYYFZ',
    '9SIQT8TOJO',
    'L9ECAV7KIM',
    'LS4PSXUNUM',
    'OLJCESPC7Z'];

const currencies = ['EUR', 'USD', 'JPY', 'CAD'];

export const options = {
    // thresholds: {
    //     http_req_failed: ['rate<0.01'], // http errors should be less than 1%
    //     http_req_duration: ['p(95)<200'], // 95% of requests should be below 200ms
    // },
    discardResponseBodies: true,
    scenarios: {
        index: {
            executor: 'ramping-vus',
            exec: 'index',
            startVUs: 20,
            stages: [
                { duration: '30s', target: 50 },
                { duration: '1m30s', target: 100 },
                // { duration: '1m30s', target: 5000 },
                // { duration: '2m', target: 50000 },
                // { duration: '1m', target: 5000 },
                // { duration: '1m', target: 500 },
                { duration: '1m', target: 50 },
            ],
            gracefulRampDown: '5s',
        },
        setCurrency: {
            executor: 'constant-arrival-rate',
            exec: 'setCurrency',
            // How long the test lasts
            duration: '30s',
            // How many iterations per timeUnit
            rate: 10,
            // Start `rate` iterations per second
            timeUnit: '1s',
            // Pre-allocate VUs
            preAllocatedVUs: 50,
        },
        browseProduct: {
            executor: 'ramping-arrival-rate',
            exec: 'browseProduct',
            stages: [
                { duration: '30s', target: 50 },
                // { duration: '1m30s', target: 500 },
                // { duration: '1m30s', target: 5000 },
                // { duration: '2m', target: 500 },
                { duration: '1m', target: 50 },
            ],
            // Pre-allocate VUs
            preAllocatedVUs: 250,
        },
        viewCart: {
            executor: 'ramping-arrival-rate',
            exec: 'viewCart',
            stages: [
                { duration: '30s', target: 50 },
                // { duration: '1m30s', target: 500 },
                // { duration: '1m30s', target: 5000 },
                // { duration: '2m', target: 500 },
                { duration: '1m', target: 50 },
            ],
            // Pre-allocate VUs
            preAllocatedVUs: 250,
        },
        addToCart: {
            executor: 'ramping-arrival-rate',
            exec: 'addToCart',
            stages: [
                { duration: '30s', target: 10 },
                // { duration: '1m30s', target: 500 },
                // { duration: '1m30s', target: 5000 },
                // { duration: '2m', target: 500 },
                { duration: '1m', target: 10 },
            ],
            // Pre-allocate VUs
            preAllocatedVUs: 50,
        },
        checkout: {
            executor: 'ramping-arrival-rate',
            exec: 'checkout',
            stages: [
                { duration: '1m30s', target: 50 },
                // { duration: '30s', target: 100 },
                // { duration: '1m30s', target: 200 },
                // { duration: '2m', target: 100 },
                { duration: '1m', target: 50 },
            ],
            // Pre-allocate VUs
            preAllocatedVUs: 250,
        },
    }
};

export function index() {
    // BDD style
    describe('Loads the boutique frontend', () => {
        // when
        const response = http.get(endpoint);

        //then
        expect(response.status, 'response status').to.equal(200);
        sleep(1 + Math.random()); // sleep between 1s and 2s
    });
}

export function browseProduct() {

    // BDD style
    describe('Browse random products', () => {
        //given
        const product = randomItem(products);
        // when
        const response = http.get(endpoint + '/product/' + product);
        //then
        expect(response.status, 'response status').to.equal(200);
        sleep(1 + Math.random()); // sleep between 1s and 2s
    });
}

export function setCurrency() {

    const payload = {
        currency_code: randomItem(currencies),
    };

    const res = http.post(endpoint + '/setCurrency', payload, {});

    check(res, { 'status was 200': (r) => r.status == 200 });
    sleep(1 + Math.random()); // sleep between 1s and 2s
}

export function viewCart() {

    const res = http.get(endpoint + '/cart');

    check(res, { 'status was 200': (r) => r.status == 200 });

    sleep(1 + Math.random()); // sleep between 1s and 2s
}

export function addToCart() {
    const product = randomItem(products);
    http.get(endpoint + '/product/' + product);

    const payload = {
        product_id: product,
        quantity: randomItem([1,2,3,4,5,10]),
      };

    const resAddCart = http.post(endpoint + '/cart', payload, {});

    check(resAddCart, { 'status was 200': (r) => r.status == 200 });
    sleep(1 + Math.random()); // sleep between 1s and 2s
}

export function checkout() {

    addToCart();

    const payload = {
        email: 'someone@example.com',
        street_address: '1600 Amphitheatre Parkway',
        zip_code: '94043',
        city: 'Mountain View',
        state: 'CA',
        country: 'United States',
        credit_card_number: '4432-8015-6152-0454',
        credit_card_expiration_month: '1',
        credit_card_expiration_year: '2039',
        credit_card_cvv: '672',
      };

    const res = http.post(endpoint + '/cart/checkout', payload, {});

    check(res, { 'status was 200': (r) => r.status == 200 , 'protocol is HTTP/2': (r) => r.proto === 'HTTP/2.0', });
    sleep(1 + Math.random()); // sleep between 1s and 2s
}