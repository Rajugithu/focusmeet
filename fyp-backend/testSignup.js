const axios = require('axios');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Enter name: ', (name) => {
    rl.question('Enter email: ', (email) => {
        rl.question('Enter password: ', (password) => {
            rl.question('Enter role (student/teacher): ', (role) => {
                // Validate role input
                if (role !== 'student' && role !== 'teacher') {
                    console.log("Invalid role. Please enter 'student' or 'teacher'.");
                    rl.close();
                    return;
                }

                const sampleUser = {
                    name: name,
                    email: email,
                    password: password,
                    role: role
                };

                axios.post('http://localhost:5000/routes/auth/signup', sampleUser)
                .then(response => {
                console.log("User registered successfully!");
                })
                .catch(error => {
                console.log("An error occurred during signup:", error.response ? error.response.data : error.message);
                });

                rl.close();
            });
        });
    });
});
