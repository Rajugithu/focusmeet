const request = require('supertest');
const { expect } = require('chai');
const readline = require('readline');
const app = require('./server');

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Helper function to prompt for user input
function questionAsync(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

describe('POST /routes/auth/login', () => {
    let email, password;

    before(async function () {
        this.timeout(0); // Disable timeout to wait indefinitely for user input

        // Prompt for email and password at runtime
        email = await questionAsync('Enter email: ');
        password = await questionAsync('Enter password: ');

        rl.close(); // Close the readline interface
    });

    it('should login successfully with valid credentials', async () => {
        const res = await request(app)
            .post('/routes/auth/login')
            .send({ email, password }); // Use the runtime input

        expect(res.statusCode).to.equal(200); // Expect status 200
        expect(res.body).to.have.property('token'); // Expect a token in the response

        // Check if login is successful and print the message
        if (res.statusCode === 200 && res.body.token) {
            console.log('Login successful'); // Print only this message for success
        }
    });

    it('should fail to login with invalid credentials', async () => {
        const res = await request(app)
            .post('/routes/auth/login')
            .send({ email, password: 'wrongpassword' }); // Use a wrong password

        expect(res.statusCode).to.equal(400);
        expect(res.body).to.have.property('msg', 'Invalid credentials');
        //no console.log here.
    });
});