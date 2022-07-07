// Modules
const server = require('supertest')('https://dry-dusk-17745.herokuapp.com/');
const expect = require('chai').expect;

// Homepage
describe('GET /', function () {
    it('Homepage', async function () {
        const response = await server.get('/');
        expect(response.status).to.eql(200);
    });
});

// Single product
describe('GET /products/25565189', function () {
    it('Single product page', async function () {
        const response = await server.get('/products/25565189');
        expect(response.status).to.eql(200);
    });
});

// Categories
describe('GET /categories/womens', function () {
    it('Categories Page', async function () {
        const response = await server.get('/categories/womens');
        expect(response.status).to.eql(200);
    });
});

// Cart page, no login! -> protected route
describe('GET /cart', function () {
    it('Cart without login', async function () {
        const response = await server.get('/cart');
        expect(response.status).to.eql(401);
    });
});

// Logging in
describe('POST /login', function () {
    it('Authentication', async function () {
        const response = await server
            .post('/api/auth/signin')
            .send({ secretKey: process.env.JWT_SECRET, email: 'test@test.com', password: '123456' });
        expect(response.status).to.eql(200);
    });
});
