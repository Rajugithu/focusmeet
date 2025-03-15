const request = require('supertest');
const { expect } = require('chai');
const readline = require('readline');
const app = require('./server'); // Adjust the path to your server file

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

    console.log(`Testing with email: ${email}`); // Log the email for debugging
    rl.close(); // Close the readline interface
  });

  it('should login successfully with valid credentials', async () => {
    const res = await request(app)
      .post('/routes/auth/login')
      .send({ email, password }); // Use the runtime input

    // Check if login is successful
    if (res.statusCode === 200 && res.body.token) {
      console.log('Login successful'); // Print only this message for success
    } else {
      console.log('Login failed:', res.body); // Log details if login fails
    }

    expect(res.statusCode).to.equal(200); // Expect status 200
    expect(res.body).to.have.property('token'); // Expect a token in the response
  });

  it('should fail to login with invalid credentials', async () => {
    const res = await request(app)
      .post('/routes/auth/login')
      .send({ email, password: 'wrongpassword' }); // Use a wrong password

    // Check if login failed as expected
    if (res.statusCode === 400 && res.body.msg === 'Invalid credentials') {
      console.log('Login failed as expected'); // Print only this message for expected failure
    } else {
      //console.log('Unexpected response:', res.body); // Log details if something unexpected happens

      console.log("Login Successfull...!")
    }

    expect(res.statusCode).to.equal(400); // Expect status 400
    expect(res.body).to.have.property('msg', 'Invalid credentials'); // Expect error message
  });
});